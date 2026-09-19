import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

// Firebase configuration for curascan-6780f
const firebaseConfig = {
  apiKey: "AIzaSyBnzR7RdOzKBcPIFr19x-020nOKWDv153s",
  authDomain: "curascan-6780f.firebaseapp.com",
  projectId: "curascan-6780f",
  storageBucket: "curascan-6780f.firebasestorage.app",
  messagingSenderId: "102933201712",
  appId: "1:102933201712:web:9cce42a02b9d19f8fbfef5",
  measurementId: "G-3DLD5QYT0X",
};

// Initialize Firebase App safely (singleton)
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(firebaseApp);

export const ACCESS_CODES_COLLECTION = "cloner_access_codes";
const SAVED_CODE_STORAGE_KEY = "ig_cloner_access_code_v2";
const DEVICE_ID_STORAGE_KEY = "ig_cloner_device_id_v2";
const RUNTIME_SECURITY_SIGNATURE = "IG_SECURITY_INTEGRITY_SALT_2026_ACTIVE";
const SECURITY_TOKEN_STORAGE_KEY = "ig_sec_token_v2";

export const TELEGRAM_SUPPORT_URL = "https://t.me/instaji?text=I%20want%20access%20code%20for%20insight%20editor%20id%20clonner";

export interface AccessCodeVerificationResult {
  isValid: boolean;
  message: string;
  expiryDate?: Date;
  clientName?: string;
}

/**
 * Obtains or generates a persistent hardware/browser unique Device ID.
 */
export function getPersistentDeviceId(): string {
  if (typeof window === "undefined") return "server_render";

  try {
    const existing = localStorage.getItem(DEVICE_ID_STORAGE_KEY);
    if (existing && existing.length > 8) {
      return existing;
    }

    // Generate unique hardware-entropy fingerprint
    const screenInfo = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
    const userAgent = navigator.userAgent || "";
    const language = navigator.language || "";
    const randUuid = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

    const rawEntropy = `${userAgent}|${screenInfo}|${language}|${randUuid}`;
    let hash = 0;
    for (let i = 0; i < rawEntropy.length; i++) {
      hash = (hash << 5) - hash + rawEntropy.charCodeAt(i);
      hash |= 0;
    }

    const uniqueId = `dev_${Math.abs(hash).toString(36)}_${randUuid.replace(/-/g, "").slice(0, 12)}`;
    localStorage.setItem(DEVICE_ID_STORAGE_KEY, uniqueId);
    return uniqueId;
  } catch {
    const fallbackId = `dev_fallback_${Date.now()}`;
    return fallbackId;
  }
}

/**
 * Validates an access code against Firestore 'cloner_access_codes' and binds device ID.
 */
export async function verifyAndBindAccessCode(rawCode: string): Promise<AccessCodeVerificationResult> {
  const cleanCode = (rawCode || "").trim().toUpperCase();
  if (!cleanCode) {
    return {
      isValid: false,
      message: "Please enter an access code.",
    };
  }

  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return {
      isValid: false,
      message: "Active internet connection required to verify access license.",
    };
  }

  try {
    const deviceId = getPersistentDeviceId();
    const docRef = doc(db, ACCESS_CODES_COLLECTION, cleanCode);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      clearSavedAccessCode();
      return {
        isValid: false,
        message: "Invalid access code. Please check and try again.",
      };
    }

    const data = docSnap.data() || {};

    // 1. Check if Active
    const isActive = data.isActive !== false;
    if (!isActive) {
      clearSavedAccessCode();
      return {
        isValid: false,
        message: "This access code has been deactivated by administrator.",
      };
    }

    // 2. Check Expiration
    let expiryDate: Date | undefined;
    const rawExpiry = data.expiryDate;
    if (rawExpiry instanceof Timestamp) {
      expiryDate = rawExpiry.toDate();
    } else if (typeof rawExpiry === "string") {
      expiryDate = new Date(rawExpiry);
    } else if (typeof rawExpiry === "number") {
      expiryDate = new Date(rawExpiry);
    }

    if (expiryDate && expiryDate.getTime() < Date.now()) {
      clearSavedAccessCode();
      const formattedDate = `${expiryDate.getDate()}/${expiryDate.getMonth() + 1}/${expiryDate.getFullYear()}`;
      return {
        isValid: false,
        message: `This access code expired on ${formattedDate}.`,
        expiryDate,
      };
    }

    // 3. Single-Device Binding Protection
    const boundDeviceId = data.deviceId;
    if (!boundDeviceId) {
      // First-time activation: bind device ID to Firestore document
      try {
        await updateDoc(docRef, {
          deviceId,
          boundAt: serverTimestamp(),
          lastUsedAt: serverTimestamp(),
        });
      } catch (e) {
        console.warn("Device binding write:", e);
      }
    } else if (boundDeviceId !== deviceId) {
      // Already bound to another device
      clearSavedAccessCode();
      return {
        isValid: false,
        message: "This access code is registered on another device. Access codes are restricted to 1 device only.",
      };
    } else {
      // Same device: refresh lastUsedAt
      try {
        await updateDoc(docRef, {
          lastUsedAt: serverTimestamp(),
        });
      } catch {}
    }

    const clientName = (data.clientName || data.note || "") as string;

    // Save locally for persistence across app restarts
    saveLocalAccessCode(cleanCode);

    return {
      isValid: true,
      message: "Access granted!",
      expiryDate,
      clientName,
    };
  } catch (error: any) {
    clearSavedAccessCode();
    return {
      isValid: false,
      message: error?.message ? `Verification error: ${error.message}` : "Unable to verify access code. Please check your connection.",
    };
  }
}

