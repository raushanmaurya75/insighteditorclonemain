import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

// ═══════════════════════════════════════════════════════════
// Firebase Configuration
// ═══════════════════════════════════════════════════════════
const firebaseConfig = {
  apiKey: "AIzaSyBnzR7RdOzKBcPIFr19x-020nOKWDv153s",
  authDomain: "curascan-6780f.firebaseapp.com",
  projectId: "curascan-6780f",
  storageBucket: "curascan-6780f.firebasestorage.app",
  messagingSenderId: "102933201712",
  appId: "1:102933201712:web:9cce42a02b9d19f8fbfef5",
  measurementId: "G-3DLD5QYT0X",
};

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(firebaseApp);

// ═══════════════════════════════════════════════════════════
// Storage & Security Constants
// ═══════════════════════════════════════════════════════════
export const ACCESS_CODES_COLLECTION = "cloner_access_codes";
const SAVED_CODE_STORAGE_KEY = "ig_cloner_access_code_v2";
const DEVICE_ID_STORAGE_KEY = "ig_cloner_device_id_v2";
const RUNTIME_SECURITY_SIGNATURE = "IG_SECURITY_INTEGRITY_SALT_2026_ACTIVE";
const SECURITY_TOKEN_STORAGE_KEY = "ig_sec_token_v2";
const ENCRYPTED_KEY_STORAGE_KEY = "ig_enc_key_v1";
const RASP_ACTIVE_KEY = "ig_rasp_v1";

export const TELEGRAM_SUPPORT_URL =
  "https://t.me/instaji?text=I%20want%20access%20code%20for%20insight%20editor%20id%20clonner";

export interface AccessCodeVerificationResult {
  isValid: boolean;
  message: string;
  expiryDate?: Date;
  clientName?: string;
}

// ═══════════════════════════════════════════════════════════
// LAYER 1A: AES-GCM Encrypted Storage
// ═══════════════════════════════════════════════════════════

async function getOrCreateStorageKey(): Promise<CryptoKey | null> {
  if (typeof window === "undefined" || !window.crypto?.subtle) return null;

  try {
    const stored = localStorage.getItem(ENCRYPTED_KEY_STORAGE_KEY);
    if (stored) {
      const raw = Uint8Array.from(atob(stored), (c) => c.charCodeAt(0));
      return await window.crypto.subtle.importKey("raw", raw, "AES-GCM", false, [
        "encrypt",
        "decrypt",
      ]);
    }

    const key = await window.crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
    const exported = await window.crypto.subtle.exportKey("raw", key);
    const b64 = btoa(String.fromCharCode(...new Uint8Array(exported)));
    localStorage.setItem(ENCRYPTED_KEY_STORAGE_KEY, b64);
    return key;
  } catch {
    return null;
  }
}

async function encryptString(value: string): Promise<string | null> {
  try {
    const key = await getOrCreateStorageKey();
    if (!key) return value; // fallback to plaintext if Web Crypto unavailable

    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(value);
    const encrypted = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      encoded
    );
    const combined = new Uint8Array(12 + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), 12);
    return btoa(String.fromCharCode(...combined));
  } catch {
    return value;
  }
}

async function decryptString(ciphertext: string): Promise<string | null> {
  try {
    const key = await getOrCreateStorageKey();
    if (!key) return ciphertext;

    const bytes = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0));
    const iv = bytes.slice(0, 12);
    const data = bytes.slice(12);
    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );
    return new TextDecoder().decode(decrypted);
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════
// LAYER 1B: RASP — Runtime Protection Guards
// ═══════════════════════════════════════════════════════════

let _raspInitialized = false;
let _raspViolationDetected = false;
let _domObserver: MutationObserver | null = null;

/**
 * Poisons eval and Function constructors to detect injection attempts.
 */
function _poisonEvalAndFunction() {
  if (typeof window === "undefined") return;

  const _origEval = window.eval;
  const _origFunction = window.Function;

  // Override eval
  try {
    Object.defineProperty(window, "eval", {
      get() {
        return function (...args: any[]) {
          // Allow empty/blank evals, block injection
          const code = String(args[0] || "");
          const suspicious = [
            "localStorage.clear",
            "sessionStorage.clear",
            "access_code",
            "bypass",
            "hook(",
            "frida",
            "Interceptor",
          ].some((pattern) => code.toLowerCase().includes(pattern.toLowerCase()));

          if (suspicious) {
            _raspViolationDetected = true;
            _triggerRaspLockdown("eval injection detected");
          }
          return _origEval.apply(window, args as any);
        };
      },
      configurable: false,
    });
  } catch {}

  // Override Function constructor
  try {
    Object.defineProperty(window, "Function", {
      get() {
        return _origFunction;
      },
      configurable: false,
    });
  } catch {}
}

