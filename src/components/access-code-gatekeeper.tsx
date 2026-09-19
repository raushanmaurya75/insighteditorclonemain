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
  clearSavedAccessCode,
  type AccessCodeVerificationResult,
} from "@/lib/access-code-service";

interface AccessCodeGatekeeperProps {
  children: React.ReactNode;
}

export function AccessCodeGatekeeper({ children }: AccessCodeGatekeeperProps) {
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCodeInput, setAccessCodeInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Check saved session on mount
  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      const saved = getSavedAccessCode();
      if (!saved) {
        if (mounted) {
          setIsCheckingSession(false);
          setIsAuthenticated(false);
        }
        return;
      }

      const res = await checkSavedSessionLive();
      if (mounted) {
        setIsAuthenticated(res.isValid);
        setIsCheckingSession(false);
        if (!res.isValid && saved) {
          setErrorMessage(res.message);
        }
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // 2. Real-Time Background Security Heartbeat (checks every 12 seconds)
  useEffect(() => {
    if (!isAuthenticated) return;

    const intervalId = setInterval(async () => {
      try {
        const check = await performSecurityHeartbeatCheck();
        if (!check.isValid) {
          // Security violation or expiry/revocation detected in background!
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
  }, [isAuthenticated]);

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
      const targetUrl = "https://t.me/instaji";
      if (typeof window !== "undefined") {
        window.location.href = targetUrl;
      }
    } catch {
      window.open("https://t.me/instaji", "_blank", "noopener,noreferrer");
    }
  };

  // 1. Initial Checking Loading Screen
  if (isCheckingSession) {
    return (
      <div className="fixed inset-0 z-[99999] bg-white flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center shadow-lg shadow-pink-500/25 mb-4 animate-pulse">
          <Camera size={32} className="text-white" />
        </div>
        <div className="w-6 h-6 border-2 border-[#dc2743] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 2. Unauthenticated: Full-Screen Access Code Gatekeeper
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[99999] bg-white text-ink flex flex-col items-center justify-center p-6 overflow-y-auto selection:bg-[#dc2743]/20">
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

            {/* Contact Support Telegram Button */}
            <a
              href="https://t.me/instaji"
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
    );
  }

  // 3. Authenticated: Render Protected Application
  return <>{children}</>;
}