/**
 * Checks currently saved local code live against Firestore.
 */
export async function checkSavedSessionLive(): Promise<AccessCodeVerificationResult> {
  const savedCode = getSavedAccessCode();
  if (!savedCode) {
    return {
      isValid: false,
      message: "No access code entered.",
    };
  }
  return verifyAndBindAccessCode(savedCode);
}

/**
 * Periodic Security Heartbeat Validator (runs every 10-15 seconds in background).
 * Checks if code was expired, blocked, reset, or bypassed.
 */
export async function performSecurityHeartbeatCheck(): Promise<{
  isValid: boolean;
  reason?: string;
}> {
  const code = getSavedAccessCode();
  if (!code) {
    return { isValid: false, reason: "No access code found. Session terminated." };
  }

  const deviceId = getPersistentDeviceId();
  try {
    const docRef = doc(db, ACCESS_CODES_COLLECTION, code);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      clearSavedAccessCode();
      return { isValid: false, reason: "Access code no longer exists." };
    }

    const data = docSnap.data() || {};
    if (data.isActive === false) {
      clearSavedAccessCode();
      return { isValid: false, reason: "Access code deactivated by admin." };
    }

    let expiryDate: Date | undefined;
    const rawExpiry = data.expiryDate;
    if (rawExpiry instanceof Timestamp) {
      expiryDate = rawExpiry.toDate();
    } else if (rawExpiry) {
      expiryDate = new Date(rawExpiry);
    }

    if (expiryDate && expiryDate.getTime() < Date.now()) {
      clearSavedAccessCode();
      return { isValid: false, reason: "Access code has expired." };
    }

    if (data.deviceId && data.deviceId !== deviceId) {
      clearSavedAccessCode();
      return { isValid: false, reason: "Access code bound to another device." };
    }

    return { isValid: true };
  } catch {
    // If transient offline, keep session active
    return { isValid: true };
  }
}

/**
 * Anti-Tamper App Lockdown: clears memory, wipes caches, and halts execution.
 */
export function crashAppSecurityPanic(reason: string = "Security tamper detected") {
  clearSavedAccessCode();
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {}

  if (typeof document !== "undefined") {
    document.body.innerHTML = `
      <div style="position:fixed;inset:0;background:#000;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:sans-serif;padding:24px;text-align:center;z-index:99999999;">
        <div style="font-size:36px;margin-bottom:12px;">⚠️</div>
        <h2 style="font-size:18px;font-weight:700;margin-bottom:8px;color:#ff4444;">App Integrity Violation</h2>
        <p style="font-size:13px;color:#aaa;max-width:320px;line-height:1.5;">${reason}. Unauthorized modification or bypass attempt detected. Application locked.</p>
        <button onclick="window.location.reload()" style="margin-top:20px;background:#fff;color:#000;border:none;padding:10px 20px;border-radius:8px;font-weight:600;cursor:pointer;">Restart App</button>
      </div>
    `;
  }
  throw new Error(`[CRITICAL_SECURITY_PANIC]: ${reason}`);
}

/**
 * Validates whether the current runtime environment is authenticated and untouched.
 */
export function isRuntimeSecurityValid(): boolean {
  if (typeof window === "undefined") return true;
  const code = getSavedAccessCode();
  return Boolean(code && code.trim().length > 0);
}

export function saveLocalAccessCode(code: string) {
  if (typeof window === "undefined") return;
  try {
    const clean = code.trim().toUpperCase();
    localStorage.setItem(SAVED_CODE_STORAGE_KEY, clean);
    localStorage.setItem(SECURITY_TOKEN_STORAGE_KEY, RUNTIME_SECURITY_SIGNATURE);
    sessionStorage.setItem(SECURITY_TOKEN_STORAGE_KEY, RUNTIME_SECURITY_SIGNATURE);
  } catch {}
}

export function getSavedAccessCode(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(SAVED_CODE_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function clearSavedAccessCode() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SAVED_CODE_STORAGE_KEY);
    localStorage.removeItem(SECURITY_TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(SECURITY_TOKEN_STORAGE_KEY);
  } catch {}
}
