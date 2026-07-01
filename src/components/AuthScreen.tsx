import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, Unlock, ShieldCheck, BookOpen, GraduationCap, Users, 
  Mail, Chrome, ArrowRight, CheckCircle2, Sparkles, 
  MessageCircle, Info, Search, HelpCircle, Phone, Globe 
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import logoImage from "../assets/images/academy_logo_1782839442092.jpg";

interface AuthScreenProps {
  onLoginSuccess: (user: {
    role: "admin" | "teacher" | "student" | "parent" | "guest";
    name: string;
    email?: string;
    phone?: string;
    studentId?: string;
    loginCode?: string;
  }) => void;
}

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const { t, language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<"existing" | "new">("existing");
  const [selectedRole, setSelectedRole] = useState<"student" | "parent" | "teacher" | "admin">("student");
  
  // Existing User States
  const [loginCode, setLoginCode] = useState("");
  const [passcode, setPasscode] = useState("");
  
  // New User States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isGoogleSigning, setIsGoogleSigning] = useState(false);
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);

  // General States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Directory Search State (for students to find their codes easily during demo/testing)
  const [showCodeFinder, setShowCodeFinder] = useState(false);
  const [searchPhone, setSearchPhone] = useState("");
  const [foundStudent, setFoundStudent] = useState<any | null>(null);
  const [finderLoading, setFinderLoading] = useState(false);

  // Language selectors
  const languagesList = [
    { key: "marathi", label: "मराठी" },
    { key: "hinglish", label: "Hinglish" },
    { key: "english", label: "English" },
    { key: "hindi", label: "हिन्दी" }
  ];

  const handleExistingLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const payload: any = { role: selectedRole };
      if (selectedRole === "student" || selectedRole === "parent") {
        if (!loginCode.trim()) {
          throw new Error(selectedRole === "student" ? "कृपया ७-अंकी लॉगिन कोड टाका." : "कृपया ७-अंकी कोड किंवा नंबर टाका.");
        }
        payload.loginCode = loginCode.trim();
      } else {
        if (!passcode.trim()) {
          throw new Error("कृपया पासवर्ड / पिन टाका.");
        }
        payload.passcode = passcode.trim();
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "लॉगिन अयशस्वी झाले.");
      }

      setSuccessMsg(`यशस्वी लॉगिन! स्वागत आहे, ${data.user.name}`);
      setTimeout(() => {
        onLoginSuccess(data.user);
      }, 1200);

    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg("कृपया ईमेल आणि पासवर्ड टाका.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loginType: "email",
          email: email.trim(),
          password: password
        })
      });

      const data = await response.json();
      setSuccessMsg("ईमेलद्वारे नवीन खाते तयार केले गेले!");
      setTimeout(() => {
        onLoginSuccess({
          role: "guest",
          name: email.split("@")[0],
          email: email.trim()
        });
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || "ईमेल साइन अप अयशस्वी.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsGoogleSigning(true);
    setErrorMsg(null);
    setTimeout(() => {
      setShowGoogleChooser(true);
    }, 1000);
  };

  const selectGoogleAccount = (gmail: string) => {
    setShowGoogleChooser(false);
    setSuccessMsg(`Google खात्याद्वारे (${gmail}) यशस्वीरित्या लॉगिन झाले!`);
    setTimeout(() => {
      onLoginSuccess({
        role: "guest",
        name: gmail.split("@")[0],
        email: gmail
      });
      setIsGoogleSigning(false);
    }, 1200);
  };

  const searchStudentCode = async () => {
    if (!searchPhone.trim()) return;
    setFinderLoading(true);
    setFoundStudent(null);
    try {
      const res = await fetch("/api/students");
      if (res.ok) {
        const students = await res.json();
        const found = students.find((s: any) => 
          s.phone === searchPhone.trim() || 
          s.name.toLowerCase().includes(searchPhone.trim().toLowerCase())
        );
        if (found) {
          setFoundStudent(found);
        } else {
          setErrorMsg("या नंबर किंवा नावाने कोणताही विद्यार्थी सापडला नाही.");
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFinderLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden" id="auth-screen">
      
      {/* Background Decorative Circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Language Selector Bar at top-right */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-full shadow-lg">
        <Globe className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
        <div className="flex gap-1 text-[11px] font-bold">
          {languagesList.map((lang) => (
            <button
              key={lang.key}
              onClick={() => setLanguage(lang.key as any)}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                language === lang.key
                  ? "bg-amber-500/20 text-amber-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative z-10 my-8">
        
        {/* Banner with Logo & Brand */}
        <div className="p-6 text-center bg-gradient-to-br from-red-950 via-slate-900 to-amber-950 border-b border-slate-800 relative">
          <div className="absolute top-2 right-2 flex gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">LIVE PORTAL</span>
          </div>
          <div className="inline-flex p-1 bg-gradient-to-r from-red-600 to-amber-500 rounded-full mb-3 shadow-lg shadow-red-900/40">
            <img 
              src={logoImage} 
              alt="Samarth Academy Logo" 
              className="w-14 h-14 rounded-full object-cover border-2 border-slate-900"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none uppercase">
            {t("nav.brand") || "समर्थ अकॅडमी"}
          </h1>
          <p className="text-xs text-amber-500 font-bold mt-1.5 tracking-wide">
            {t("nav.tagline") || "ज्ञान हेच सामर्थ्य"} • परभणी
          </p>
        </div>

        {/* Floating Success / Error Alerts */}
        <AnimatePresence mode="wait">
          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-emerald-950/90 border-b border-emerald-500/30 text-emerald-300 px-4 py-3 text-xs font-semibold flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-950/90 border-b border-red-500/30 text-red-300 px-4 py-3 text-xs font-semibold flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-white font-bold px-1 text-[10px]">✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Type Tabs (Existing vs. New User) */}
        <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-950/50">
          <button
            onClick={() => { setActiveTab("existing"); setErrorMsg(null); }}
            className={`py-3.5 text-xs font-extrabold tracking-wider uppercase transition-colors relative cursor-pointer ${
              activeTab === "existing" ? "text-amber-400 bg-slate-900/40" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            १. जुने युझर (Existing User)
            {activeTab === "existing" && (
              <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
            )}
          </button>
          <button
            onClick={() => { setActiveTab("new"); setErrorMsg(null); }}
            className={`py-3.5 text-xs font-extrabold tracking-wider uppercase transition-colors relative cursor-pointer ${
              activeTab === "new" ? "text-amber-400 bg-slate-900/40" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            २. नवीन युझर (New User)
            {activeTab === "new" && (
              <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
            )}
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === "existing" ? (
              <motion.div
                key="existing-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-5"
              >
                {/* Role Switcher Pills */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    आपली भूमिका निवडा (Choose Your Role)
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800/80">
                    {[
                      { id: "student", label: "Student", icon: GraduationCap },
                      { id: "parent", label: "Parent", icon: Users },
                      { id: "teacher", label: "Teacher", icon: BookOpen },
                      { id: "admin", label: "Director", icon: ShieldCheck }
                    ].map((roleItem) => {
                      const isSel = selectedRole === roleItem.id;
                      const Icon = roleItem.icon;
                      return (
                        <button
                          key={roleItem.id}
                          type="button"
                          onClick={() => { setSelectedRole(roleItem.id as any); setErrorMsg(null); }}
                          className={`py-2 px-1 rounded-lg text-[10px] font-black flex flex-col items-center gap-1 transition-all cursor-pointer ${
                            isSel 
                              ? "bg-gradient-to-b from-slate-850 to-slate-900 border border-slate-700 text-amber-400 shadow-sm" 
                              : "text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isSel ? "text-amber-500" : "text-slate-500"}`} />
                          <span>{roleItem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Login Guidance Info Box */}
                {(selectedRole === "student" || selectedRole === "parent") && (
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-400 flex gap-2">
                    <Info className="w-4 h-4 shrink-0 text-amber-500 mt-0.5 animate-bounce" />
                    <div>
                      <strong className="font-bold block">७-अंकी सुरक्षित लॉगिन कोड</strong>
                      <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                        नवीन प्रवेश घेताना आम्ही विद्यार्थ्यांच्या मोबाईलवर ७-अंकी लॉगिन कोड थेट WhatsApp द्वारे पाठवला आहे. लॉगिन करण्यासाठी तो कोड येथे टाकावा.
                      </p>
                    </div>
                  </div>
                )}

                {/* Form element */}
                <form onSubmit={handleExistingLogin} className="space-y-4">
                  {(selectedRole === "student" || selectedRole === "parent") ? (
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                          {selectedRole === "student" 
                            ? "विद्यार्थी ७-अंकी लॉगिन कोड (Student Login Code) *" 
                            : "विद्यार्थी ७-अंकी कोड किंवा पालकांचा फोन नंबर *"}
                        </label>
                        <button
                          type="button"
                          onClick={() => { setShowCodeFinder(!showCodeFinder); setErrorMsg(null); }}
                          className="text-[10px] text-amber-500 hover:underline font-black uppercase flex items-center gap-1 cursor-pointer"
                        >
                          <Search className="w-3 h-3" /> कोड शोधा (Find Code)
                        </button>
                      </div>

                      <input
                        type="text"
                        required
                        maxLength={selectedRole === "student" ? 7 : 10}
                        placeholder={selectedRole === "student" ? "उदा. 8420511" : "उदा. ७-अंकी कोड किंवा १०-अंकी फोन नंबर"}
                        value={loginCode}
                        onChange={(e) => setLoginCode(e.target.value.replace(/[^0-9]/g, ""))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-700 font-mono text-center tracking-widest focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        {selectedRole === "admin" ? "Director / Admin Passcode *" : "Teacher Security PIN *"}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-600" />
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={passcode}
                          onChange={(e) => setPasscode(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors tracking-widest"
                        />
                      </div>

                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:from-red-500 hover:to-amber-500 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm uppercase tracking-wider"
                  >
                    {loading ? (
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4" /> प्रवेश करा (Secure Login) <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Demo Directory Finder Overlay */}
                <AnimatePresence>
                  {showCodeFinder && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-3 overflow-hidden text-xs"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-black text-amber-500 uppercase text-[10px] flex items-center gap-1">
                          <Search className="w-3.5 h-3.5" /> विद्यार्थी कोड शोधक (Demo Code Finder)
                        </h4>
                        <button onClick={() => setShowCodeFinder(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        डेमोसाठी आपण खाली कोणत्याही विद्यार्थ्याचा १०-अंकी मोबाईल नंबर टाकून (उदा. <span className="font-mono text-white">9511668617</span> किंवा <span className="font-mono text-white">9876543210</span>) त्यांचा लॉगिन कोड तात्काळ शोधू शकता.
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="मोबाईल नंबर किंवा नाव टाका"
                          value={searchPhone}
                          onChange={(e) => setSearchPhone(e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                        <button
                          onClick={searchStudentCode}
                          disabled={finderLoading}
                          className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-extrabold px-3 py-1.5 rounded-lg cursor-pointer"
                        >
                          शोध घ्या
                        </button>
                      </div>
                      {foundStudent && (
                        <div className="bg-slate-900 border border-slate-800/80 p-2.5 rounded-xl space-y-1 mt-2 text-[11px]">
                          <p className="text-emerald-400 font-bold">✨ विद्यार्थी सापडला! (Found!)</p>
                          <p className="text-white font-semibold">नाव: <span className="text-slate-300">{foundStudent.name}</span></p>
                          <p className="text-white font-semibold">मोबाईल: <span className="text-slate-300 font-mono">{foundStudent.phone}</span></p>
                          <p className="text-amber-400 font-black flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 py-1 px-2 rounded-lg mt-1">
                            🔑 ७-अंकी लॉगिन कोड: <span className="font-mono text-sm tracking-wider underline">{foundStudent.loginCode}</span>
                          </p>
                          <button
                            onClick={() => {
                              setLoginCode(foundStudent.loginCode);
                              setShowCodeFinder(false);
                            }}
                            className="w-full mt-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold py-1 px-2 rounded text-[10px] uppercase cursor-pointer"
                          >
                            हा कोड ऑटो-फिल करा (Auto-fill this code)
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            ) : (
              <motion.div
                key="new-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <div className="text-center space-y-1">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" /> नवीन खाते उघडा (New User Portal)
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    नवीन युझर्ससाठी थेट प्रवेश. आपण खालीलपैकी कोणत्याही पर्यायाद्वारे नोंदणी करून ॲकॅडमी पोर्टल एक्सप्लोर करू शकता:
                  </p>
                </div>

                {/* Google Sign In Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleSigning}
                  className="w-full bg-white hover:bg-slate-50 text-slate-900 font-bold py-2.5 px-4 rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2.5 shadow-sm hover:shadow cursor-pointer text-xs sm:text-sm"
                >
                  {isGoogleSigning ? (
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-900"></span>
                  ) : (
                    <>
                      <Chrome className="w-4 h-4 text-red-500" /> Sign Up / Login with Google
                    </>
                  )}
                </button>

                {/* Simulated Google Account Chooser */}
                <AnimatePresence>
                  {showGoogleChooser && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="bg-white text-slate-900 rounded-2xl p-4 border border-slate-200 shadow-xl space-y-3"
                    >
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Choose Google Account</span>
                        <button onClick={() => setShowGoogleChooser(false)} className="text-slate-400 hover:text-slate-900 font-bold">✕</button>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <button
                          onClick={() => selectGoogleAccount("samarthacademy515@gmail.com")}
                          className="w-full text-left p-2 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 flex items-center gap-2 font-semibold text-slate-800"
                        >
                          <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[10px]">SA</div>
                          <div>
                            <p className="leading-tight">Samarth Academy</p>
                            <p className="text-[10px] text-slate-400">samarthacademy515@gmail.com</p>
                          </div>
                        </button>
                        <button
                          onClick={() => selectGoogleAccount("pratibha.ingole@gmail.com")}
                          className="w-full text-left p-2 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 flex items-center gap-2 font-semibold text-slate-800"
                        >
                          <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-[10px]">PI</div>
                          <div>
                            <p className="leading-tight">Pratibha R. Ingole</p>
                            <p className="text-[10px] text-slate-400">pratibha.ingole@gmail.com</p>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            const customEmail = prompt("आपला दुसरा Google ईमेल पत्ता टाका (Enter alternate Gmail):", "student.samarth@gmail.com");
                            if (customEmail) selectGoogleAccount(customEmail);
                          }}
                          className="w-full text-center py-2 hover:bg-slate-50 rounded-lg text-amber-600 font-bold text-[11px] border border-dashed border-amber-200"
                        >
                          + Use Another Account
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Separator Line */}
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-800"></div>
                  <span className="flex-shrink mx-4 text-slate-500 text-[10px] uppercase font-black tracking-wider">किंवा ईमेलने खाते उघडा</span>
                  <div className="flex-grow border-t border-slate-800"></div>
                </div>

                {/* Email Registration form */}
                <form onSubmit={handleEmailSignUp} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      ईमेल पत्ता (Email Address) *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-600" />
                      <input
                        type="email"
                        required
                        placeholder="E.g. student@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      पासवर्ड (Create Password) *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-600" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm uppercase tracking-wider"
                  >
                    {loading ? (
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 text-amber-500" /> Register with Email
                      </>
                    )}
                  </button>
                </form>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Auth Footer with Help Center info */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-850 text-center text-[10px] text-slate-400 space-y-1">
          <p className="flex items-center justify-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" /> 
            प्रवेश हवा आहे? आजच संपर्क करा: <strong className="text-slate-200">9511668617</strong>
          </p>
          <p className="text-slate-500">
            © {new Date().getFullYear()} समर्थ अकॅडमी, परभणी. ज्ञान हेच सामर्थ्य! All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
