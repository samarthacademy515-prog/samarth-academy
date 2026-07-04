import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Video, Users, Trash2, Play, CheckCircle, Info, Bell,
  Plus, Calendar as CalendarIcon, Clock, BookOpen, AlertCircle, 
  RefreshCw, Download, Edit, Search, ArrowLeft, Check, Copy, CheckSquare, 
  ChevronLeft, ChevronRight, Eye, ShieldAlert, Award
} from "lucide-react";
import { API as API_URL } from "../config";

interface LiveClassroomProps {
  currentUser: {
    role: "admin" | "teacher" | "student" | "parent" | "guest";
    name: string;
    email?: string;
    phone?: string;
    studentId?: string;
    loginCode?: string;
  } | null;
}

interface LiveClass {
  id: string;
  subject: string;
  teacher: string;
  class: string; // Standard (e.g. 10th Standard, MPSC Group B)
  section: string; // Batch (e.g. School Section, Competitive Exams)
  description: string;
  meetingTitle: string;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime?: string; // HH:MM
  duration: number; // in minutes
  meetLink: string;
  meetingRoom?: string; // backwards compatibility
  createdBy: string;
  status: "scheduled" | "live" | "completed";
  createdAt: string;
  startedTime?: string | null;
  endedTime?: string | null;
}

interface AttendanceRecord {
  id: string;
  meetingId: string;
  studentId: string;
  studentName: string;
  joinedAt: string;
  leftAt: string | null;
  duration: number;
  device: string;
  browser: string;
  status: string;
}

interface ClassHistory {
  id: string;
  classId: string;
  title: string;
  subject: string;
  teacher: string;
  date: string;
  meetLink: string;
  duration: number;
  attendanceCount: number;
  studentsJoined: { studentId: string; studentName: string; joinedAt: string }[];
  createdBy: string;
  createdTime: string;
  endedTime: string;
}

interface AppNotification {
  id: string;
  title: string;
  message: string;
  class: string;
  section: string;
  type: string;
  classId: string;
  createdAt: string;
  readBy: string[];
}

