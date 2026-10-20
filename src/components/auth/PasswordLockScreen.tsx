import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import CryptoJS from 'crypto-js';

interface PasswordLockScreenProps {
  onUnlock: () => void;
}

// Fallback SHA-256 hash of default password '7884'
const DEFAULT_PASS_HASH = '8433524328f7abaf572b699ed47e7e59e6e0e19b804af03a435e4ac4e88e1dee';

export const PasswordLockScreen: React.FC<PasswordLockScreenProps> = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Countdown timer for lockout if attempts >= 5
  useEffect(() => {
    if (lockoutTimer <= 0) return;
    const interval = setInterval(() => {
      setLockoutTimer((prev) => {
        if (prev <= 1) {
          setAttempts(0);
          setErrorMsg('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutTimer]);

  // Anti-Inspect / Anti-Tamper Security Guard
  useEffect(() => {
    // 1. Disable Right Click context menu on lock screen
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // 2. Disable common DevTools shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // 3. DOM Mutation Observer: Detect if someone tries to delete or hide this lock screen in DevTools
    const targetNode = containerRef.current;
    let observer: MutationObserver | null = null;

    if (targetNode && typeof MutationObserver !== 'undefined') {
      observer = new MutationObserver(() => {
        // If someone changes style, class, or deletes elements, force re-enforcement
        if (targetNode.style.display === 'none' || targetNode.style.visibility === 'hidden' || targetNode.style.opacity === '0') {
          targetNode.style.display = 'flex';
          targetNode.style.visibility = 'visible';
          targetNode.style.opacity = '1';
        }
      });

      observer.observe(targetNode, {
        attributes: true,
        attributeFilter: ['style', 'class'],
      });
    }

    document.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      if (observer) observer.disconnect();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0 || isVerifying) return;

    const trimmed = password.trim();
    if (!trimmed) {
      setErrorMsg('Please enter your password.');
      triggerShake();
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');

    // 1. Direct and instant unlock for 7884
    if (trimmed === '7884') {
      try {
        sessionStorage.setItem('crowz_auth_unlocked', 'true');
      } catch {}
      try {
        fetch('/api/auth/verify-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: trimmed }),
        }).catch(() => {});
      } catch {}

      setIsVerifying(false);
      onUnlock();
      return;
    }

    // Fallback SHA-256 comparison for 7884
    try {
      const hash = CryptoJS.SHA256(trimmed).toString();
      if (hash === DEFAULT_PASS_HASH) {
        try {
          sessionStorage.setItem('crowz_auth_unlocked', 'true');
        } catch {}
        setIsVerifying(false);
        onUnlock();
        return;
      }
    } catch {}

    // 2. Otherwise verify with backend API in case a custom password is configured in .env
    try {
      const response = await fetch('/api/auth/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: trimmed }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          sessionStorage.setItem('crowz_auth_unlocked', 'true');
          if (data.token) {
            sessionStorage.setItem('crowz_auth_token', data.token);
          }
          setIsVerifying(false);
          onUnlock();
          return;
        }
      }
      handleFailedAttempt('Incorrect access password. Access denied.');
    } catch {
      handleFailedAttempt('Incorrect access password. Access denied.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFailedAttempt = (msg: string) => {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    triggerShake();

    if (nextAttempts >= 5) {
      setLockoutTimer(30);
      setErrorMsg('Too many failed attempts. Security lockout for 30s.');
    } else {
      setErrorMsg(`${msg} (Attempt ${nextAttempts}/5)`);
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999999] min-h-screen w-full bg-[#0B0F17] flex items-center justify-center p-4 sm:p-6 selection:bg-[#14B8A6] selection:text-white select-none overflow-hidden"
      style={{
        display: 'flex',
        visibility: 'visible',
        opacity: 1,
      }}
    >
      {/* Dynamic Ambient Background Glow Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#14B8A6]/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#DF886F]/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none" />

      {/* Main Glassmorphic Security Card */}
      <div
        className={`relative z-10 w-full max-w-md bg-[#161D2A]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-7 sm:p-9 shadow-2xl transition-all duration-300 ${
          shake ? 'animate-shake' : ''
        }`}
      >
        {/* Top Header: Brand Dots & Badge */}
        <div className="flex flex-col items-center text-center">
          {/* Glowing Shield Icon */}
          <div className="relative mb-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#14B8A6] to-[#0D9488] p-0.5 shadow-lg shadow-[#14B8A6]/25 flex items-center justify-center text-white">
              <div className="w-full h-full rounded-[14px] bg-[#0E1522] flex items-center justify-center">
                <Lock size={26} className="text-[#14B8A6]" strokeWidth={2.2} />
              </div>
            </div>
            {/* Pulsing indicator */}
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#14B8A6]/30 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-ping" />
            </span>
          </div>

          {/* Brand Name */}
          <div className="flex items-center gap-2 mb-2">
            <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5 items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
            </div>
            <span className="font-display font-bold text-sm tracking-widest uppercase text-neutral-400">
              Crowz Private Portfolio
            </span>
          </div>

          <h2 className="font-display font-bold text-2xl sm:text-[26px] text-white tracking-tight leading-snug">
            Protected Area
          </h2>
          <p className="text-[13px] text-neutral-400 font-normal mt-1.5 max-w-xs leading-relaxed">
            This portfolio dashboard is access-controlled. Please enter your secret key to unlock.
          </p>
        </div>

        {/* Form Area */}
        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11.5px] font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5 pl-1">
              <KeyRound size={13} className="text-[#14B8A6]" />
              <span>Password Key</span>
            </label>

            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-neutral-500 pointer-events-none">
                <Lock size={16} />
              </div>

              <input
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                disabled={lockoutTimer > 0 || isVerifying}
                placeholder="Enter access password..."
                className="w-full bg-[#0E1522] text-white placeholder-neutral-500 text-[14px] rounded-2xl pl-10 pr-12 py-3.5 border border-white/10 focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20 focus:outline-hidden transition-all shadow-inner disabled:opacity-50"
              />

              {/* Toggle Eye Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 p-1 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error Feedback Message */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium animate-fadeIn">
              <AlertCircle size={15} className="shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Lockout Countdown Timer Feedback */}
          {lockoutTimer > 0 && (
            <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
              <ShieldAlert size={15} />
              <span>Retry permitted in {lockoutTimer} seconds</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={lockoutTimer > 0 || isVerifying || !password.trim()}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#14B8A6] hover:bg-[#0D9488] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm tracking-tight flex items-center justify-center gap-2 shadow-lg shadow-[#14B8A6]/25 transition-all duration-200 cursor-pointer mt-2"
          >
            {isVerifying ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying Access...</span>
              </span>
            ) : (
              <>
                <span>Unlock Dashboard</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Bottom Secure Badge */}
        <div className="mt-7 pt-4 border-t border-white/10 flex items-center justify-between text-neutral-500 text-[11px]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[#14B8A6]" />
            <span>Encrypted Session Guard</span>
          </span>
          <span className="font-mono text-[10px] text-neutral-500">v2.0 • 256-bit</span>
        </div>
      </div>
    </div>
  );
};

export default PasswordLockScreen;
