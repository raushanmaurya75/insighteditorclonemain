import React, { useState, useEffect, useRef } from "react";
import {
  KeyRound,
  Shield,
  Send,
  AlertCircle,
  X,
  Camera,
} from "lucide-react";
import {
  verifyAndBindAccessCode,
  checkSavedSessionLive,
  performSecurityHeartbeatCheck,
  getSavedAccessCode,
  getSavedAccessCodeSync,
  clearSavedAccessCode,
  initializeRaspGuards,
  TELEGRAM_SUPPORT_URL,
  type AccessCodeVerificationResult,
} from "@/lib/access-code-service";
import { IgInstagramGlyph, IgMetaLogo } from "@/components/ig-icons";
import { preloadAllHomeFeedData } from "@/lib/profile-store";

interface AccessCodeGatekeeperProps {
  children: React.ReactNode;
}

let hasGlobalSplashCompleted = false;

function checkShouldShowInitialSplash(): boolean {
  if (hasGlobalSplashCompleted) return false;
  if (typeof window !== "undefined") {
    try {
      if (sessionStorage.getItem("ig_app_splash_completed_v4")) {
        hasGlobalSplashCompleted = true;
        return false;
      }
    } catch {}
  }
  return true;
}

export function AccessCodeGatekeeper({ children }: AccessCodeGatekeeperProps) {
  const [isInitialSplash, setIsInitialSplash] = useState(() => checkShouldShowInitialSplash());
  const [isSplashFading, setIsSplashFading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getSavedAccessCodeSync()));
  const [accessCodeInput, setAccessCodeInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Initialize RASP guards immediately on mount
  useEffect(() => {
    try { initializeRaspGuards(); } catch {}
  }, []);

  // 2. Initial Splash Screen + Live Auth Validation + Feed Preloading on App Start
  useEffect(() => {
    let mounted = true;

    async function handleAppLaunch() {
      const shouldSplash = !hasGlobalSplashCompleted;
      const saved = await getSavedAccessCode();

      // Start feed preloading immediately (synchronously sets up cache)
      preloadAllHomeFeedData();

      if (saved) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }

      // Snappy Instagram splash duration (700ms)
      const minSplashTime = shouldSplash ? new Promise((r) => setTimeout(r, 700)) : Promise.resolve();
      const authPromise = saved ? checkSavedSessionLive() : Promise.resolve({ isValid: false, message: "" });

      await minSplashTime;

      if (!mounted) return;

      hasGlobalSplashCompleted = true;
      try {
        sessionStorage.setItem("ig_app_splash_completed_v4", "true");
      } catch {}

      if (shouldSplash) {
        setIsSplashFading(true);
        setTimeout(() => {
          if (mounted) {
            setIsInitialSplash(false);
          }
        }, 250);
      } else {
        setIsInitialSplash(false);
      }

      // Process background auth result without delaying initial render
      authPromise.then((authResult) => {
        if (!mounted) return;
        if (saved) {
          if (authResult.isValid) {
            setIsAuthenticated(true);
          } else if (
            authResult.message &&
            !authResult.message.includes("connection") &&
            !authResult.message.includes("network")
          ) {
            setIsAuthenticated(false);
            setErrorMessage(authResult.message);
          }
        }
      });
    }

    handleAppLaunch();

    return () => {
      mounted = false;
    };
  }, []);

  // 3. Real-Time Background Security Heartbeat (checks every 12 seconds)
  // Combines Firestore validation + RASP runtime integrity check
  useEffect(() => {
    if (!isAuthenticated || isInitialSplash) return;

    const intervalId = setInterval(async () => {
      try {
        const check = await performSecurityHeartbeatCheck();
        if (!check.isValid) {
          // Security violation or expiry/revocation detected in background
          clearSavedAccessCode();
          setIsAuthenticated(false);
          setErrorMessage(check.reason || "Access license revoked or expired.");
        }
      } catch (e) {
        console.warn("Security check cycle:", e);
      }
    }, 12000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isAuthenticated, isInitialSplash]);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = accessCodeInput.trim().toUpperCase();
    if (!code) {
      setErrorMessage("Please enter an access code.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const result: AccessCodeVerificationResult = await verifyAndBindAccessCode(code);

    setIsSubmitting(false);

    if (result.isValid) {
      setIsAuthenticated(true);
    } else {
      setErrorMessage(result.message);
    }
  };

  const handleContactTelegram = () => {
    try {
      if (typeof window !== "undefined") {
        window.location.href = TELEGRAM_SUPPORT_URL;
      }
    } catch {
      window.open(TELEGRAM_SUPPORT_URL, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      {/* 1. Underlying Children (Home feed & routes) - mounted in background during splash */}
      {isAuthenticated && children}

      {/* 2. Unauthenticated: Full-Screen Access Code Gatekeeper */}
      {!isAuthenticated && !isInitialSplash && (
        <div className="fixed inset-0 z-[99999] bg-white text-ink flex flex-col items-center justify-center p-6 overflow-y-auto selection:bg-[#dc2743]/20 animate-fade-in">
          <div className="w-full max-w-[400px] flex flex-col items-center">
            {/* Instagram Gradient Logo */}
            <div className="w-20 h-20 rounded-[22px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center shadow-xl shadow-pink-500/25 mb-6">
              <Camera size={42} className="text-white drop-shadow" />
            </div>

            {/* Title & Description */}
            <h1 className="text-2xl font-bold text-[#1a1a1a] tracking-tight mb-2 text-center">
              Instagram Access
            </h1>
            <p className="text-[13px] text-[#737373] text-center max-w-[320px] leading-relaxed mb-6">
              Please enter your license access code to activate and unlock this application.
            </p>

            {/* Error Message Banner */}
            {errorMessage && (
              <div className="w-full mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 animate-fade-in">
                <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-red-700 leading-snug">
                  {errorMessage}
                </p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleVerify} className="w-full space-y-3.5">
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#dc2743] flex items-center">
                  <KeyRound size={19} />
                </div>
                <input
                  type="text"
                  value={accessCodeInput}
                  onChange={(e) => {
                    setAccessCodeInput(e.target.value.toUpperCase());
                    if (errorMessage) setErrorMessage(null);
                  }}
                  disabled={isSubmitting}
                  placeholder="ENTER ACCESS CODE"
                  className="w-full bg-[#fafafa] text-[#1a1a1a] pl-11 pr-10 py-3.5 border border-[#e5e7eb] rounded-xl text-sm font-bold tracking-wider placeholder:text-[#9ca3af] placeholder:font-medium placeholder:tracking-normal outline-none focus:border-[#dc2743] focus:bg-white transition-all disabled:opacity-50"
                  autoComplete="off"
                  spellCheck="false"
                />
                {accessCodeInput && !isSubmitting && (
                  <button
                    type="button"
                    onClick={() => setAccessCodeInput("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 border-none bg-transparent cursor-pointer"
                    title="Clear"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Verify & Access Button */}
              <button
                type="submit"
                disabled={isSubmitting || !accessCodeInput.trim()}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-bold text-sm border-none cursor-pointer hover:opacity-95 active:scale-[0.99] transition-all shadow-md shadow-pink-500/25 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Verify & Access</span>
                )}
              </button>

              {/* Contact Support Telegram Button with pre-filled text */}
              <a
                href={TELEGRAM_SUPPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  handleContactTelegram();
                }}
                className="w-full py-3 rounded-xl bg-[#f0f9ff] text-[#0095f6] border border-[#bae6fd] font-semibold text-xs cursor-pointer hover:bg-[#e0f2fe] active:scale-[0.99] transition-all flex items-center justify-center gap-2 no-underline"
              >
                <Send size={15} />
                <span>Contact Us for Access Code</span>
              </a>
            </form>

            {/* Single-Device Protection Info Card */}
            <div className="w-full mt-6 p-4 rounded-2xl bg-[#f9fafb] border border-[#e5e7eb] space-y-2">
              <div className="flex items-center gap-2 text-[#0095f6]">
                <Shield size={16} />
                <span className="text-xs font-bold text-[#1f2937]">
                  Single-Device Protection
                </span>
              </div>
              <ul className="text-[11.5px] text-[#6b7280] space-y-1 list-disc pl-4 leading-relaxed">
                <li>Each Access Code is locked to 1 device upon activation.</li>
                <li>Contact administrator if your code expires or needs a device reset.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 3. Initial Splash Screen (overlay on top with z-index, smoothly fades out to reveal rendered content) */}
      {isInitialSplash && (
        <aside
          className={`ig-splash-screen ${isSplashFading ? "is-fading" : ""}`}
          aria-label="Instagram Splash"
          style={{ zIndex: 999999 }}
        >
          <div className="ig-splash-center">
            <div className="ig-splash-glyph-wrap">
              <IgInstagramGlyph size={76} />
            </div>
          </div>

          <footer className="ig-splash-footer">
            <span className="ig-splash-from-text">from</span>
            <img
              src="/images/meta_logo.png"
              alt="Meta"
              className="ig-splash-meta-img"
            />
          </footer>
        </aside>
      )}
    </>
  );
}