export default function LiveClassroom({ currentUser }: LiveClassroomProps) {
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [history, setHistory] = useState<ClassHistory[]>([]);
  const [allAttendance, setAllAttendance] = useState<AttendanceRecord[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Navigation & View States
  const [viewMode, setViewMode] = useState<"list" | "create" | "edit" | "attendance" | "history" | "calendar">("list");
  const [selectedClassForAttendance, setSelectedClassForAttendance] = useState<LiveClass | null>(null);
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Real-time ticker state to force-re-render countdowns & live timers
  const [ticker, setTicker] = useState(0);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "live" | "scheduled" | "completed">("all");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterBatch, setFilterBatch] = useState("all");

  // Calendar States
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

  // Form input states
  const [formData, setFormData] = useState({
    id: "",
    subject: "Mathematics",
    teacher: currentUser?.role === "teacher" ? currentUser.name : "PRATIBHA .R. INGOLE",
    className: "10th Standard",
    section: "School Section",
    description: "",
    meetingTitle: "",
    startDate: new Date().toISOString().split("T")[0],
    startTime: "10:00",
    endTime: "11:00",
    duration: 60,
    meetLink: "",
  });

  const canManage = currentUser?.role === "admin" || currentUser?.role === "teacher";

  // Tick helper for live clocks
  useEffect(() => {
    const interval = setInterval(() => {
      setTicker(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch all states from backends
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 1. Fetch live classes
      const resClasses = await fetch(`${API_URL}/api/live-classes`);
      if (resClasses.ok) {
        const data = await resClasses.json();
        setClasses(data);
      } else {
        setError("शेड्युल लोड करण्यास अपयश (Failed to load live classes).");
      }

      // 2. Fetch History
      const resHistory = await fetch(`${API_URL}/api/live-classes/history`);
      if (resHistory.ok) {
        const data = await resHistory.json();
        setHistory(data);
      }

      // 3. Fetch all attendance logs (if manager)
      if (canManage) {
        const resAtt = await fetch(`${API_URL}/api/live-classes/attendance`);
        if (resAtt.ok) {
          const data = await resAtt.json();
          setAllAttendance(data);
        }
      }

      // 4. Fetch notifications
      const resNotif = await fetch(`${API_URL}/api/notifications`);
      if (resNotif.ok) {
        const data = await resNotif.json();
        setNotifications(data);
      }

    } catch (err) {
      console.error(err);
      setError("सर्व्हरशी संपर्क होऊ शकला नाही. (Server connection failed).");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  // Handle Form changes and auto calculate duration
  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const startParts = formData.startTime.split(":");
      const endParts = formData.endTime.split(":");
      if (startParts.length === 2 && endParts.length === 2) {
        const startDateObj = new Date(2000, 0, 1, Number(startParts[0]), Number(startParts[1]));
        const endDateObj = new Date(2000, 0, 1, Number(endParts[0]), Number(endParts[1]));
        let diffMins = Math.round((endDateObj.getTime() - startDateObj.getTime()) / 60000);
        if (diffMins < 0) diffMins += 1440; // Next day fallback
        setFormData(prev => ({ ...prev, duration: diffMins }));
      }
    }
  }, [formData.startTime, formData.endTime]);

  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    let device = "Desktop Client";
    if (/Android/i.test(ua)) device = "Android Mobile";
    else if (/iPhone/i.test(ua)) device = "iPhone Mobile";
    else if (/iPad/i.test(ua)) device = "iPad Tablet";
    else if (/Macintosh/i.test(ua)) device = "Mac OS Desktop";
    
    let browser = "Chrome Browser";
    if (/Firefox/i.test(ua)) browser = "Firefox";
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";
    else if (/Edge/i.test(ua)) browser = "Edge";
    
    return { device, browser };
  };

  // Create class on server
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.meetLink.trim()) {
      alert("कृपया गुगल मीट लिंक प्रविष्ट करा (Please enter a Google Meet Link).");
      return;
    }
    if (!formData.meetLink.includes("meet.google.com")) {
      if (!confirm("Your link doesn't look like a standard Google Meet URL. Do you want to proceed anyway?")) {
        return;
      }
    }

    try {
      const res = await fetch(`${API_URL}/api/live-classes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: formData.subject,
          teacher: formData.teacher,
          class: formData.className,
          section: formData.section,
          description: formData.description,
          meetingTitle: formData.meetingTitle,
          startDate: formData.startDate,
          startTime: formData.startTime,
          endTime: formData.endTime,
          duration: formData.duration,
          meetLink: formData.meetLink.trim(),
          createdBy: currentUser?.name || "Administrator"
        })
      });

      if (res.ok) {
        fetchData();
        setViewMode("list");
        resetForm();
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to create live class.");
      }
    } catch (err) {
      alert("Error contacting server.");
    }
  };

  // Edit class loading
  const handleEditClass = (liveClass: LiveClass) => {
    setFormData({
      id: liveClass.id,
      subject: liveClass.subject,
      teacher: liveClass.teacher,
      className: liveClass.class,
      section: liveClass.section,
      description: liveClass.description,
      meetingTitle: liveClass.meetingTitle,
      startDate: liveClass.startDate,
      startTime: liveClass.startTime,
      endTime: liveClass.endTime || "",
      duration: liveClass.duration,
      meetLink: liveClass.meetLink
    });
    setViewMode("edit");
  };

  // Save edits on server
  const handleUpdateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/live-classes/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: formData.subject,
          teacher: formData.teacher,
          class: formData.className,
          section: formData.section,
          description: formData.description,
          meetingTitle: formData.meetingTitle,
          startDate: formData.startDate,
          startTime: formData.startTime,
          endTime: formData.endTime,
          duration: formData.duration,
          meetLink: formData.meetLink.trim()
        })
      });

      if (res.ok) {
        fetchData();
        setViewMode("list");
        resetForm();
      } else {
        alert("Failed to update class details.");
      }
    } catch (err) {
      alert("Error contacting server.");
    }
  };

  // Duplicate class helper
  const handleDuplicateClass = (liveClass: LiveClass) => {
    setFormData({
      id: "",
      subject: liveClass.subject,
      teacher: liveClass.teacher,
      className: liveClass.class,
      section: liveClass.section,
      description: liveClass.description,
      meetingTitle: `${liveClass.meetingTitle} (Copy)`,
      startDate: new Date().toISOString().split("T")[0],
      startTime: liveClass.startTime,
      endTime: liveClass.endTime || "",
      duration: liveClass.duration,
      meetLink: liveClass.meetLink
    });
    setViewMode("create");
  };

  // Delete class on server
  const handleDeleteClass = async (id: string) => {
    if (!confirm("Are you sure you want to cancel and delete this live class session?")) return;
    try {
      const res = await fetch(`${API_URL}/api/live-classes/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchData();
      } else {
        alert("Failed to delete scheduled class.");
      }
    } catch (err) {
      alert("Error deleting class.");
    }
  };

  // Start class -> change status to live
  const handleStartClass = async (liveClass: LiveClass) => {
    try {
      const res = await fetch(`${API_URL}/api/live-classes/${liveClass.id}/start`, {
        method: "POST"
      });
      if (res.ok) {
        fetchData();
        // Open Google Meet immediately in tab for the starting teacher
        window.open(liveClass.meetLink, "_blank");
      } else {
        alert("Failed to start the class.");
      }
    } catch (err) {
      alert("Error starting class.");
    }
  };

  // End class -> change status to completed & log history
  const handleEndClass = async (liveClass: LiveClass) => {
    if (!confirm("Are you sure you want to end this live stream class session?")) return;
    try {
      const res = await fetch(`${API_URL}/api/live-classes/${liveClass.id}/end`, {
        method: "POST"
      });
      if (res.ok) {
        fetchData();
      } else {
        alert("Failed to cleanly complete the session.");
      }
    } catch (err) {
      alert("Error ending class.");
    }
  };

  // Student joining class -> log attendance & open tab
  const handleJoinClass = async (liveClass: LiveClass) => {
    try {
      const { device, browser } = getDeviceInfo();
      const studId = currentUser?.studentId || currentUser?.loginCode || "STU-GUEST-" + Math.floor(Math.random() * 100);
      const studName = currentUser?.name || "Student User";
      
      // Log join on backend
      await fetch(`${API_URL}/api/live-classes/${liveClass.id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: studId,
          studentName: studName,
          device,
          browser
        })
      });

      // Open Google Meet in a new tab
      window.open(liveClass.meetLink, "_blank");
      
      // Sync local status
      fetchData();
    } catch (err) {
      console.error(err);
      // Fallback: make sure the meet opens regardless of logging failure
      window.open(liveClass.meetLink, "_blank");
    }
  };

  // View Attendance for class
  const handleViewAttendance = async (liveClass: LiveClass) => {
    try {
      setSelectedClassForAttendance(liveClass);
      setLoadingAttendance(true);
      setViewMode("attendance");
      const res = await fetch(`${API_URL}/api/live-classes/${liveClass.id}/attendance`);
      if (res.ok) {
        const data = await res.json();
        setAttendanceList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAttendance(false);
    }
  };

  // Clear in-app notifications
  const handleClearNotifications = async () => {
    try {
      const studId = currentUser?.studentId || currentUser?.loginCode || "GUEST";
      await fetch(`${API_URL}/api/notifications/read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: studId })
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const downloadAttendanceCSV = () => {
    if (!selectedClassForAttendance || attendanceList.length === 0) return;
    
    const headers = ["Student ID", "Student Name", "Joined At", "Left At/Ended", "Duration (mins)", "Device", "Browser", "Status"];
    const rows = attendanceList.map(a => [
      `"${a.studentId}"`,
      `"${a.studentName}"`,
      `"${new Date(a.joinedAt).toLocaleString()}"`,
      a.leftAt ? `"${new Date(a.leftAt).toLocaleString()}"` : `"Active"`,
      a.duration || 0,
      `"${a.device}"`,
      `"${a.browser}"`,
      `"${a.status}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Attendance_${selectedClassForAttendance.meetingTitle.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetForm = () => {
    setFormData({
      id: "",
      subject: "Mathematics",
      teacher: currentUser?.role === "teacher" ? currentUser.name : "PRATIBHA .R. INGOLE",
      className: "10th Standard",
      section: "School Section",
      description: "",
      meetingTitle: "",
      startDate: new Date().toISOString().split("T")[0],
      startTime: "10:00",
      endTime: "11:00",
      duration: 60,
      meetLink: "",
    });
  };

  // Countdown & Timer math helpers
  const getCountdownText = (startDate: string, startTime: string) => {
    const target = new Date(`${startDate}T${startTime}`);
    const now = new Date();
    const diffMs = target.getTime() - now.getTime();
    if (diffMs <= 0) return null;
    
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 10) {
      return { text: `⚠️ Starts in ${diffMins}m!`, isCritical: true };
    }
    if (diffMins < 60) {
      return { text: `Starts in ${diffMins}m`, isCritical: false };
    }
    const diffHours = Math.floor(diffMins / 60);
    const remMins = diffMins % 60;
    return { text: `Starts in ${diffHours}h ${remMins}m`, isCritical: false };
  };

  const getLiveDurationText = (startedTime?: string | null) => {
    if (!startedTime) return "00:00";
    const start = new Date(startedTime);
    const now = new Date();
    const diffSecs = Math.floor((now.getTime() - start.getTime()) / 1000);
    if (diffSecs < 0) return "00:00";
    const mins = Math.floor(diffSecs / 60);
    const secs = diffSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Filter & Search computation
  const filteredClasses = classes.filter(c => {
    const matchesSearch = 
      c.meetingTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" ? true : c.status === filterStatus;
    const matchesSubject = filterSubject === "all" ? true : c.subject === filterSubject;
    const matchesBatch = filterBatch === "all" ? true : c.class === filterBatch;

    // Students only see their standard
    const matchesStudentScope = currentUser?.role === "student"
      ? (c.class === "10th Standard" || c.class === "8th Standard" || c.class === "9th Standard" || c.class === "MPSC Group B" || c.class === "Navodaya" || c.class === "Police Bharti" || c.class === "NMMS") // Match general or fallback standard
      : true;

    return matchesSearch && matchesStatus && matchesSubject && matchesBatch && matchesStudentScope;
  });

  // Calculate statistics
  const liveCount = classes.filter(c => c.status === "live").length;
  const totalCompleted = classes.filter(c => c.status === "completed").length;
  const totalUpcoming = classes.filter(c => c.status === "scheduled").length;

  const attendancePercent = (() => {
    if (allAttendance.length === 0) return 0;
    const present = allAttendance.filter(a => a.status === "Present").length;
    return Math.round((present / allAttendance.length) * 100);
  })();

  // Notification badge calculation
  const unreadNotifications = notifications.filter(n => {
    const studId = currentUser?.studentId || currentUser?.loginCode || "GUEST";
    return !n.readBy.includes(studId);
  });

  // Calendar View Helpers
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 1));
  };

  const getSubjectColorClass = (sub: string) => {
    switch (sub.toLowerCase()) {
      case "mathematics": return "border-orange-500 text-orange-400 bg-orange-950/20";
      case "science": return "border-emerald-500 text-emerald-400 bg-emerald-950/20";
      case "marathi grammar": return "border-blue-500 text-blue-400 bg-blue-950/20";
      case "english": return "border-purple-500 text-purple-400 bg-purple-950/20";
      default: return "border-amber-500 text-amber-400 bg-amber-950/20";
    }
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen p-4 md:p-6" id="live-classroom-module">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-900 pb-5" id="live-classroom-header">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-500">Live Lectures Module</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            लाईव्ह क्लासेस आणि व्याख्याने <span className="text-orange-500 text-sm font-semibold font-mono">(Live Google Meet Lectures)</span>
          </h2>
          <p className="text-xs text-slate-400">
            {canManage 
              ? "Schedule, edit, and launch live lecture segments via Google Meet with real-time student presence logger."
              : "Access your virtual lecture halls, check schedules, and join live learning sessions instantly."}
          </p>
        </div>

        <div className="flex items-center gap-2" id="header-actions">
          {/* Calendar / List Mode Toggle */}
          <button 
            onClick={() => setViewMode(viewMode === "calendar" ? "list" : "calendar")}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 transition-all flex items-center gap-2 cursor-pointer"
          >
            <CalendarIcon className="w-4 h-4 text-orange-500" />
            {viewMode === "calendar" ? "List View" : "Calendar View"}
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl relative cursor-pointer"
              title="Recent alerts"
            >
              <Bell className="w-4.5 h-4.5 text-orange-500" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[9px] font-black flex items-center justify-center animate-bounce">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl z-50 space-y-3"
                  id="notif-popover"
                >
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <h4 className="text-xs font-black uppercase text-orange-500 flex items-center gap-1">
                      <Bell className="w-3.5 h-3.5" /> सूचना आणि संदेश (Alerts)
                    </h4>
                    {unreadNotifications.length > 0 && (
                      <button 
                        onClick={handleClearNotifications}
                        className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-[10px] text-slate-500 text-center py-4">No recent classroom notifications.</p>
                    ) : (
                      notifications.slice().reverse().map((ntf) => {
                        const isUnread = !ntf.readBy.includes(currentUser?.studentId || currentUser?.loginCode || "GUEST");
                        return (
                          <div 
                            key={ntf.id} 
                            className={`p-2.5 rounded-lg border text-[11px] transition-colors ${
                              isUnread 
                                ? "bg-orange-500/5 border-orange-500/20" 
                                : "bg-slate-950/50 border-slate-850"
                            }`}
                          >
                            <div className="flex justify-between items-start gap-1">
                              <strong className="text-white block font-bold">{ntf.title}</strong>
                              <span className="text-[8px] text-slate-500 whitespace-nowrap font-mono">
                                {new Date(ntf.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-slate-400 mt-1 leading-normal">{ntf.message}</p>
                            <span className="text-[9px] bg-slate-800/80 text-orange-400 px-1.5 py-0.5 rounded mt-1.5 inline-block font-mono">
                              {ntf.class} ({ntf.section})
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Add Live Class Button for Managers */}
          {canManage && (
            <button 
              onClick={() => { resetForm(); setViewMode("create"); }}
              className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              id="schedule-class-btn"
            >
              <Plus className="w-4 h-4 text-slate-950 font-black" /> नवीन वर्ग जोडा (New Lecture)
            </button>
          )}
        </div>
      </div>

      {/* 2. Bento Statistics Panel (Only visible in listing/calendar views) */}
      {(viewMode === "list" || viewMode === "calendar") && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" id="bento-stats-panel">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
              <Video className="w-12 h-12 text-orange-500" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Live Lectures</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-orange-500 font-mono">{liveCount}</span>
              {liveCount > 0 && (
                <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded-full font-bold animate-pulse">LIVE NOW</span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Direct classroom stream portals active.</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
              <CalendarIcon className="w-12 h-12 text-amber-500" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Upcoming Scheduled</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white font-mono">{totalUpcoming}</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Lectures indexed in calendar queue.</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Completed Lectures</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-400 font-mono">{totalCompleted}</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Archived under lecture logs.</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
              <Users className="w-12 h-12 text-blue-500" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Attendance Rate</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-blue-400 font-mono">{attendancePercent}%</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Virtual logs synchronized correctly.</span>
          </div>
        </div>
      )}

      {/* 3. VIEW MODE SWITCHING */}

      {/* A. CREATE & EDIT VIEW (SCHEDULER FORM) */}
      {(viewMode === "create" || viewMode === "edit") && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-950 p-6 rounded-3xl border border-slate-900 shadow-xl max-w-3xl mx-auto"
          id="scheduler-form-wrapper"
        >
          <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setViewMode("list")}
                className="p-2 hover:bg-slate-900 rounded-xl transition-colors cursor-pointer text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-4.5 h-4.5" />
              </button>
              <div>
                <h3 className="text-md font-extrabold text-white">
                  {viewMode === "create" ? "नवीन वर्ग शेड्युल करा (Create New Google Meet Class)" : "वर्ग माहिती सुधारित करा (Edit Scheduled Class)"}
                </h3>
                <p className="text-[11px] text-slate-400">Specify details, durations, target batch and insert Google Meet URL.</p>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase bg-orange-500/10 text-orange-500 border border-orange-500/20 px-2.5 py-1 rounded-md">
              Google Meet Integration
            </span>
          </div>

          <form onSubmit={viewMode === "create" ? handleCreateClass : handleUpdateClass} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Meeting Title */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-[11px] font-black uppercase text-slate-400">Class Title (विषय शीर्षक) *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Class 10 Maths - Trigonometry Formulas & Short Tricks"
                  value={formData.meetingTitle}
                  onChange={e => setFormData({ ...formData, meetingTitle: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-all font-semibold"
                />
              </div>

              {/* Subject Select */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-black uppercase text-slate-400">Subject (विषय) *</label>
                <select
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-all font-semibold"
                >
                  <option value="Mathematics">Mathematics (गणित)</option>
                  <option value="Science">Science (विज्ञान)</option>
                  <option value="Marathi Grammar">Marathi Grammar (मराठी व्याकरण)</option>
                  <option value="English">English (इंग्रजी)</option>
                  <option value="History">History / Civics (इतिहास आणि नागरिकशास्त्र)</option>
                  <option value="Mental Ability">Mental Ability (बुद्धिमत्ता चाचणी)</option>
                </select>
              </div>

              {/* Instructor */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-black uppercase text-slate-400">Instructor Name (शिक्षक) *</label>
                <input 
                  type="text"
                  required
                  value={formData.teacher}
                  onChange={e => setFormData({ ...formData, teacher: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-all font-semibold"
                />
              </div>

              {/* Standard (Class Target) */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-black uppercase text-slate-400">Target Standard / Class *</label>
                <select
                  value={formData.className}
                  onChange={e => setFormData({ ...formData, className: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-all font-semibold"
                >
                  <option value="10th Standard">10th Standard</option>
                  <option value="9th Standard">9th Standard</option>
                  <option value="8th Standard">8th Standard</option>
                  <option value="MPSC Group B">MPSC Group B</option>
                  <option value="Police Bharti">Police Bharti</option>
                  <option value="Navodaya">Navodaya</option>
                  <option value="NMMS">NMMS</option>
                </select>
              </div>

              {/* Batch/Section */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-black uppercase text-slate-400">Target Batch / Division *</label>
                <select
                  value={formData.section}
                  onChange={e => setFormData({ ...formData, section: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-all font-semibold"
                >
                  <option value="School Section">School Section</option>
                  <option value="Competitive Exams">Competitive Exams Batch</option>
                  <option value="Morning Batch">Morning Batch</option>
                  <option value="Evening Batch">Evening Batch</option>
                </select>
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-black uppercase text-slate-400">Lecture Date (दिनांक) *</label>
                <input 
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-all font-semibold"
                />
              </div>

              {/* Start & End Times */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-black uppercase text-slate-400">Start Time *</label>
                  <input 
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-orange-500 transition-all font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-black uppercase text-slate-400">End Time *</label>
                  <input 
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-orange-500 transition-all font-semibold"
                  />
                </div>
              </div>

              {/* Google Meet Link input */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-[11px] font-black uppercase text-slate-400">Google Meet URL (गुगल मीट लिंक) *</label>
                <div className="relative">
                  <input 
                    type="url"
                    required
                    placeholder="https://meet.google.com/abc-defg-hij"
                    value={formData.meetLink}
                    onChange={e => setFormData({ ...formData, meetLink: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-all font-mono text-xs font-semibold text-orange-400"
                  />
                  <Video className="absolute left-3.5 top-3.5 w-4 h-4 text-orange-500" />
                </div>
                <span className="text-[10px] text-slate-500 block">Enter the manually created meeting link. Students can launch directly into a new tab upon start.</span>
              </div>

              {/* Description */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-[11px] font-black uppercase text-slate-400">Lecture Guidelines / Description (मार्गदर्शक तत्त्वे)</label>
                <textarea 
                  rows={3}
                  placeholder="Topic objectives, prerequisite formulas, or references students should bring to this class..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-all font-semibold"
                />
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-900">
              <button 
                type="button" 
                onClick={() => setViewMode("list")}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 rounded-xl border border-slate-800 font-bold transition-all text-slate-300 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl transition-all shadow-lg flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-4.5 h-4.5 text-slate-950 font-black" />
                {viewMode === "create" ? "शेड्युल जतन करा (Publish Schedule)" : "बदल जतन करा (Save Changes)"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* B. LIST LECTURES VIEW */}
      {viewMode === "list" && (
        <div className="space-y-6">
          
          {/* Filter Controls Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-900 shadow-md">
            
            {/* Status selector tabs */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "all", label: "सर्व लेक्चर्स (All Lectures)" },
                { id: "live", label: "🔴 सुरू असलेले (Live Now)", badge: classes.filter(x => x.status === "live").length },
                { id: "scheduled", label: "नियोजित (Scheduled)" },
                { id: "completed", label: "पूर्ण झालेले (Ended)" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    filterStatus === tab.id
                      ? "bg-orange-500 text-slate-950 shadow-md font-extrabold"
                      : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-850"
                  }`}
                >
                  {tab.label}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                      filterStatus === tab.id ? "bg-slate-950 text-orange-500" : "bg-red-500 text-white animate-pulse"
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Advance dropdown filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Subject filter */}
              <select 
                value={filterSubject}
                onChange={e => setFilterSubject(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="all">विषय निवडा (All Subjects)</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Marathi Grammar">Marathi Grammar</option>
                <option value="English">English</option>
              </select>

              {/* Batch filter */}
              <select 
                value={filterBatch}
                onChange={e => setFilterBatch(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="all">वर्ग निवडा (All Standards)</option>
                <option value="10th Standard">10th Standard</option>
                <option value="9th Standard">9th Standard</option>
                <option value="8th Standard">8th Standard</option>
                <option value="MPSC Group B">MPSC Group B</option>
                <option value="Police Bharti">Police Bharti</option>
                <option value="Navodaya">Navodaya</option>
                <option value="NMMS">NMMS</option>
              </select>

              {/* Search input */}
              <div className="relative w-full md:w-56" id="search-box-container">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search topic, teacher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

            </div>
          </div>

          {/* LECTURE CARDS GRID */}
          {filteredClasses.length === 0 ? (
            <div className="bg-slate-950 p-16 rounded-3xl border border-slate-900 text-center space-y-4 shadow-inner">
              <Video className="w-12 h-12 text-slate-800 mx-auto" />
              <div className="space-y-1">
                <p className="font-bold text-white text-sm">No Live or Scheduled Classes Indexed</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  There are no virtual sessions matching your criteria. Double check filters or refresh status below.
                </p>
              </div>
              <button 
                onClick={fetchData} 
                className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs font-bold transition-all text-orange-500 hover:text-orange-400 cursor-pointer flex items-center gap-1.5 mx-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Sync Schedules
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.map((liveClass) => {
                const isLive = liveClass.status === "live";
                const isCompleted = liveClass.status === "completed";
                const isScheduled = liveClass.status === "scheduled";

                // Count attendees for this specific class
                const currentClassAttendees = allAttendance.filter(a => a.meetingId === liveClass.id);
                const classAttendanceCount = currentClassAttendees.length;

                // Upcoming warning calculation (10 mins)
                const countdown = getCountdownText(liveClass.startDate, liveClass.startTime);
                const showTenMinWarning = countdown && countdown.isCritical;

                return (
                  <motion.div
                    key={liveClass.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`bg-slate-950 rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-lg group relative ${
                      isLive 
                        ? "border-orange-500/60 shadow-orange-950/10 shadow-2xl" 
                        : isCompleted
                        ? "border-slate-900 opacity-80"
                        : "border-slate-900 hover:border-slate-800"
                    }`}
                  >
                    {/* Orange Glow Top Line for Live Classes */}
                    {isLive && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-600 via-amber-500 to-red-500 animate-pulse"></div>
                    )}

                    <div className="p-5 space-y-4 flex-1">
                      {/* Top Badges Row */}
                      <div className="flex justify-between items-start gap-2">
                        <span className={`border text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md ${getSubjectColorClass(liveClass.subject)}`}>
                          {liveClass.subject}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          {isLive && (
                            <span className="bg-red-600 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full animate-pulse flex items-center gap-1 border border-red-500/30 font-mono">
                              <span className="w-1.5 h-1.5 bg-white rounded-full"></span> LIVE
                            </span>
                          )}
                          {isScheduled && (
                            <span className="bg-blue-600/10 text-blue-400 border border-blue-600/20 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">
                              Scheduled
                            </span>
                          )}
                          {isCompleted && (
                            <span className="bg-slate-900 text-slate-500 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border border-slate-850">
                              Completed
                            </span>
                          )}

                          {showTenMinWarning && isScheduled && (
                            <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full animate-bounce">
                              ⚠️ Starts Soon!
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-1">
                        <h4 className="text-sm font-extrabold text-white group-hover:text-orange-500 transition-colors leading-snug tracking-tight line-clamp-2">
                          {liveClass.meetingTitle}
                        </h4>
                        {liveClass.description ? (
                          <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2 italic">
                            "{liveClass.description}"
                          </p>
                        ) : (
                          <p className="text-slate-600 text-[11px] italic">No description details specified.</p>
                        )}
                      </div>

                      {/* Class Specs / Timing Grid */}
                      <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-900 space-y-2.5 text-[11px] font-semibold text-slate-300">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Target Standard:</span>
                          <strong className="text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-850">{liveClass.class}</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Batch / division:</span>
                          <span className="text-white font-bold">{liveClass.section}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Instructor:</span>
                          <span className="text-orange-400 font-bold">{liveClass.teacher}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Date & Time:</span>
                          <span className="text-white font-mono">{liveClass.startDate} • {liveClass.startTime}</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-900/60 pt-2 font-mono">
                          <span className="text-slate-500">Scheduled Duration:</span>
                          <span className="text-white">{liveClass.duration} mins</span>
                        </div>
                      </div>

                      {/* Dynamic Live Ticker / Countdown Displays */}
                      {isLive && (
                        <div className="bg-red-950/20 border border-red-500/15 p-3 rounded-xl flex items-center justify-between text-xs">
                          <span className="text-red-400 flex items-center gap-1.5 font-bold uppercase text-[9px] tracking-wider">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span> Live Duration:
                          </span>
                          <span className="text-white font-black font-mono text-xs">
                            {getLiveDurationText(liveClass.startedTime)}
                          </span>
                        </div>
                      )}

                      {isScheduled && countdown && (
                        <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                          countdown.isCritical 
                            ? "bg-orange-500/10 border-orange-500/30 text-orange-400 animate-pulse" 
                            : "bg-slate-900/30 border-slate-900 text-slate-400"
                        }`}>
                          <span className="text-[10px] uppercase font-extrabold tracking-wider">Time until launch:</span>
                          <strong className="font-mono text-white">{countdown.text}</strong>
                        </div>
                      )}

                      {isCompleted && (
                        <div className="bg-slate-900/20 border border-slate-850 p-3 rounded-xl flex items-center justify-between text-[11px] text-slate-400">
                          <span>Final Class Duration:</span>
                          <strong className="text-slate-300">{liveClass.duration} minutes</strong>
                        </div>
                      )}
                    </div>

                    {/* Action footer strip */}
                    <div className="bg-slate-900/30 px-5 py-4 border-t border-slate-900 flex flex-wrap justify-between items-center gap-3">
                      
                      {/* MANAGER (ADMIN / TEACHER) CONTROLS */}
                      {canManage ? (
                        <div className="flex flex-col gap-2 w-full">
                          
                          <div className="flex gap-1.5 w-full">
                            {isScheduled && (
                              <button
                                onClick={() => handleStartClass(liveClass)}
                                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-[10px] px-3.5 py-2.5 rounded-xl flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                              >
                                <Play className="w-3.5 h-3.5 fill-white" /> Start Lecture
                              </button>
                            )}

                            {isLive && (
                              <div className="flex gap-1.5 w-full">
                                <a
                                  href={liveClass.meetLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex-1 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-slate-950 font-black text-[10px] px-3 py-2.5 rounded-xl flex items-center justify-center gap-1 shadow cursor-pointer"
                                >
                                  <Video className="w-3.5 h-3.5" /> Re-Enter Meet
                                </a>
                                <button
                                  onClick={() => handleEndClass(liveClass)}
                                  className="flex-1 bg-red-600 hover:bg-red-500 text-white font-black text-[10px] px-3 py-2.5 rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  End Class
                                </button>
                              </div>
                            )}

                            {isCompleted && (
                              <button
                                onClick={() => handleViewAttendance(liveClass)}
                                className="flex-1 bg-slate-900 border border-slate-800 hover:border-slate-700 text-orange-500 hover:text-orange-400 font-extrabold text-[10px] py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> View Attendance ({classAttendanceCount})
                              </button>
                            )}
                          </div>

                          {/* Secondary utility actions */}
                          {!isCompleted && (
                            <div className="flex items-center gap-1 bg-slate-950/40 p-1 rounded-lg border border-slate-900/60 w-full justify-between">
                              <span className="text-[9px] text-slate-500 px-1 font-mono">ID: {liveClass.id}</span>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleDuplicateClass(liveClass)}
                                  className="p-1.5 hover:bg-slate-900 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                                  title="Duplicate schedule details"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleEditClass(liveClass)}
                                  className="p-1.5 hover:bg-slate-900 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                                  title="Edit properties"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteClass(liveClass.id)}
                                  className="p-1.5 hover:bg-red-950/20 text-red-500 hover:text-red-400 rounded transition-colors cursor-pointer"
                                  title="Cancel and remove schedule"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                          
                        </div>
                      ) : (
                        /* STUDENT / PARENT CONTROLS */
                        <div className="w-full">
                          {isLive ? (
                            <button
                              onClick={() => handleJoinClass(liveClass)}
                              className="w-full bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 font-black text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:scale-101 transition-all cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 fill-slate-950" /> वर्गात प्रवेश करा (Join Google Meet Class)
                            </button>
                          ) : isScheduled ? (
                            <div className="text-center w-full bg-slate-900/60 py-2.5 px-4 rounded-xl border border-slate-900 text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-orange-500" /> Class is Offline / Upcoming
                            </div>
                          ) : (
                            <div className="text-center w-full bg-slate-900/20 py-2.5 px-4 rounded-xl border border-slate-900 text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                              Class Session Completed
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* CLASROOM COMPLETED HISTORY TABLE (FOR TEACHER/ADMIN REFERENCE) */}
          {canManage && history.length > 0 && (
            <div className="mt-12 bg-slate-950 p-6 rounded-3xl border border-slate-900 shadow-lg space-y-4">
              <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-orange-500" /> वर्ग इतिहास आणि प्रगती अहवाल (Historical Google Meet Sessions Library)
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Historical overview of ended lectures, attendance counts and durations.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold text-slate-300">
                  <thead className="bg-slate-900 text-[10px] uppercase text-slate-400">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Topic Title</th>
                      <th className="px-4 py-3">Subject</th>
                      <th className="px-4 py-3">Instructor</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Live Duration</th>
                      <th className="px-4 py-3">Joined Students</th>
                      <th className="px-4 py-3 rounded-r-lg">Meet URL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {history.map((hist) => (
                      <tr key={hist.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="px-4 py-3 font-bold text-white max-w-xs truncate">{hist.title}</td>
                        <td className="px-4 py-3"><span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[10px]">{hist.subject}</span></td>
                        <td className="px-4 py-3 text-slate-400">{hist.teacher}</td>
                        <td className="px-4 py-3 font-mono text-[10px]">{hist.date}</td>
                        <td className="px-4 py-3 font-mono text-emerald-400">{hist.duration} mins</td>
                        <td className="px-4 py-3">
                          <span className="bg-blue-950/40 text-blue-400 border border-blue-900 px-2 py-0.5 rounded-full text-[10px] font-black">
                            {hist.attendanceCount} Students
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <a 
                            href={hist.meetLink} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-orange-500 hover:underline truncate max-w-xs block font-mono text-[10px]"
                          >
                            {hist.meetLink}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* C. DETAILED ATTENDANCE SHEET */}
      {viewMode === "attendance" && selectedClassForAttendance && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1 }}
          className="bg-slate-950 p-6 rounded-3xl border border-slate-900 shadow-xl space-y-6"
          id="attendance-log-sheet"
        >
          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setViewMode("list")}
                className="p-2 hover:bg-slate-900 rounded-xl transition-colors cursor-pointer text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-4.5 h-4.5" />
              </button>
              <div>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 px-2.5 py-0.5 rounded font-bold uppercase">
                  Class Presence Register
                </span>
                <h3 className="text-md font-extrabold text-white mt-1">
                  Attendance logs: {selectedClassForAttendance.meetingTitle}
                </h3>
                <p className="text-[11px] text-slate-400">Class Date: {selectedClassForAttendance.startDate} • Instructor: {selectedClassForAttendance.teacher}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={downloadAttendanceCSV}
                disabled={attendanceList.length === 0}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                <Download className="w-4 h-4 text-orange-500" /> Export Excel Sheet (CSV)
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className="px-4 py-2.5 bg-slate-900 text-slate-300 rounded-xl border border-slate-800 text-xs font-bold cursor-pointer"
              >
                Back to Schedule
              </button>
            </div>
          </div>

          {/* Logs Table */}
          {loadingAttendance ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin text-orange-500 mx-auto" />
              <p className="text-xs">Loading presence logs...</p>
            </div>
          ) : attendanceList.length === 0 ? (
            <div className="py-16 text-center border border-slate-900 rounded-2xl bg-slate-950/45 space-y-2">
              <Users className="w-10 h-10 text-slate-800 mx-auto" />
              <strong className="text-white text-xs block">Attendance sheet is empty</strong>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">No student has clicked 'Join' for this lecture link yet. Real-time updates log here instantly.</p>
            </div>
          ) : (
            <div className="border border-slate-900 rounded-2xl overflow-hidden bg-slate-950/40">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase">
                    <tr>
                      <th className="px-6 py-4">Student ID / Code</th>
                      <th className="px-6 py-4">Student Name</th>
                      <th className="px-6 py-4">Join Timestamp</th>
                      <th className="px-6 py-4">Leave Timestamp</th>
                      <th className="px-6 py-4">Presence Minutes</th>
                      <th className="px-6 py-4">System Details</th>
                      <th className="px-6 py-4 text-center">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {attendanceList.map((att) => (
                      <tr key={att.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-orange-400 font-bold">{att.studentId}</td>
                        <td className="px-6 py-4 text-white font-bold">{att.studentName}</td>
                        <td className="px-6 py-4 font-mono text-slate-400 text-[11px]">
                          {new Date(att.joinedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-400 text-[11px]">
                          {att.leftAt ? (
                            new Date(att.leftAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
                          ) : (
                            <span className="text-emerald-500 flex items-center gap-1 font-sans font-bold">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span> Active Now
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-slate-900 border border-slate-800 text-white font-mono px-2 py-1 rounded text-xs">
                            {att.duration || 0} mins
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[11px] text-slate-500">
                          <span>{att.device} • {att.browser}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase">
                            {att.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* D. INTERACTIVE CALENDAR VIEW */}
      {viewMode === "calendar" && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1 }}
          className="bg-slate-950 p-6 rounded-3xl border border-slate-900 shadow-xl space-y-6"
          id="calendar-classroom-view"
        >
          {/* Month selector header */}
          <div className="flex items-center justify-between border-b border-slate-900 pb-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setViewMode("list")}
                className="p-2 hover:bg-slate-900 rounded-xl text-slate-400 hover:text-white cursor-pointer"
              >
                <ArrowLeft className="w-4.5 h-4.5" />
              </button>
              <div>
                <h3 className="text-md font-extrabold text-white">Lecture Calendar Queue (वर्ग कॅलेंडर)</h3>
                <p className="text-[11px] text-slate-400">Map scheduled lectures and direct launch buttons inside physical dates.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrevMonth}
                className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-orange-500" />
              </button>
              <span className="text-xs font-black uppercase text-white min-w-32 text-center">
                {currentCalendarDate.toLocaleString("default", { month: "long" })} {currentCalendarDate.getFullYear()}
              </span>
              <button 
                onClick={handleNextMonth}
                className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 text-orange-500" />
              </button>
            </div>
          </div>

          {/* Grid structure */}
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-extrabold uppercase text-slate-500 border-b border-slate-900 pb-2">
            <span>Sunday</span>
            <span>Monday</span>
            <span>Tuesday</span>
            <span>Wednesday</span>
            <span>Thursday</span>
            <span>Friday</span>
            <span>Saturday</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {/* Pad offset days */}
            {Array.from({ length: getFirstDayOfMonth(currentCalendarDate) }).map((_, idx) => (
              <div key={`pad-${idx}`} className="bg-slate-950/20 border border-transparent min-h-24 rounded-2xl"></div>
            ))}

            {/* Days in month */}
            {Array.from({ length: getDaysInMonth(currentCalendarDate) }).map((_, idx) => {
              const day = idx + 1;
              const dateString = `${currentCalendarDate.getFullYear()}-${(currentCalendarDate.getMonth() + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
              const dayClasses = classes.filter(c => c.startDate === dateString);

              return (
                <div 
                  key={`day-${day}`}
                  className="bg-slate-900/30 border border-slate-900 min-h-24 p-2 rounded-2xl flex flex-col justify-between hover:border-slate-800 transition-colors"
                >
                  <span className="text-slate-400 font-black text-xs block text-left font-mono">{day}</span>
                  
                  <div className="space-y-1 mt-1 flex-1 overflow-y-auto max-h-16 pr-1">
                    {dayClasses.map(dc => {
                      const isLive = dc.status === "live";
                      return (
                        <div 
                          key={dc.id}
                          onClick={() => {
                            setSearchTerm(dc.meetingTitle);
                            setViewMode("list");
                          }}
                          className={`p-1 rounded text-[8px] font-black uppercase text-left truncate cursor-pointer border ${
                            isLive 
                              ? "bg-red-950/30 border-red-500 text-red-400 animate-pulse" 
                              : "bg-slate-950 border-slate-800 text-orange-400 hover:border-slate-700"
                          }`}
                          title={dc.meetingTitle}
                        >
                          {dc.startTime} - {dc.subject}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

    </div>
  );
}