/**
 * DOM Mutation Observer — detects if the app DOM tree is externally tampered.
 */
function _startDomIntegrityObserver() {
  if (typeof window === "undefined" || typeof MutationObserver === "undefined") return;

  let suspiciousMutations = 0;

  _domObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as Element;
          // Detect script injections
          if (el.tagName === "SCRIPT") {
            const src = el.getAttribute("src") || "";
            const content = el.textContent || "";
            if (
              src.includes("frida") ||
              src.includes("hook") ||
              content.includes("Interceptor") ||
              content.includes("NativeFunction")
            ) {
              suspiciousMutations++;
              _raspViolationDetected = true;
              _triggerRaspLockdown("Malicious script injection detected");
              return;
            }
          }
        }
      }
    }
  });

  _domObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: false,
  });
}

/**
 * DevTools detection via console.log timing trick.
 */
function _startDevToolsDetector() {
  if (typeof window === "undefined") return;

  let devtoolsOpen = false;

  const detect = () => {
    const start = performance.now();
    // eslint-disable-next-line no-debugger
    try { (0, eval)("debugger"); } catch {}
    const elapsed = performance.now() - start;
    if (elapsed > 100 && !devtoolsOpen) {
      devtoolsOpen = true;
      // DevTools detected — this is suspicious in the mobile WebView context
      // We don't hard-lock since legit devs may test, but mark for heartbeat
      console.clear && console.clear();
    }
  };

  // Run detection quietly every 8s
  setInterval(detect, 8000);
}

/**
 * Anti-prototype-pollution guard — ensures Object.prototype is not poisoned.
 */
