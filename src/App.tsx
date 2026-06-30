import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GraduationCap, Landmark, BookOpen, Video, BrainCircuit, UserCheck, Phone, MapPin, ShieldCheck, Star, Users, Briefcase, Award } from "lucide-react";
import AppHeader from "./components/AppHeader";
import AdmissionForm from "./components/AdmissionForm";
import LiveClassroom from "./components/LiveClassroom";
import PracticeTests from "./components/PracticeTests";
import AIDoubtSolver from "./components/AIDoubtSolver";
import ERPManagement from "./components/ERPManagement";
import LMSViewer from "./components/LMSViewer";
import { Student, FeeLog, Assignment } from "./types";
import { ACADEMY_INFO, COURSES, TEACHERS } from "./data";

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [feeLogs, setFeeLogs] = useState<FeeLog[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("admin"); // default Admin/Director
  const [activeTab, setActiveTab] = useState<string>("home");

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
    setUserRole(role);
    // Auto shift tabs to prevent locked layouts if shifting roles
    if (role === "student" || role === "parent") {
      if (activeTab === "erp") {
        setActiveTab("lms");
      }
    }
  };

  const handleAdmissionRefresh = (newStudent: Student) => {
    fetchState(); // Fully refresh synced server-side DB
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950" id="app-shell-container">
      {/* Top Navigation & Brand Header */}
      <AppHeader currentRole={userRole} onChangeRole={handleRoleChange} />

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full flex flex-col gap-6">
        
        {/* Navigation Tabs Menu */}
        <nav className="flex flex-wrap gap-2 border-b border-slate-800 pb-3" id="app-tab-navigation">
          {[
            { id: "home", label: "प्रवेश व अकॅडमी (Home / Admissions)", icon: Award, allowed: ["admin", "teacher", "student", "parent"] },
            { id: "erp", label: "ईआरपी व्यवस्थापन (ERP Panel)", icon: Landmark, allowed: ["admin", "teacher"] },
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
                      <div className="bg-slate-950/70 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center gap-1 shrink-0 w-44 shadow-lg">
                        <GraduationCap className="w-10 h-10 text-amber-500" />
                        <span className="text-white font-black text-xl tracking-tight">Active</span>
                        <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wide">Batch 2026</span>
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
    </div>
  );
}
