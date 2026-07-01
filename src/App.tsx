import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GraduationCap, Landmark, BookOpen, Video, BrainCircuit, UserCheck, Phone, MapPin, ShieldCheck, Star, Users, Briefcase, Award, MessageCircle, Menu, X, LayoutDashboard, Grid, LineChart } from "lucide-react";
import AppHeader from "./components/AppHeader";
import AdmissionForm from "./components/AdmissionForm";
import LiveClassroom from "./components/LiveClassroom";
import PracticeTests from "./components/PracticeTests";
import AIDoubtSolver from "./components/AIDoubtSolver";
import ERPManagement from "./components/ERPManagement";
import LMSViewer from "./components/LMSViewer";
import AdminPasscodeModal from "./components/AdminPasscodeModal";
import StudyTracker from "./components/StudyTracker";
import { Student, FeeLog, Assignment } from "./types";
import { ACADEMY_INFO, COURSES, TEACHERS } from "./data";
import logoImage from "./assets/images/academy_logo_1782839442092.jpg";

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [feeLogs, setFeeLogs] = useState<FeeLog[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>(() => {
    const isUnlocked = sessionStorage.getItem("admin_unlocked") === "true";
    return isUnlocked ? "admin" : "student";
  });
  const [activeTab, setActiveTab] = useState<string>("home");
  const [showPasscodeModal, setShowPasscodeModal] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Fetch all db state from full-stack Express API
  const fetchState = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/db");
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
        setFeeLogs(data.feeLogs || []);
        setAssignments(data.assignments || []);
      }
    } catch (err) {
      console.error("Error fetching state from Express server:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const handleRoleChange = (role: string) => {
    if (role === "admin") {
      const isUnlocked = sessionStorage.getItem("admin_unlocked") === "true";
      if (isUnlocked) {
        setUserRole("admin");
      } else {
        setShowPasscodeModal(true);
      }
    } else {
      setUserRole(role);
      // Auto shift tabs to prevent locked layouts if shifting roles
      if (role === "student" || role === "parent" || role === "teacher") {
        if (activeTab === "erp") {
          setActiveTab("home");
        }
      }
    }
  };

  const handleAdmissionRefresh = (newStudent: Student) => {
    fetchState(); // Fully refresh synced server-side DB
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950" id="app-shell-container">
      {/* Top Navigation & Brand Header with Hamburger Click callback */}
      <AppHeader currentRole={userRole} onChangeRole={handleRoleChange} onMenuClick={() => setIsDrawerOpen(true)} />

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full flex flex-col gap-6">
        
        {/* Navigation Tabs Menu */}
        <nav className="flex flex-wrap gap-2 border-b border-slate-800 pb-3" id="app-tab-navigation">
          {[
            { id: "home", label: "प्रवेश व अकॅडमी (Home / Admissions)", icon: Award, allowed: ["admin", "teacher", "student", "parent"] },
            { id: "tracker", label: "प्रगती ट्रॅकर (Study Tracker)", icon: GraduationCap, allowed: ["admin", "teacher", "student", "parent"] },
            { id: "erp", label: "ईआरपी व्यवस्थापन (ERP Panel)", icon: Landmark, allowed: ["admin"] },
            { id: "lms", label: "डिजिटल अभ्यासक्रम (LMS Study)", icon: BookOpen, allowed: ["admin", "teacher", "student", "parent"] },
            { id: "live", label: "थेट वर्ग (Live Whiteboard)", icon: Video, allowed: ["admin", "teacher", "student", "parent"] },
            { id: "practice", label: "सराव परीक्षा (Test Center)", icon: GraduationCap, allowed: ["admin", "teacher", "student", "parent"] },
            { id: "ai", label: "समर्थ AI मार्गदर्शक (Doubt Solver)", icon: BrainCircuit, allowed: ["admin", "teacher", "student", "parent"] }
          ]
            .filter((tab) => tab.allowed.includes(userRole))
            .map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-nav-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg scale-102"
                      : "text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <IconComp className="w-4 h-4 shrink-0" />
                  {tab.label}
                </button>
              );
            })}
        </nav>

        {/* Dynamic Panel Renderer with Page Transitions */}
        <main className="flex-1" id="main-content-panel">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-24 space-y-4">
              <span className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></span>
              <p className="text-xs text-slate-500 font-mono">Samarth Academy database initializing...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="w-full"
              >
                {/* --- TAB 1: HOME & ADMISSIONS --- */}
                {activeTab === "home" && (
                  <div className="space-y-8" id="home-tab-view">
                    
                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-br from-red-950 via-slate-900 to-amber-950 border border-slate-800/80 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden shadow-2xl">
                      <div className="space-y-4 text-center md:text-left z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs font-bold font-mono">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          ज्ञान हेच सामर्थ्य
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-none">
                          समर्थ अकॅडमी, परभणी
                        </h2>
                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                          सिंचन नगर, परभणी येथील नामांकित शिक्षण संस्था. शालेय स्तरापासून (४ थी ते १० वी) ते सर्व स्पर्धा परीक्षांपर्यंत (MPSC, Scholarship, Navodaya, NMMS, तलाठी, पोलीस भरती) उत्कृष्ट व दर्जेदार डिजिटल शिक्षण देण्यासाठी कटिबद्ध.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start text-xs font-semibold text-slate-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-red-500" /> Sinchan Nagar, Parbhani
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4 text-emerald-500" /> 9511668617
                          </span>
                          <span className="flex items-center gap-1">
                            <UserCheck className="w-4 h-4 text-amber-500" /> Director: Pratibha R. Ingole
                          </span>
                        </div>
                      </div>

                      {/* Visual Badge */}
                      <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center gap-2 shrink-0 w-44 shadow-lg group relative overflow-hidden">
                        <div className="absolute -inset-0.5 bg-gradient-to-tr from-amber-500/20 to-red-600/20 rounded-2xl blur-sm opacity-50 group-hover:opacity-100 transition duration-300"></div>
                        <img 
                          src={logoImage} 
                          alt="Samarth Academy Logo" 
                          className="relative w-20 h-20 object-cover rounded-xl shadow-md border border-slate-800"
                          referrerPolicy="no-referrer"
                        />
                        <div className="relative z-10 text-center">
                          <span className="text-white font-black text-sm tracking-tight block">Batch 2026</span>
                          <span className="text-amber-500 text-[9px] uppercase font-bold tracking-wider">Active Status</span>
                        </div>
                      </div>
                    </div>

                    {/* School Section & Competitive Exams Courses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* School Syllabus Card */}
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-amber-500" />
                          शालेय विभाग (School Section) — ४ थी ते १० वी
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          महाराष्ट्र राज्य बोर्डानुसार सर्व विषयांचे सखोल मार्गदर्शन व नियमित सराव चाचण्या.
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {COURSES.school.map((s) => (
                            <div key={s.id} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                              <strong className="text-slate-200 block">{s.name}</strong>
                              <span className="text-[10px] text-slate-500">{s.subjects.join(", ")}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Competitive Section Card */}
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-amber-500" />
                          स्पर्धा परीक्षा विभाग (Competitive Exams)
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          NMMS, शिष्यवृत्ती (Scholarship), नवोदय प्रवेश परीक्षा तसेच MPSC, तलाठी व पोलीस भरतीची परिपूर्ण तयारी.
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {COURSES.competitive.map((c) => (
                            <div key={c.id} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                              <strong className="text-slate-200 block">{c.name}</strong>
                              <span className="text-[10px] text-slate-500">{c.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Active Admission Form Component */}
                    <AdmissionForm onAdmissionSuccess={handleAdmissionRefresh} />

                    {/* Teachers Profile Directory */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                      <div className="border-b border-slate-800 pb-3">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <Users className="w-5 h-5 text-amber-500" />
                          आमचे तज्ञ मार्गदर्शक (Expert Faculty Board)
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Experienced subject matter experts and tutors providing quality guidance from school level to competitive stages.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {TEACHERS.map((tch) => (
                          <div key={tch.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3">
                            <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                              <Briefcase className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-sm">{tch.name}</h4>
                              <p className="text-slate-500 text-[10px] uppercase font-bold mt-0.5">{tch.designation}</p>
                            </div>
                            <div className="text-xs text-slate-400 pt-1 border-t border-slate-900">
                              <strong>Subjects:</strong>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {tch.subjects.map((sub, idx) => (
                                  <span key={idx} className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[9px] text-slate-300">
                                    {sub}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* --- STUDY TRACKER PROGRESS REPORT PANEL --- */}
                {activeTab === "tracker" && (
                  <StudyTracker
                    students={students}
                    assignments={assignments}
                    feeLogs={feeLogs}
                    userRole={userRole}
                    onRefreshData={fetchState}
                  />
                )}

                {/* --- TAB 2: ERP MANAGEMENT --- */}
                {activeTab === "erp" && (
                  <ERPManagement
                    students={students}
                    feeLogs={feeLogs}
                    onRefreshData={fetchState}
                  />
                )}

                {/* --- TAB 3: DIGITAL LMS --- */}
                {activeTab === "lms" && (
                  <LMSViewer
                    assignments={assignments}
                    userRole={userRole}
                    onRefreshData={fetchState}
                  />
                )}

                {/* --- TAB 4: LIVE WHITEBOARD CLASSROOM --- */}
                {activeTab === "live" && (
                  <LiveClassroom />
                )}

                {/* --- TAB 5: MCQ TEST CENTER --- */}
                {activeTab === "practice" && (
                  <PracticeTests />
                )}

                {/* --- TAB 6: AI DOUBT SOLVER --- */}
                {activeTab === "ai" && (
                  <AIDoubtSolver />
                )}

              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>

      {/* Footer copyright */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-medium text-slate-400">© 2026 समर्थ अकॅडमी, परभणी | सर्व हक्क सुरक्षित.</p>
          <p className="text-[10px] text-slate-600">
            Director: Pratibha Rajesh Ingole • Address: Sinchan Nagar, Parbhani, Maharashtra • Contact: 9511668617
          </p>
        </div>
      </footer>

      {/* Admin Security Passcode Dialog */}
      <AdminPasscodeModal
        isOpen={showPasscodeModal}
        onClose={() => setShowPasscodeModal(false)}
        onSuccess={() => {
          sessionStorage.setItem("admin_unlocked", "true");
          setUserRole("admin");
          setShowPasscodeModal(false);
        }}
      />

      {/* Floating WhatsApp Chat Widget */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2" id="whatsapp-floating-widget">
        <a
          href="https://api.whatsapp.com/send?phone=919511668617&text=Hello%20Samarth%20Academy%2C%20I%20have%20some%20queries%20about%20admissions."
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 animate-fade-in"
          id="whatsapp-floating-link"
          title="Chat on WhatsApp with Samarth Academy"
        >
          {/* Glowing/pulsing ring */}
          <span className="absolute -inset-1 rounded-full bg-emerald-500/50 opacity-75 animate-ping group-hover:opacity-100 transition-opacity"></span>
          
          {/* Inner Button Container */}
          <span className="relative z-10 flex items-center justify-center w-full h-full bg-emerald-500 hover:bg-emerald-400 rounded-full border border-emerald-400/30 shadow-inner">
            <MessageCircle className="w-7 h-7 text-white" />
          </span>

          {/* Floating Tooltip label */}
          <span className="absolute right-16 scale-0 group-hover:scale-100 bg-slate-900 text-emerald-400 border border-slate-800 text-[11px] font-black tracking-tight px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xl transition-all duration-200 origin-right flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
            WhatsApp Chat
          </span>
        </a>
      </div>

      {/* 3-Lines Hamburger Sidebar Drawer Overlay */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 cursor-pointer"
              id="drawer-backdrop"
            />

            {/* Sliding Drawer Body */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 left-0 bottom-0 w-80 max-w-[90vw] bg-slate-900 border-r border-slate-800 z-50 flex flex-col shadow-2xl overflow-hidden"
              id="drawer-body"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-red-600 p-0.5 flex items-center justify-center">
                    <img src={logoImage} className="w-full h-full object-cover rounded-md" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white tracking-tight">Samarth Academy</h3>
                    <p className="text-[10px] text-amber-500 font-bold font-mono">Batch 2026 ERP</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors cursor-pointer"
                  id="drawer-close-btn"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Categories List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-none" id="drawer-categories">
                
                {/* CATEGORY 1: DASHBOARD QUICKLINKS */}
                <div className="space-y-2.5">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500 block px-1">
                    🎯 मुख्य विभाग (Dashboard Categories)
                  </span>
                  
                  <div className="grid grid-cols-1 gap-1">
                    {[
                      { id: "home", label: "प्रवेश व मुख्य दालन", desc: "Academy main admissions & faculty portal", icon: Award },
                      { id: "tracker", label: "प्रगती ट्रॅकर (Study Tracker)", desc: "Student progress, mock grades & attendance", icon: GraduationCap, badge: "Special" },
                      { id: "lms", label: "डिजिटल अभ्यासक्रम", desc: "View syllabus materials & assignments", icon: BookOpen }
                    ].map((item) => {
                      const IconComp = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setIsDrawerOpen(false);
                          }}
                          className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                            isActive
                              ? "bg-gradient-to-r from-red-600/10 to-amber-600/10 border-amber-500/30 text-amber-400"
                              : "bg-slate-950/20 border-transparent text-slate-300 hover:bg-slate-950/60 hover:text-white"
                          }`}
                        >
                          <IconComp className={`w-5 h-5 mt-0.5 shrink-0 ${isActive ? "text-amber-400" : "text-slate-500"}`} />
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold leading-none">{item.label}</span>
                              {item.badge && (
                                <span className="text-[8px] bg-red-600 text-white font-extrabold px-1.5 py-0.5 rounded-full animate-pulse leading-none">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[9px] text-slate-500 leading-normal">{item.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* CATEGORY 2: ALL CHANNELS & FEATURES */}
                <div className="space-y-2.5">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500 block px-1">
                    📚 सर्व पर्याय (All Website features)
                  </span>

                  <div className="grid grid-cols-1 gap-1">
                    {[
                      { id: "home", label: "Admissions Home", icon: Award, allowed: ["admin", "teacher", "student", "parent"] },
                      { id: "tracker", label: "Study Progress Tracker", icon: GraduationCap, allowed: ["admin", "teacher", "student", "parent"] },
                      { id: "erp", label: "Director ERP panel", icon: Landmark, allowed: ["admin"] },
                      { id: "lms", label: "LMS Digital syllabus", icon: BookOpen, allowed: ["admin", "teacher", "student", "parent"] },
                      { id: "live", label: "Live Whiteboard Class", icon: Video, allowed: ["admin", "teacher", "student", "parent"] },
                      { id: "practice", label: "MCQ Practice Tests", icon: GraduationCap, allowed: ["admin", "teacher", "student", "parent"] },
                      { id: "ai", label: "AI Doubt Solver Guide", icon: BrainCircuit, allowed: ["admin", "teacher", "student", "parent"] }
                    ]
                      .filter(t => t.allowed.includes(userRole))
                      .map((item) => {
                        const IconComp = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id);
                              setIsDrawerOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                              isActive
                                ? "bg-slate-950 text-white font-bold border-l-2 border-amber-500"
                                : "text-slate-400 hover:text-white hover:bg-slate-950/40"
                            }`}
                          >
                            <IconComp className={`w-4 h-4 shrink-0 ${isActive ? "text-amber-400" : "text-slate-500"}`} />
                            {item.label}
                          </button>
                        );
                      })}
                  </div>
                </div>

              </div>

              {/* Drawer Footer info */}
              <div className="p-5 border-t border-slate-800 bg-slate-950 text-[11px] text-slate-500 space-y-2.5">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex flex-col gap-1 text-slate-400">
                  <span className="text-[9px] uppercase font-bold text-slate-500">Contact Desk</span>
                  <p className="font-bold flex items-center gap-1 text-slate-300">
                    📞 <a href="tel:9511668617" className="hover:underline text-amber-500 font-black">9511668617</a>
                  </p>
                </div>
                <p className="text-[10px] text-slate-600 leading-normal text-center font-sans">
                  Sinchan Nagar, Parbhani • ERP 2026 Secure Access System.
                </p>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
