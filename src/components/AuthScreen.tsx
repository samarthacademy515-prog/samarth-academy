import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, Unlock, ShieldCheck, BookOpen, GraduationCap, Users, 
  Mail, Chrome, ArrowRight, CheckCircle2, Sparkles, 
  MessageCircle, Info, Search, HelpCircle, Phone, Globe, Trash2, Plus, ChevronRight,
  MapPin, Calendar, User
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import logoImage from "../assets/images/academy_logo_1782839442092.jpg";
import { API } from "../config";

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
  const [googleEmail, setGoogleEmail] = useState("");
  const [showAddAccountForm, setShowAddAccountForm] = useState(false);

  // Google accounts saved on this device to protect privacy
  const [deviceAccounts, setDeviceAccounts] = useState<{name: string, email: string}[]>(() => {
    try {
      const saved = localStorage.getItem("samarth_academy_device_accounts");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const saveAccountToDevice = (name: string, email: string) => {
    try {
      const saved = localStorage.getItem("samarth_academy_device_accounts");
      const list = saved ? JSON.parse(saved) : [];
      if (!list.some((acc: any) => acc.email.toLowerCase() === email.toLowerCase())) {
        list.push({ name, email });
        localStorage.setItem("samarth_academy_device_accounts", JSON.stringify(list));
        setDeviceAccounts(list);
      }
    } catch (e) {
      console.warn("localStorage error:", e);
    }
  };

  const removeDeviceAccount = (email: string) => {
    try {
      const filtered = deviceAccounts.filter((acc) => acc.email.toLowerCase() !== email.toLowerCase());
      localStorage.setItem("samarth_academy_device_accounts", JSON.stringify(filtered));
      setDeviceAccounts(filtered);
    } catch (e) {
      console.warn("localStorage error:", e);
    }
  };

  // General States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Directory Search State (for students to find their codes easily during demo/testing)
  const [showCodeFinder, setShowCodeFinder] = useState(false);
  const [searchPhone, setSearchPhone] = useState("");
  const [foundStudent, setFoundStudent] = useState<any | null>(null);
  const [finderLoading, setFinderLoading] = useState(false);

  // New Self-Registration fields
  const [regFullName, setRegFullName] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regParentName, setRegParentName] = useState("");
  const [regParentMobile, setRegParentMobile] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regStandard, setRegStandard] = useState("10th Standard");
  const [regAddress, setRegAddress] = useState("");
  const [regDOB, setRegDOB] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Forgot Code States
  const [showForgotView, setShowForgotView] = useState(false);
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotResult, setForgotResult] = useState<{
    name: string;
    standard: string;
    phone: string;
    loginCode: string;
  } | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);

  // Countdown timer for automatic login redirect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (redirectCountdown !== null) {
      if (redirectCountdown > 0) {
        interval = setInterval(() => {
          setRedirectCountdown((prev) => (prev !== null ? prev - 1 : null));
        }, 1000);
      } else {
        setShowForgotView(false);
        setForgotPhone("");
        setRedirectCountdown(null);
        if (forgotResult) {
          setLoginCode(forgotResult.loginCode);
        }
        setForgotResult(null);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [redirectCountdown, forgotResult]);

  const allCourses = [
    {
      group: language === "marathi" ? "शालेय वर्ग (इयत्ता ४ थी ते १० वी)" : language === "hindi" ? "स्कूली शिक्षा (कक्षा 4 से 10)" : "School Standard (4th to 10th)",
      items: [
        "4th Standard", "5th Standard", "6th Standard", "7th Standard", "8th Standard", "9th Standard", "10th Standard"
      ]
    },
    {
      group: language === "marathi" ? "स्पर्धा परीक्षा" : language === "hindi" ? "प्रतियोगी परीक्षाएं" : "Competitive Government Exams",
      items: [
        "NMMS Exam", "Scholarship Exam", "Navodaya Exam", "MPSC Group B", "MPSC Group C", "Talathi Bharti", "Police Bharti", "ZP Recruitment", "Saral Seva"
      ]
    }
  ];

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
          throw new Error(selectedRole === "student" ? t("auth.enter_code_student") : t("auth.enter_code_parent"));
        }
        payload.loginCode = loginCode.trim();
      } else {
        if (!passcode.trim()) {
          throw new Error(t("auth.enter_pass"));
        }
        payload.passcode = passcode.trim();
      }

      const response = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      let data: any = {};
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON Server Response Received:", {
          status: response.status,
          statusText: response.statusText,
          contentType: contentType,
          bodySample: text.substring(0, 1000)
        });
        throw new Error(t("auth.invalid_server_resp"));
      }

      if (!response.ok || data.success === false) {
        throw new Error(data.error || t("auth.login_failed"));
      }

      const welcomeText = `${t("auth.login_success_welcome")}${data.user.name}`;
      setSuccessMsg(welcomeText);

      // Auto say credentials and welcome message out loud
      if ("speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(`Welcome back, ${data.user.name}. Access granted.`);
          utterance.rate = 1.0;
          window.speechSynthesis.speak(utterance);
        } catch (speechErr) {
          console.warn("Speech synthesis error:", speechErr);
        }
      }

      setTimeout(() => {
        onLoginSuccess(data.user);
      }, 1500);

    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPhone.trim() || !/^\d{10}$/.test(forgotPhone.trim())) {
      setErrorMsg(language === "marathi" ? "कृपया वैध १०-अंकी मोबाईल नंबर टाका." : "Please enter a valid 10-digit mobile number.");
      return;
    }

    setForgotLoading(true);
    setErrorMsg(null);
    setForgotResult(null);

    try {
      const response = await fetch(`${API}/api/auth/forgot-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: forgotPhone.trim() })
      });

      const data = await response.json();
      if (!response.ok || data.success === false) {
        throw new Error(data.error || (language === "marathi" ? "मोबाईल नंबर सापडला नाही." : "Mobile number not found."));
      }

      setForgotResult(data.student);
      setRedirectCountdown(10); // Start 10 seconds countdown

      if ("speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(
            `Found. Your secure login code is ${data.student.loginCode}.`
          );
          window.speechSynthesis.speak(utterance);
        } catch (e) {}
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleNewRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim()) {
      setErrorMsg(language === "marathi" ? "विद्यार्थ्याचे नाव आवश्यक आहे." : "Full Name is required.");
      return;
    }
    if (!regMobile.trim() || !/^\d{10}$/.test(regMobile.trim())) {
      setErrorMsg(language === "marathi" ? "कृपया वैध १०-अंकी मोबाईल नंबर टाका." : "Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!regParentName.trim()) {
      setErrorMsg(language === "marathi" ? "पालकांचे नाव आवश्यक आहे." : "Parent Name is required.");
      return;
    }
    if (!regStandard.trim()) {
      setErrorMsg(language === "marathi" ? "इयत्ता/वर्ग निवडणे आवश्यक आहे." : "Class/Standard selection is required.");
      return;
    }
    if (!regAddress.trim()) {
      setErrorMsg(language === "marathi" ? "पत्ता आवश्यक आहे." : "Address is required.");
      return;
    }
    if (!regDOB.trim()) {
      setErrorMsg(language === "marathi" ? "जन्मतारीख आवश्यक आहे." : "Date of Birth is required.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const response = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regFullName.trim(),
          phone: regMobile.trim(),
          parentName: regParentName.trim(),
          parentPhone: regParentMobile.trim(),
          email: regEmail.trim(),
          standard: regStandard,
          address: regAddress.trim(),
          dob: regDOB,
          password: regPassword
        })
      });

      const data = await response.json();
      if (!response.ok || data.success === false) {
        throw new Error(data.error || "Registration failed.");
      }

      const confirmMsg = `Welcome ${data.user.name}! Registered Permanently! Student ID: ${data.user.studentId}, Login Code: ${data.user.loginCode}`;
      setSuccessMsg(confirmMsg);

      if ("speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(
            `Welcome to Samarth Academy, ${data.user.name}! Your secure seven digit login code is ${data.user.loginCode}.`
          );
          window.speechSynthesis.speak(utterance);
        } catch (speechErr) {}
      }

      setTimeout(() => {
        onLoginSuccess(data.user);
      }, 3500);

    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsGoogleSigning(true);
    setErrorMsg(null);
    setTimeout(() => {
      setShowGoogleChooser(true);
      setShowAddAccountForm(deviceAccounts.length === 0);
    }, 1000);
  };

  const selectGoogleAccount = async (gmail: string) => {
    setShowGoogleChooser(false);
    setLoading(true);
    setErrorMsg(null);
    
    try {
      const response = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loginType: "google",
          email: gmail
        })
      });

      let data: any = {};
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error("Invalid server response format.");
      }

      if (data.success === false) {
        throw new Error(data.error || "Google login failed on backend.");
      }

      const confirmMsg = `Google Login Success! Student ID: ${data.user.studentId}, Login Code: ${data.user.loginCode}`;
      setSuccessMsg(confirmMsg);

      // Auto say permanent registration details and credentials
      if ("speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(
            `Welcome to Samarth Academy, ${data.user.name}! Your permanent student ID is ${data.user.studentId}, and your seven digit login code is ${data.user.loginCode}. It is saved permanently. Please write it down.`
          );
          utterance.rate = 0.9;
          window.speechSynthesis.speak(utterance);
        } catch (speechErr) {
          console.warn("Speech synthesis error:", speechErr);
        }
      }

      if (data.user && data.user.email) {
        saveAccountToDevice(data.user.name, data.user.email);
      }

      setTimeout(() => {
        onLoginSuccess(data.user);
        setIsGoogleSigning(false);
      }, 3500);
    } catch (err: any) {
      setErrorMsg(err.message || "Google लॉगिन अयशस्वी.");
      setIsGoogleSigning(false);
    } finally {
      setLoading(false);
    }
  };

  const searchStudentCode = async () => {
    if (!searchPhone.trim()) return;
    setFinderLoading(true);
    setFoundStudent(null);
    try {
      const res = await fetch(`${API}/api/students`);
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
        {!showGoogleChooser && !showForgotView && (
          <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-950/50">
            <button
              onClick={() => { setActiveTab("existing"); setErrorMsg(null); }}
              className={`py-3.5 text-xs font-extrabold tracking-wider uppercase transition-colors relative cursor-pointer ${
                activeTab === "existing" ? "text-amber-400 bg-slate-900/40" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {t("auth.existing_tab")}
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
              {t("auth.new_tab")}
              {activeTab === "new" && (
                <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
              )}
            </button>
          </div>
        )}

        <div className="p-6">
          <AnimatePresence mode="wait">
            {showForgotView ? (
              <motion.div
                key="forgot-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-5"
              >
                {!forgotResult ? (
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <div className="text-center space-y-1">
                      <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center justify-center gap-1.5">
                        <Lock className="w-4 h-4 text-amber-500 animate-pulse" />
                        {language === "marathi" ? "लॉगिन कोड शोधा" : language === "hindi" ? "लॉगिन कोड खोजें" : "Find Student Login Code"}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {language === "marathi" 
                          ? "आपला लॉगिन कोड परत मिळवण्यासाठी नोंदणीकृत १०-अंकी मोबाईल नंबर टाका." 
                          : "Enter your registered 10-digit mobile number to retrieve your login code."}
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        {language === "marathi" ? "नोंदणीकृत मोबाईल नंबर *" : "Registered Mobile Number *"}
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-600" />
                        <input
                          type="tel"
                          required
                          pattern="[0-9]{10}"
                          maxLength={10}
                          placeholder="e.g. 9511668617"
                          value={forgotPhone}
                          onChange={(e) => setForgotPhone(e.target.value.replace(/[^0-9]/g, ""))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-amber-500 transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:from-red-500 hover:to-amber-500 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm uppercase tracking-wider"
                    >
                      {forgotLoading ? (
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      ) : (
                        <>
                          <Search className="w-4 h-4" /> 
                          {language === "marathi" ? "माझा लॉगिन कोड शोधा" : "Find My Login Code"}
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setShowForgotView(false); setErrorMsg(null); }}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer text-xs uppercase"
                    >
                      {language === "marathi" ? "← लॉगिनवर परत जा" : "← Back to Login"}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-5 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-14 h-14 bg-emerald-500/10 border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-400 animate-bounce">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-base font-black text-emerald-400 uppercase tracking-wider">
                        {language === "marathi" ? "लॉगिन कोड सापडला!" : "Login Code Found!"}
                      </h3>
                    </div>

                    {/* Result Dashboard */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-left space-y-3.5 shadow-inner">
                      <div className="border-b border-slate-850 pb-2 flex justify-between">
                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider">Student Details</span>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase">VERIFIED</span>
                      </div>

                      <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wide">Student Name</span>
                          <span className="text-white font-bold block truncate">{forgotResult.name}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wide">Class / Batch</span>
                          <span className="text-amber-400 font-bold block truncate">{forgotResult.standard}</span>
                        </div>
                        <div className="col-span-2 border-t border-slate-850 pt-2.5">
                          <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wide">Registered Phone</span>
                          <span className="text-slate-300 font-mono font-semibold block">{forgotResult.phone}</span>
                        </div>
                        <div className="col-span-2 bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl text-center space-y-1">
                          <span className="text-amber-500 block uppercase text-[10px] font-black tracking-wider">🔑 आपला ७-अंकी लॉगिन कोड (YOUR LOGIN CODE)</span>
                          <span className="text-amber-400 font-mono text-2xl font-black tracking-widest block py-1">
                            {forgotResult.loginCode}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(forgotResult.loginCode);
                            alert(language === "marathi" ? "लॉगिन कोड क्लिपबोर्डवर कॉपी केला!" : "Login Code copied to clipboard!");
                          }}
                          className="flex-1 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white text-xs font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          {language === "marathi" ? "कोड कॉपी करा" : "Copy Code"}
                        </button>

                        <a
                          href={`https://wa.me/91${forgotResult.phone}?text=${encodeURIComponent(
                            `*समर्थ अकॅडमी - विद्यार्थी लॉगिन तपशील (Samarth Academy Student Login Info)*\n--------------------------------------------------\n*नाव (Name):* ${forgotResult.name}\n*वर्ग (Class):* ${forgotResult.standard}\n*मोबाईल (Mobile):* ${forgotResult.phone}\n*🔑 ७-अंकी लॉगिन कोड (Login Code):* *${forgotResult.loginCode}*\n--------------------------------------------------\nहा कोड वापरून आपण student किंवा parent म्हणून https://samarth-academy.in वर लॉगिन करू शकता.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-emerald-600 hover:bg-emerald-550 text-white text-xs font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          {language === "marathi" ? "WhatsApp वर पाठवा" : "Send WhatsApp"}
                        </a>
                      </div>
                    </div>

                    {/* Countdown indicator */}
                    <div className="text-[11px] text-slate-400 leading-none">
                      {language === "marathi" 
                        ? `१० सेकंदांनंतर स्वयंचलित रिडायरेक्ट: ` 
                        : `Auto-redirecting in `}
                      <span className="text-amber-500 font-extrabold font-mono text-xs">{redirectCountdown}s</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotView(false);
                        setForgotResult(null);
                        setForgotPhone("");
                        setLoginCode(forgotResult.loginCode);
                        setRedirectCountdown(null);
                      }}
                      className="w-full bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg hover:from-red-500 hover:to-amber-500 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs uppercase tracking-wider"
                    >
                      <ArrowRight className="w-4 h-4" /> {language === "marathi" ? "लॉगिन कडे जा" : "Go to Login"}
                    </button>
                  </div>
                )}
              </motion.div>
            ) : showGoogleChooser ? (
              <motion.div
                key="google-chooser-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white text-slate-900 rounded-2xl p-5 border border-slate-200 shadow-xl space-y-3.5"
              >
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
                    <Chrome className="w-3.5 h-3.5 text-red-500" />
                    {language === "marathi" ? "Google द्वारे सुरक्षित लॉगिन" : language === "hindi" ? "Google द्वारा सुरक्षित लॉगिन" : "Secure Login via Google"}
                  </span>
                  <button 
                    onClick={() => { setShowGoogleChooser(false); setIsGoogleSigning(false); }} 
                    className="text-slate-400 hover:text-slate-900 font-bold text-sm cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {!showAddAccountForm && deviceAccounts.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-[11px] text-slate-500 leading-normal font-medium">
                      {language === "marathi" 
                        ? "तुमच्या डिव्हाइसवर जोडलेली खाती निवडा:" 
                        : language === "hindi" 
                        ? "अपने डिवाइस पर जुड़े खाते चुनें:" 
                        : "Select an account active on this device:"}
                    </p>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {deviceAccounts.map((acc, index) => {
                        const initial = acc.name ? acc.name.charAt(0).toUpperCase() : "U";
                        return (
                          <div
                            key={acc.email}
                            onClick={() => selectGoogleAccount(acc.email)}
                            className="w-full text-left p-2.5 hover:bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-300 flex items-center justify-between font-semibold text-slate-850 cursor-pointer transition-all group"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center font-bold text-xs uppercase group-hover:bg-amber-500 group-hover:text-white group-hover:border-transparent transition-colors">
                                {initial}
                              </div>
                              <div className="truncate max-w-[160px] sm:max-w-[200px]">
                                <p className="leading-tight text-xs text-slate-800">{acc.name}</p>
                                <p className="text-[10px] text-slate-400 font-normal truncate">{acc.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-500 transition-colors" />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm(language === "marathi" ? "हे खाते या डिव्हाइसवरून काढायचे?" : "Remove this account from this device?")) {
                                    removeDeviceAccount(acc.email);
                                  }
                                }}
                                className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                title="Remove from device"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setGoogleEmail("");
                        setShowAddAccountForm(true);
                      }}
                      className="w-full text-center py-2 hover:bg-slate-50 rounded-xl text-amber-600 font-bold text-[11px] border border-dashed border-amber-200 transition-colors flex items-center justify-center gap-1 cursor-pointer mt-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {language === "marathi" ? "दुसरे खाते वापरा" : language === "hindi" ? "दूसरा खाता जोड़ें" : "Use another account"}
                    </button>
                  </div>
                ) : (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (googleEmail.trim()) {
                        selectGoogleAccount(googleEmail.trim());
                      }
                    }}
                    className="space-y-3.5 text-xs"
                  >
                    <p className="text-[11px] text-slate-500 leading-normal">
                      {language === "marathi" 
                        ? "आपल्या फोन/डिव्हाइसवर सुरू असलेले Google (Gmail) खाते येथे टाका:" 
                        : language === "hindi" 
                        ? "अपने फोन/डिवाइस पर सक्रिय Google (Gmail) खाता यहाँ दर्ज करें:" 
                        : "Enter the Google (Gmail) account active on your phone/device to proceed:"}
                    </p>
                    
                    <div className="space-y-1">
                      <input
                        type="email"
                        required
                        placeholder="yourname@gmail.com"
                        value={googleEmail}
                        onChange={(e) => setGoogleEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:bg-white transition-all placeholder-slate-400 font-mono"
                      />
                    </div>

                    <div className="flex flex-col gap-2 pt-1">
                      <button
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                      >
                        <Unlock className="w-3.5 h-3.5 text-amber-400" />
                        {language === "marathi" ? "लॉगिन करा" : language === "hindi" ? "लॉगिन करें" : "Sign In & Continue"}
                      </button>

                      {deviceAccounts.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowAddAccountForm(false)}
                          className="text-center text-[10px] text-slate-500 hover:text-slate-800 underline font-semibold py-1 cursor-pointer transition-all"
                        >
                          {language === "marathi" ? "← जतन केलेल्या खात्यांवर परत जा" : language === "hindi" ? "← सहेजे गए खातों पर वापस जाएं" : "← Back to saved accounts on this device"}
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </motion.div>
            ) : activeTab === "existing" ? (
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
                    {t("auth.choose_role")}
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800/80">
                    {[
                      { id: "student", icon: GraduationCap },
                      { id: "parent", icon: Users },
                      { id: "teacher", icon: BookOpen },
                      { id: "admin", icon: ShieldCheck }
                    ].map((roleItem) => {
                      const isSel = selectedRole === roleItem.id;
                      const Icon = roleItem.icon;
                      const label = roleItem.id === "admin" ? t("role.admin") : t("role." + roleItem.id);
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
                          <span>{label}</span>
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
                      <strong className="font-bold block">{t("auth.login_code_title")}</strong>
                      <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                        {t("auth.login_code_desc")}
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
                            ? t("auth.student_code_label") 
                            : t("auth.parent_code_label")}
                        </label>
                        <button
                          type="button"
                          onClick={() => { setShowCodeFinder(!showCodeFinder); setErrorMsg(null); }}
                          className="text-[10px] text-amber-500 hover:underline font-black uppercase flex items-center gap-1 cursor-pointer"
                        >
                          <Search className="w-3 h-3" /> {t("auth.find_code")}
                        </button>
                      </div>

                      <input
                        type="text"
                        required
                        maxLength={selectedRole === "student" ? 7 : 10}
                        placeholder={selectedRole === "student" ? t("auth.student_placeholder") : t("auth.parent_placeholder")}
                        value={loginCode}
                        onChange={(e) => setLoginCode(e.target.value.replace(/[^0-9]/g, ""))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-700 font-mono text-center tracking-widest focus:outline-none focus:border-amber-500 transition-colors"
                      />
                      {selectedRole === "student" && (
                        <div className="flex justify-end mt-2">
                          <button
                            type="button"
                            onClick={() => { setShowForgotView(true); setErrorMsg(null); setForgotResult(null); setForgotPhone(""); }}
                            className="text-[11px] text-amber-500 hover:text-amber-400 font-bold hover:underline transition-all cursor-pointer flex items-center gap-1"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                            {language === "marathi" ? "७-अंकी लॉगिन कोड विसरलात?" : language === "hindi" ? "लॉगिन कोड भूल गए?" : "Forgot Student Login Code?"}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        {selectedRole === "admin" ? t("auth.admin_pass_label") : t("auth.teacher_pass_label")}
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
                        <Unlock className="w-4 h-4" /> {t("auth.login_btn")} <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {(selectedRole === "student" || selectedRole === "parent") && (
                    <>
                      {/* Separator Line */}
                      <div className="relative flex py-1 items-center">
                        <div className="flex-grow border-t border-slate-850"></div>
                        <span className="flex-shrink mx-3 text-slate-500 text-[10px] uppercase font-black tracking-wider">
                          {language === "marathi" ? "किंवा" : language === "hindi" ? "या" : "OR"}
                        </span>
                        <div className="flex-grow border-t border-slate-850"></div>
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
                            <Chrome className="w-4 h-4 text-red-500" /> {t("auth.google_btn")}
                          </>
                        )}
                      </button>
                    </>
                  )}
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
                          <Search className="w-3.5 h-3.5" /> {t("auth.code_finder_title")}
                        </h4>
                        <button onClick={() => setShowCodeFinder(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        {t("auth.code_finder_desc")}
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder={t("auth.search_placeholder")}
                          value={searchPhone}
                          onChange={(e) => setSearchPhone(e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                        <button
                          onClick={searchStudentCode}
                          disabled={finderLoading}
                          className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-extrabold px-3 py-1.5 rounded-lg cursor-pointer shrink-0"
                        >
                          {t("auth.search_btn")}
                        </button>
                      </div>
                      {foundStudent && (
                        <div className="bg-slate-900 border border-slate-800/80 p-2.5 rounded-xl space-y-1 mt-2 text-[11px]">
                          <p className="text-emerald-400 font-bold">✨ {t("auth.student_found")}</p>
                          <p className="text-white font-semibold">{t("auth.student_name")} <span className="text-slate-300">{foundStudent.name}</span></p>
                          <p className="text-white font-semibold">{t("auth.student_phone")} <span className="text-slate-300 font-mono">{foundStudent.phone}</span></p>
                          <p className="text-amber-400 font-black flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 py-1 px-2 rounded-lg mt-1">
                            🔑 {t("auth.student_code_display")} <span className="font-mono text-sm tracking-wider underline">{foundStudent.loginCode}</span>
                          </p>
                          <button
                            onClick={() => {
                              setLoginCode(foundStudent.loginCode);
                              setShowCodeFinder(false);
                            }}
                            className="w-full mt-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold py-1 px-2 rounded text-[10px] uppercase cursor-pointer"
                          >
                            {t("auth.autofill_btn")}
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
                className="space-y-4 max-h-[480px] overflow-y-auto pr-1.5 custom-scrollbar"
              >
                <div className="text-center space-y-1">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" /> 
                    {language === "marathi" ? "नवीन विद्यार्थी स्व-नोंदणी" : "Student Self-Registration"}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {language === "marathi" 
                      ? "समर्थ अकॅडमी मध्ये प्रवेश घेण्यासाठी खालील माहिती काळजीपूर्वक भरा." 
                      : "Fill in your details carefully to register in Samarth Academy."}
                  </p>
                </div>

                {/* Self Registration form */}
                <form onSubmit={handleNewRegistration} className="space-y-3.5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      {language === "marathi" ? "विद्यार्थ्याचे पूर्ण नाव *" : "Student Full Name *"}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                      <input
                        type="text"
                        required
                        placeholder={language === "marathi" ? "उदा. ओमकार रमेश चव्हाण" : "E.g. Omkar Ramesh Chavan"}
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      {language === "marathi" ? "मोबाईल क्रमांक (लॉगिनसाठी वापरला जाईल) *" : "Mobile Number (Used for login) *"}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        maxLength={10}
                        placeholder={language === "marathi" ? "१०-अंकी मोबाईल नंबर" : "10-digit mobile number"}
                        value={regMobile}
                        onChange={(e) => setRegMobile(e.target.value.replace(/[^0-9]/g, ""))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Parent Name */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      {language === "marathi" ? "पालकांचे नाव *" : "Parent Name *"}
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                      <input
                        type="text"
                        required
                        placeholder={language === "marathi" ? "उदा. रमेश चव्हाण" : "E.g. Ramesh Chavan"}
                        value={regParentName}
                        onChange={(e) => setRegParentName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Parent Mobile & Email side by side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        {language === "marathi" ? "पालकांचा मोबाईल (पर्यायी)" : "Parent Mobile (Optional)"}
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                        <input
                          type="tel"
                          pattern="[0-9]{10}"
                          maxLength={10}
                          placeholder="e.g. 9876543210"
                          value={regParentMobile}
                          onChange={(e) => setRegParentMobile(e.target.value.replace(/[^0-9]/g, ""))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        {language === "marathi" ? "ईमेल आयडी (पर्यायी)" : "Email (Optional)"}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                        <input
                          type="email"
                          placeholder="student@gmail.com"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Standard & Date of Birth side by side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        {language === "marathi" ? "इयत्ता / वर्ग *" : "Standard / Class *"}
                      </label>
                      <select
                        value={regStandard}
                        onChange={(e) => setRegStandard(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                      >
                        {allCourses.map((grp) => (
                          <optgroup key={grp.group} label={grp.group} className="bg-slate-900 text-slate-300 font-bold">
                            {grp.items.map((item) => (
                              <option key={item} value={item} className="bg-slate-950 text-white font-normal">{item}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        {language === "marathi" ? "जन्मतारीख *" : "Date of Birth *"}
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                        <input
                          type="date"
                          required
                          value={regDOB}
                          onChange={(e) => setRegDOB(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      {language === "marathi" ? "पत्ता *" : "Address *"}
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                      <input
                        type="text"
                        required
                        placeholder={language === "marathi" ? "उदा. सिंचन नगर, परभणी" : "E.g. Sinchan Nagar, Parbhani"}
                        value={regAddress}
                        onChange={(e) => setRegAddress(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      {language === "marathi" ? "पासवर्ड (पर्यायी)" : "Password (Optional)"}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm uppercase tracking-wider font-bold shadow-md hover:shadow-lg"
                  >
                    {loading ? (
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" /> 
                        {language === "marathi" ? "नोंदणी पूर्ण करा (Register)" : "Complete Registration"}
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
            {t("auth.help_title")} <strong className="text-slate-200">9511668617</strong>
          </p>
          <p className="text-slate-500">
            {t("auth.footer_rights")}
          </p>
        </div>
      </div>
    </div>
  );
}