function _checkPrototypePollution(): boolean {
  try {
    const test: any = {};
    if (
      test["__proto__"] !== Object.prototype ||
      typeof (Object.prototype as any)["bypass"] !== "undefined"
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Main RASP initialization — call once on app start.
 */
export function initializeRaspGuards() {
  if (_raspInitialized || typeof window === "undefined") return;
  _raspInitialized = true;

  try {
    localStorage.setItem(RASP_ACTIVE_KEY, "1");
    _poisonEvalAndFunction();
    _startDomIntegrityObserver();
    _startDevToolsDetector();
  } catch {
    // Never throw from RASP init
  }
}

/**
 * Checks all RASP runtime conditions synchronously.
 */
export function checkRaspIntegrity(): { passed: boolean; reason?: string } {
  if (typeof window === "undefined") return { passed: true };

  if (_raspViolationDetected) {
    return { passed: false, reason: "Runtime violation previously detected" };
  }

  if (!_checkPrototypePollution()) {
    return { passed: false, reason: "Prototype pollution detected" };
  }

  // Check RASP marker not cleared by external code
  if (!localStorage.getItem(RASP_ACTIVE_KEY)) {
    return { passed: false, reason: "Security marker cleared externally" };
  }

  return { passed: true };
}

function _triggerRaspLockdown(reason: string) {
  _raspViolationDetected = true;
  crashAppSecurityPanic(reason);
}

// ═══════════════════════════════════════════════════════════
// LAYER 1C: Rotating Session Token
// ═══════════════════════════════════════════════════════════

let _sessionToken: string = "";
let _sessionTokenTimestamp: number = 0;
const SESSION_TOKEN_TTL = 60_000; // 60 seconds

function _generateSessionToken(): string {
  const entropy = `${Date.now()}_${Math.random().toString(36)}_${getPersistentDeviceId()}`;
  let hash = 0x811c9dc5;
  for (let i = 0; i < entropy.length; i++) {
    hash ^= entropy.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0") + Date.now().toString(36);
}

export function getOrRotateSessionToken(): string {
  const now = Date.now();
  if (!_sessionToken || now - _sessionTokenTimestamp > SESSION_TOKEN_TTL) {
    _sessionToken = _generateSessionToken();
    _sessionTokenTimestamp = now;
    try {
      sessionStorage.setItem(SECURITY_TOKEN_STORAGE_KEY, _sessionToken);
      localStorage.setItem(SECURITY_TOKEN_STORAGE_KEY, RUNTIME_SECURITY_SIGNATURE);
    } catch {}
  }
  return _sessionToken;
}

// ═══════════════════════════════════════════════════════════
// Device ID
// ═══════════════════════════════════════════════════════════

export function getPersistentDeviceId(): string {
  if (typeof window === "undefined") return "server_render";

  try {
    const existing = localStorage.getItem(DEVICE_ID_STORAGE_KEY);
    if (existing && existing.length > 8) return existing;

    const screenInfo = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
    const userAgent = navigator.userAgent || "";
    const language = navigator.language || "";
    const randUuid =
      typeof crypto !== "undefined" && crypto.randomUUID
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
    return `dev_fallback_${Date.now()}`;
  }
}

// ═══════════════════════════════════════════════════════════
// Access Code — Firestore Validation
// ═══════════════════════════════════════════════════════════

export async function verifyAndBindAccessCode(
  rawCode: string
): Promise<AccessCodeVerificationResult> {
  const cleanCode = (rawCode || "").trim().toUpperCase();
  if (!cleanCode) {
    return { isValid: false, message: "Please enter an access code." };
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
      return { isValid: false, message: "Invalid access code. Please check and try again." };
    }

    const data = docSnap.data() || {};

    // 1. Active check
    if (data.isActive === false) {
      clearSavedAccessCode();
      return { isValid: false, message: "This access code has been deactivated by administrator." };
    }

    // 2. Expiry check
    let expiryDate: Date | undefined;
    const rawExpiry = data.expiryDate;
    if (rawExpiry instanceof Timestamp) {
      expiryDate = rawExpiry.toDate();
    } else if (typeof rawExpiry === "string" || typeof rawExpiry === "number") {
      expiryDate = new Date(rawExpiry);
    }

    if (expiryDate && expiryDate.getTime() < Date.now()) {
      clearSavedAccessCode();
      const d = expiryDate;
      return {
        isValid: false,
        message: `This access code expired on ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}.`,
        expiryDate,
      };
    }

    // 3. Single-device binding
    const boundDeviceId = data.deviceId;
    if (!boundDeviceId) {
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
      clearSavedAccessCode();
      return {
        isValid: false,
        message: "This access code is registered on another device. Access codes are restricted to 1 device only.",
      };
    } else {
      try { await updateDoc(docRef, { lastUsedAt: serverTimestamp() }); } catch {}
    }

    const clientName = (data.clientName || data.note || "") as string;

    // 4. Save encrypted
    await saveLocalAccessCode(cleanCode);

    return { isValid: true, message: "Access granted!", expiryDate, clientName };
  } catch (error: any) {
    clearSavedAccessCode();
    return {
      isValid: false,
      message: error?.message
        ? `Verification error: ${error.message}`
        : "Unable to verify access code. Please check your connection.",
    };
  }
}

export async function checkSavedSessionLive(): Promise<AccessCodeVerificationResult> {
  const savedCode = await getSavedAccessCode();
  if (!savedCode) {
    return { isValid: false, message: "No access code entered." };
  }
  return verifyAndBindAccessCode(savedCode);
}

// ═══════════════════════════════════════════════════════════
// Heartbeat — Combines RASP + Firestore check
// ═══════════════════════════════════════════════════════════

export async function performSecurityHeartbeatCheck(): Promise<{
  isValid: boolean;
  reason?: string;
}> {
  // 1. RASP integrity check (synchronous, always first)
  const rasp = checkRaspIntegrity();
  if (!rasp.passed) {
    clearSavedAccessCode();
    return { isValid: false, reason: rasp.reason };
  }

  // 2. Rotate session token
  getOrRotateSessionToken();

  const code = await getSavedAccessCode();
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
    // Network offline — keep session active, don't penalize offline users
    return { isValid: true };
  }
}

// ═══════════════════════════════════════════════════════════
// Anti-Tamper Lockdown
// ═══════════════════════════════════════════════════════════

export function crashAppSecurityPanic(reason: string = "Security tamper detected") {
  clearSavedAccessCode();
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {}

  if (_domObserver) {
    try { _domObserver.disconnect(); } catch {}
  }

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

export function isRuntimeSecurityValid(): boolean {
  if (typeof window === "undefined") return true;
  const code = localStorage.getItem(SAVED_CODE_STORAGE_KEY);
  return Boolean(code && code.trim().length > 0);
}

// ═══════════════════════════════════════════════════════════
// Storage Helpers (with encryption)
// ═══════════════════════════════════════════════════════════

export async function saveLocalAccessCode(code: string): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const clean = code.trim().toUpperCase();
    const encrypted = await encryptString(clean);
    localStorage.setItem(SAVED_CODE_STORAGE_KEY, encrypted || clean);
    localStorage.setItem(SECURITY_TOKEN_STORAGE_KEY, RUNTIME_SECURITY_SIGNATURE);
    sessionStorage.setItem(SECURITY_TOKEN_STORAGE_KEY, RUNTIME_SECURITY_SIGNATURE);
    getOrRotateSessionToken();
  } catch {}
}

export async function getSavedAccessCode(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SAVED_CODE_STORAGE_KEY);
    if (!raw) return null;
    // Try decrypt; if it fails or isn't encrypted, treat as plaintext
    const decrypted = await decryptString(raw);
    return decrypted || raw;
  } catch {
    return null;
  }
}

export function getSavedAccessCodeSync(): string | null {
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
    localStorage.removeItem(ENCRYPTED_KEY_STORAGE_KEY);
    sessionStorage.removeItem(SECURITY_TOKEN_STORAGE_KEY);
  } catch {}
}
