import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Unlock, X, ShieldAlert, KeyRound, CheckCircle2, AlertTriangle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface AdminPasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  role?: "admin" | "teacher";
}

export default function AdminPasscodeModal({ isOpen, onClose, onSuccess, role = "admin" }: AdminPasscodeModalProps) {
  const { t } = useLanguage();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPasscode("");
      setError(false);
      setToast(null);
      setIsVerifying(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isVerifying) return;

    const expectedPasscode = role === "teacher" ? "10986" : "80852";

    if (passcode === expectedPasscode) {
      setIsVerifying(true);
      setError(false);
      setToast({ type: "success", message: "Login Successful" });
      
      // Delay closing to let the user enjoy the success visual popup
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } else {
      setError(true);
      setToast({ type: "error", message: "Wrong Password" });
      setPasscode("");
      
      // Clear error toast after 2.5 seconds
      setTimeout(() => {
        setError(false);
        setToast(null);
      }, 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" id="passcode-modal-backdrop">
        
        {/* Floating Toast Popup */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className={`fixed top-6 z-[60] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border ${
                toast.type === "success"
                  ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-300"
                  : "bg-red-950/90 border-red-500/30 text-red-300"
              }`}
              id="global-toast-popup"
            >
              {toast.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-400 animate-shake" />
              )}
              <span className="font-extrabold text-sm tracking-tight">{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl"
          id="passcode-modal-container"
        >
          {/* Decorative Top Accent Line */}
          <div className={`h-1.5 w-full transition-all duration-500 ${
            toast?.type === "success"
              ? "bg-emerald-500"
              : toast?.type === "error"
              ? "bg-red-500"
              : "bg-gradient-to-r from-red-600 via-amber-500 to-red-600"
          }`}></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            disabled={isVerifying}
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-950/50 hover:bg-slate-950 p-1.5 rounded-lg transition-all disabled:opacity-50"
            id="passcode-close-btn"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Header Lock Icon */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                toast?.type === "success"
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                  : error 
                  ? "bg-red-500/10 border border-red-500/30 text-red-500 animate-bounce" 
                  : "bg-amber-500/10 border border-amber-500/30 text-amber-500"
              }`} id="passcode-icon-wrapper">
                {toast?.type === "success" ? (
                  <Unlock className="w-7 h-7" />
                ) : error ? (
                  <ShieldAlert className="w-7 h-7" />
                ) : (
                  <Lock className="w-7 h-7" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-black text-white tracking-tight">
                  {role === "teacher" ? t("role.teacher") : t("role.admin")}
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  {role === "teacher" 
                    ? "Enter the official teacher authorization passcode to unlock classroom privileges."
                    : "Enter the official security authorization passcode to unlock administrative privileges."}
                </p>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Security Passcode (5 Digits)
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    maxLength={10}
                    required
                    disabled={isVerifying}
                    autoFocus
                    placeholder="•••••"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ""))}
                    className={`w-full bg-slate-950 border rounded-xl pl-10 pr-4 py-2.5 text-center text-base tracking-widest font-mono text-white placeholder-slate-800 focus:outline-none transition-all ${
                      toast?.type === "success"
                        ? "border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-emerald-400"
                        : error 
                        ? "border-red-500 focus:ring-1 focus:ring-red-500" 
                        : "border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    }`}
                    id="passcode-input"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isVerifying}
                  className="flex-1 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white font-bold py-2.5 rounded-xl text-xs transition-all disabled:opacity-50"
                  id="passcode-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className={`flex-1 font-bold py-2.5 rounded-xl text-xs shadow-lg transition-all disabled:opacity-50 ${
                    toast?.type === "success"
                      ? "bg-emerald-600 text-white"
                      : "bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white"
                  }`}
                  id="passcode-submit-btn"
                >
                  {isVerifying ? "Verifying..." : "Unlock Portal"}
                </button>
              </div>
            </form>

            {/* Error / Success Display Alert */}
            <AnimatePresence>
              {toast && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-3 rounded-xl text-xs font-bold text-center ${
                    toast.type === "success"
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                      : "bg-red-500/10 border border-red-500/20 text-red-400"
                  }`}
                  id="passcode-feedback-alert"
                >
                  {toast.type === "success" 
                    ? "✓ Authorization Successful! Opening Portal..." 
                    : "✗ Access Denied: Wrong Password."}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hint for Director */}
            <div className="text-center">
              <p className="text-[10px] text-slate-600 font-medium">
                Authorized personnel only. Activities are recorded under 2026 ERP security policy.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
