import React, { useState, useEffect } from "react";
import { Users, BookOpen, CreditCard, ClipboardCheck, Search, PlusCircle, Trash2, Printer, CheckCircle2, UserCheck, AlertTriangle, IndianRupee, Landmark, QrCode, Upload } from "lucide-react";
import { Student, FeeLog } from "../types";
import { COURSES } from "../data";
import { API } from "../config";

interface ERPManagementProps {
  students: Student[];
  feeLogs: FeeLog[];
  onRefreshData: () => void;
}

export default function ERPManagement({ students, feeLogs, onRefreshData }: ERPManagementProps) {
  const [activeTab, setActiveTab] = useState<"directory" | "attendance" | "fees" | "reports" | "logins" | "qrCode">("directory");
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // QR Code Management states
  const [activeQr, setActiveQr] = useState<any>(null);
  const [qrPreview, setQrPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [qrError, setQrError] = useState<string | null>(null);

  const fetchActiveQr = async () => {
    try {
      const response = await fetch(`${API}/api/qr`);
      if (response.ok) {
        const data = await response.json();
        setActiveQr(data);
      }
    } catch (err) {
      console.error("Error fetching active QR:", err);
    }
  };

  useEffect(() => {
    if (activeTab === "qrCode") {
      fetchActiveQr();
      setQrError(null);
      setUploadSuccess(false);
      setQrPreview(null);
      setSelectedFile(null);
    }
  }, [activeTab]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verify format
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setQrError("कृपया फक्त JPG, JPEG, PNG किंवा WEBP फॉरमॅट मधील फोटो निवडा. (Format must be JPG, JPEG, PNG or WEBP)");
      setQrPreview(null);
      setSelectedFile(null);
      return;
    }

    // Verify size (5 MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setQrError("फोटोचा आकार ५ MB पेक्षा कमी असावा. (File size must be under 5 MB)");
      setQrPreview(null);
      setSelectedFile(null);
      return;
    }

    setQrError(null);
    setUploadSuccess(false);
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setQrPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadQr = async () => {
    if (!qrPreview || !selectedFile) {
      setQrError("कृपया आधी एक फोटो निवडा. (Please select a file first)");
      return;
    }

    setUploadLoading(true);
    setQrError(null);
    setUploadSuccess(false);

    try {
      const payload = {
        image: qrPreview,
        fileName: selectedFile.name,
        fileSize: (selectedFile.size / 1024).toFixed(1) + " KB",
        uploadedBy: "Pratibha Rajesh Ingole (Director Admin)"
      };

      const response = await fetch(`${API}/api/qr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setUploadSuccess(true);
      setActiveQr(data.paymentQR);
      setSelectedFile(null);
      setQrPreview(null);
    } catch (err: any) {
      setQrError(err.message || "Something went wrong during upload.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteQr = async () => {
    if (!window.confirm("तुम्हाला खात्री आहे की पेमेंट QR कोड हटवायचा आहे? (Are you sure you want to delete the QR code?)")) return;

    try {
      const response = await fetch(`${API}/api/qr`, { method: "DELETE" });
      if (response.ok) {
        setActiveQr(null);
        setQrPreview(null);
        setSelectedFile(null);
        setUploadSuccess(false);
        alert("QR कोड यशस्वीरित्या हटवला गेला. (QR Code deleted successfully)");
      } else {
        alert("Failed to delete QR code.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLoginHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await fetch(`${API}/api/login-history`);
      if (response.ok) {
        const data = await response.json();
        setLoginHistory(data);
      }
    } catch (err) {
      console.error("Error fetching login history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleClearLoginHistory = async () => {
    if (!window.confirm("Are you sure you want to clear all login history records?")) return;
    try {
      const response = await fetch(`${API}/api/login-history/clear`, { method: "POST" });
      if (response.ok) {
        setLoginHistory([]);
        alert("Login history cleared successfully.");
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  // Search & Filter state for Directory
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState("All");

  // Attendance states
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceLevel, setAttendanceLevel] = useState("10th Standard");
  const [attendanceMap, setAttendanceMap] = useState<Record<string, "Present" | "Absent">>({});
  const [attendanceSuccess, setAttendanceSuccess] = useState<string | null>(null);

  // Fee payment states
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState<number | "">("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [receivedBy, setReceivedBy] = useState("Pratibha R. Ingole");
  const [paymentSuccessReceipt, setPaymentSuccessReceipt] = useState<any | null>(null);

  // Compute stats
  const totalStudents = students.length;
  const totalCollected = students.reduce((acc, s) => acc + s.paidFees, 0);
  const totalPending = students.reduce((acc, s) => acc + (s.totalFees - s.paidFees), 0);

  // Handlers
  const handleDeleteStudent = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this student? This action cannot be undone.")) return;
    try {
      const response = await fetch(`${API}/api/students/${id}`, { method: "DELETE" });
      if (response.ok) {
        onRefreshData();
        alert("Student removed successfully.");
      } else {
        alert("Failed to delete student.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleAttendance = (studentId: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "Present" ? "Absent" : "Present"
    }));
  };

  const handleInitAttendanceMap = () => {
    const filtered = students.filter(s => s.standard === attendanceLevel);
    const initialMap: Record<string, "Present" | "Absent"> = {};
    filtered.forEach(s => {
      // Use existing attendance for this date if present, otherwise default to Present
      initialMap[s.id] = s.attendance?.[attendanceDate] || "Present";
    });
    setAttendanceMap(initialMap);
    setAttendanceSuccess(null);
  };

  const handleSaveAttendance = async () => {
    try {
      const response = await fetch(`${API}/api/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: attendanceDate,
          attendanceMap: attendanceMap
        })
      });

      if (response.ok) {
        setAttendanceSuccess(`attendance saved successfully for date ${attendanceDate}!`);
        onRefreshData();
      } else {
        alert("Failed to save attendance.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePayFees = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !paymentAmount || Number(paymentAmount) <= 0) {
      alert("Please select a student and specify payment amount.");
      return;
    }

    try {
      const response = await fetch(`${API}/api/fees/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudentId,
          amount: Number(paymentAmount),
          mode: paymentMode,
          receivedBy
        })
      });

      if (response.ok) {
        const resData = await response.json();
        setPaymentSuccessReceipt(resData.receipt);
        setPaymentAmount("");
        onRefreshData();
      } else {
        alert("Payment submission failed.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const printReceipt = () => {
    const printContent = document.getElementById("receipt-print-area");
    if (!printContent) return;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Quick state restore
  };

  // Directories filtering
  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === "All" || s.standard === filterLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl" id="erp-management-root">
      
      {/* Sub tabs header */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Landmark className="w-6 h-6 text-amber-500" />
            समर्थ अकॅडमी ईआरपी व्यवस्थापन (Academy ERP Command Center)
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Director level modules for student rosters, attendance tracking, fee accounting and printing tax receipts.
          </p>
        </div>

        {/* Inner modules navigation */}
        <div className="flex flex-wrap gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("directory")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "directory" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> विद्यार्थी नोंदणी (Roster)
          </button>
          <button
            onClick={() => { setActiveTab("attendance"); handleInitAttendanceMap(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "attendance" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" /> उपस्थिती पत्रक (Attendance)
          </button>
          <button
            onClick={() => setActiveTab("fees")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "fees" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" /> फी जमा व पावती (Fees Ledger)
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "reports" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> आर्थिक अहवाल (Financials)
          </button>
          <button
            onClick={() => { setActiveTab("logins"); fetchLoginHistory(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "logins" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-400" /> लॉगिन ट्रॅकर (Logins)
          </button>
          <button
            onClick={() => setActiveTab("qrCode")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "qrCode" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
            id="btn-tab-qr-management"
          >
            <QrCode className="w-3.5 h-3.5 text-amber-400" /> पेमेंट QR व्यवस्थापन (QR Management)
          </button>
        </div>
      </div>

      <div className="p-6">
        
        {/* --- 1. STUDENT DIRECTORY --- */}
        {activeTab === "directory" && (
          <div className="space-y-4" id="erp-directory-panel">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by ID, name or parent..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <span className="text-xs text-slate-500 font-medium">Standard Filter:</span>
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg text-xs px-3 py-1.5 text-slate-300 focus:outline-none"
                >
                  <option value="All">All Standard/Exams</option>
                  <optgroup label="School Standard">
                    {COURSES.school.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Competitive Exams">
                    {COURSES.competitive.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold">
                    <th className="p-3">ID</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Course Standard</th>
                    <th className="p-3">Parent & Contact</th>
                    <th className="p-3">Tuition Fee Details</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-slate-300">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No active student registration files found matching parameters.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((stu) => {
                      const balance = stu.totalFees - stu.paidFees;
                      const isClear = balance <= 0;
                      return (
                        <tr key={stu.id} className="hover:bg-slate-900/50">
                          <td className="p-3 font-mono font-bold text-red-400">{stu.id}</td>
                          <td className="p-3">
                            <strong className="text-white font-semibold">{stu.name}</strong>
                            <p className="text-[10px] text-slate-500 mt-0.5">{stu.address}</p>
                          </td>
                          <td className="p-3">
                            <span className="bg-slate-900 text-amber-400 border border-slate-800 px-2 py-0.5 rounded font-medium">
                              {stu.standard}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="block">{stu.parentName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{stu.phone}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-col gap-0.5">
                              <span>Total: <strong>₹{stu.totalFees}</strong></span>
                              <span className="text-emerald-400">Paid: <strong>₹{stu.paidFees}</strong></span>
                              <span className={isClear ? "text-emerald-500 text-[10px] font-bold" : "text-amber-500 font-bold"}>
                                {isClear ? "Fee Fully Cleared" : `Pending: ₹${balance}`}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleDeleteStudent(stu.id)}
                              className="text-red-400 hover:text-white hover:bg-red-950 p-1.5 rounded transition-all cursor-pointer"
                              title="Delete Student Profile"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- 2. ATTENDANCE TRACKER --- */}
        {activeTab === "attendance" && (
          <div className="space-y-4" id="erp-attendance-panel">
            <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">उपस्थिती दिनांक (Attendance Date)</label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5"> तुकडी / बॅच निवडा (Select Batch / Level)</label>
                <select
                  value={attendanceLevel}
                  onChange={(e) => setAttendanceLevel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <optgroup label="School Standard">
                    {COURSES.school.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Competitive Exams">
                    {COURSES.competitive.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <button
                onClick={handleInitAttendanceMap}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500 hover:text-amber-400 text-slate-300 font-bold text-xs py-2 rounded-lg cursor-pointer transition-all"
              >
                Load Student Roster
              </button>
            </div>

            {attendanceSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-2.5 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {attendanceSuccess}
              </div>
            )}

            {/* Attendance List */}
            <div className="border border-slate-800 rounded-xl bg-slate-950 overflow-hidden">
              <div className="p-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-400 font-bold uppercase">
                  Batch: {attendanceLevel} — ({Object.keys(attendanceMap).length} Students Loaded)
                </span>
                <button
                  onClick={handleSaveAttendance}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Save Attendance Sheet
                </button>
              </div>

              <div className="divide-y divide-slate-900">
                {Object.keys(attendanceMap).length === 0 ? (
                  <p className="p-8 text-center text-slate-500 text-xs">
                    Please click "Load Student Roster" to view and check attendance logs for {attendanceLevel}.
                  </p>
                ) : (
                  students
                    .filter((s) => s.standard === attendanceLevel)
                    .map((s) => {
                      const isPresent = attendanceMap[s.id] === "Present";
                      return (
                        <div key={s.id} className="p-4 flex justify-between items-center hover:bg-slate-900/40 text-xs">
                          <div>
                            <strong className="text-white font-semibold text-sm">{s.name}</strong>
                            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">ID: {s.id}</span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleToggleAttendance(s.id)}
                              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                                isPresent
                                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-md shadow-emerald-900/10"
                                  : "bg-red-500/10 border-red-500/20 text-red-400"
                              }`}
                            >
                              {isPresent ? "✓ Present" : "✗ Absent"}
                            </button>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- 3. FEE RECEIPTING & PORTAL --- */}
        {activeTab === "fees" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="erp-fees-panel">
            {/* Payment capture form */}
            <form onSubmit={handlePayFees} className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5 uppercase tracking-wide border-b border-slate-900 pb-3">
                <CreditCard className="w-4 h-4 text-amber-500" /> Record Fee Collection Payment
              </h3>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">निवडा विद्यार्थी (Select Student)*</label>
                <select
                  required
                  value={selectedStudentId}
                  onChange={(e) => {
                    setSelectedStudentId(e.target.value);
                    setPaymentSuccessReceipt(null);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="">-- Choose student --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.standard}) — Pending: ₹{s.totalFees - s.paidFees}
                    </option>
                  ))}
                </select>
              </div>

              {selectedStudentId && (
                (() => {
                  const student = students.find((s) => s.id === selectedStudentId);
                  if (!student) return null;
                  const balance = student.totalFees - student.paidFees;
                  return (
                    <div className="bg-slate-900/50 p-4 border border-slate-800/40 rounded-lg text-xs grid grid-cols-3 gap-2">
                      <div className="text-center border-r border-slate-800">
                        <span className="text-slate-500 block uppercase text-[9px] font-bold">Total Fees</span>
                        <strong className="text-white text-sm">₹{student.totalFees}</strong>
                      </div>
                      <div className="text-center border-r border-slate-800">
                        <span className="text-slate-500 block uppercase text-[9px] font-bold">Paid So Far</span>
                        <strong className="text-emerald-400 text-sm">₹{student.paidFees}</strong>
                      </div>
                      <div className="text-center">
                        <span className="text-slate-500 block uppercase text-[9px] font-bold">Balance Due</span>
                        <strong className="text-amber-500 text-sm">₹{balance}</strong>
                      </div>
                    </div>
                  );
                })()
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">जमा रक्कम (Payment Amount in ₹)*</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">पेमेंट मार्ग (Payment Mode)*</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Cash">Cash (रोख)</option>
                    <option value="PhonePe">PhonePe</option>
                    <option value="Google Pay">Google Pay</option>
                    <option value="BHIM UPI">BHIM UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">जमा करणारे अधिकारी (Received By Signature)*</label>
                <input
                  type="text"
                  required
                  value={receivedBy}
                  onChange={(e) => setReceivedBy(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold py-2.5 rounded-lg text-xs cursor-pointer shadow-lg hover:from-red-500 hover:to-amber-500"
              >
                शुल्क जमा करा (Log Fee Collection)
              </button>
            </form>

            {/* Print receipt side */}
            <div className="flex flex-col justify-between bg-slate-950 p-6 rounded-xl border border-slate-800">
              {paymentSuccessReceipt ? (
                <div className="space-y-4">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Payment captured successfully.
                  </div>

                  <div id="receipt-print-area" className="bg-white text-slate-900 p-6 rounded-lg border border-slate-300 font-sans shadow-lg text-xs">
                    {/* Invoice header */}
                    <div className="text-center border-b border-slate-300 pb-3">
                      <h4 className="text-lg font-black tracking-tight text-slate-950">SAMARTH ACADEMY</h4>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">ज्ञान हेच सामर्थ्य</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">Sinchan Nagar, Parbhani | Call: 9511668617</p>
                      <span className="bg-slate-900 text-white py-0.5 px-3 rounded text-[9px] uppercase font-bold mt-2 inline-block">
                        अधिकृत पावती (OFFICIAL FEE PAYMENT RECEIPT)
                      </span>
                    </div>

                    {/* Receipt specifics */}
                    <div className="mt-3 grid grid-cols-2 gap-y-1.5 border-b border-slate-100 pb-3 font-medium">
                      <div>
                        <span className="text-[9px] text-slate-500 block uppercase">Receipt No:</span>
                        <strong className="text-slate-950 font-mono font-bold">{paymentSuccessReceipt.id}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 block uppercase">Payment Date:</span>
                        <strong className="text-slate-950 font-mono">{paymentSuccessReceipt.date}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 block uppercase">Student Name:</span>
                        <strong className="text-slate-950 font-bold">{paymentSuccessReceipt.studentName}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 block uppercase">Student ID:</span>
                        <strong className="text-red-800 font-mono font-bold">{paymentSuccessReceipt.studentId}</strong>
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="mt-4 bg-slate-50 p-3 rounded border border-slate-100 space-y-1">
                      <div className="flex justify-between font-bold text-slate-700">
                        <span>Description</span>
                        <span>Amount (₹)</span>
                      </div>
                      <div className="flex justify-between font-extrabold text-slate-950 text-sm mt-1 border-b border-slate-200 pb-1">
                        <span>Coaching Tuition Installment ({paymentSuccessReceipt.mode})</span>
                        <span>₹{paymentSuccessReceipt.amount.toLocaleString()}</span>
                      </div>
                      
                      {(() => {
                        const s = students.find((x) => x.id === paymentSuccessReceipt.studentId);
                        if (!s) return null;
                        return (
                          <div className="text-[9px] text-slate-500 flex justify-between pt-1 font-semibold">
                            <span>Outstanding Balance:</span>
                            <span className="text-amber-700 font-bold">₹{(s.totalFees - s.paidFees).toLocaleString()}</span>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Signoff */}
                    <div className="mt-6 flex justify-between items-end">
                      <span className="text-[9px] text-slate-400">Computer Generated Invoice</span>
                      <div className="text-center">
                        <p className="text-slate-900 font-serif font-bold italic">P. R. Ingole</p>
                        <span className="text-[9px] text-slate-500 block uppercase font-bold border-t border-slate-300 mt-1 pt-0.5">Authorized Sign</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={printReceipt}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> Print Receipt PDF
                  </button>
                </div>
              ) : (
                <div className="h-full flex flex-col justify-center items-center text-center text-slate-500 space-y-2 py-8">
                  <Printer className="w-10 h-10 text-slate-700" />
                  <p className="text-xs">Once a fee payment is saved to the ledger, an official print invoice will populate here.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- 4. REPORTS TAB --- */}
        {activeTab === "reports" && (
          <div className="space-y-6" id="erp-reports-panel">
            {/* Quick counters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Admitted Students</p>
                  <p className="text-2xl font-extrabold text-white mt-1">{totalStudents}</p>
                </div>
                <Users className="w-9 h-9 text-blue-500" />
              </div>

              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total Collections</p>
                  <p className="text-2xl font-extrabold text-emerald-400 mt-1">₹{totalCollected.toLocaleString()}</p>
                </div>
                <IndianRupee className="w-9 h-9 text-emerald-400" />
              </div>

              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Outstanding Receivables</p>
                  <p className="text-2xl font-extrabold text-amber-500 mt-1">₹{totalPending.toLocaleString()}</p>
                </div>
                <AlertTriangle className="w-9 h-9 text-amber-500" />
              </div>
            </div>

            {/* Recent Payments logs */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
              <div className="p-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-300 font-bold uppercase">Recent Fee Transactions Ledger</span>
                <span className="text-slate-500 font-mono">Total {feeLogs.length} Records</span>
              </div>

              <div className="divide-y divide-slate-900 text-xs">
                {feeLogs.length === 0 ? (
                  <p className="p-8 text-center text-slate-500">No recent transaction records logged.</p>
                ) : (
                  feeLogs.map((log) => (
                    <div key={log.id} className="p-3.5 flex justify-between items-center hover:bg-slate-900/50">
                      <div>
                        <strong className="text-white text-sm">₹{log.amount}</strong>
                        <span className="text-slate-500 text-[10px] font-mono ml-2">({log.mode})</span>
                        <p className="text-slate-400 text-xs mt-0.5">Received from {log.studentName} (ID: {log.studentId})</p>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-slate-500 block">{log.date}</span>
                        <span className="text-[10px] text-amber-400 font-semibold block mt-0.5">Recv by: {log.receivedBy}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- 5. LOGINS & ROSTER MONITOR --- */}
        {activeTab === "logins" && (
          <div className="space-y-6" id="erp-logins-panel">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950 p-4 border border-slate-800 rounded-xl">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-amber-500" />
                  लॉगिन ट्रॅकर व अकॅडमी विद्यार्थी (Realtime Logins & Saved Roster)
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Monitor when students log into Samarth Academy via Code, Google or Email. Details are stored permanently on the server.
                </p>
              </div>
              <button
                onClick={handleClearLoginHistory}
                className="bg-red-950 hover:bg-red-900 text-red-300 border border-red-800/50 hover:border-red-500 text-[11px] font-bold py-1.5 px-3 rounded-lg cursor-pointer transition-colors shrink-0"
              >
                Clear History Logs
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Realtime Login History */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                <div className="p-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                    थेट लॉगिन प्रविष्ट्या (Live Login History Logs)
                  </span>
                  <button
                    onClick={fetchLoginHistory}
                    className="text-[10px] text-slate-400 hover:text-white font-bold underline"
                    disabled={historyLoading}
                  >
                    {historyLoading ? "Refreshing..." : "🔄 Refresh"}
                  </button>
                </div>

                <div className="p-4 flex-1 space-y-2 max-h-[480px] overflow-y-auto">
                  {loginHistory.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 text-xs">
                      No student login activity recorded yet. Student logins will automatically save here.
                    </div>
                  ) : (
                    loginHistory.map((log: any) => {
                      const dateObj = new Date(log.timestamp);
                      const displayTime = dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString();
                      return (
                        <div key={log.id} className="p-3 bg-slate-900/50 border border-slate-800/60 rounded-xl flex items-center justify-between hover:bg-slate-900 transition-colors">
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                              {log.studentName}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              Student ID: <span className="text-red-400 font-bold">{log.studentId}</span> • Role: <span className="uppercase text-slate-500 font-black">{log.role}</span>
                            </p>
                          </div>
                          <div className="text-right space-y-1">
                            <span className="text-[9px] bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded font-black uppercase">
                              {log.method === "google" ? "🌐 Google" : log.method === "email" ? "✉️ Email" : "🔑 Code"}
                            </span>
                            <p className="text-[9px] text-slate-500 font-mono flex items-center justify-end gap-1">
                              <span className="w-2 h-2 border border-slate-700 rounded-full shrink-0 animate-pulse bg-emerald-500/20"></span>
                              {displayTime}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Column: Permanent Registered Students List */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                <div className="p-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-bold uppercase tracking-wider">
                    अकॅडमीतील एकूण विद्यार्थी (Saved Academic Roster)
                  </span>
                  <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono px-2 py-0.5 rounded font-bold">
                    {totalStudents} Active Students
                  </span>
                </div>

                <div className="p-4 flex-1 space-y-2.5 max-h-[480px] overflow-y-auto">
                  {students.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 text-xs">
                      No students admitted yet. Register students via Roster or Admission Form.
                    </div>
                  ) : (
                    students.map((stu) => (
                      <div key={stu.id} className="p-3 bg-slate-900/40 border border-slate-850 rounded-xl flex items-center justify-between hover:border-slate-700 transition-all">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-white">{stu.name}</p>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-slate-500">
                            <span className="font-mono text-red-400 font-bold">{stu.id}</span>
                            <span>•</span>
                            <span>Std: <span className="text-amber-500 font-semibold">{stu.standard}</span></span>
                            <span>•</span>
                            <span>Phone: <span className="font-mono text-slate-400">{stu.phone || "N/A"}</span></span>
                          </div>
                        </div>
                        <div className="text-right space-y-1 font-mono">
                          <span className="text-[10px] text-emerald-400 font-bold block">
                            Paid: ₹{stu.paidFees}
                          </span>
                          <span className="text-[9px] bg-slate-800 border border-slate-750 text-slate-400 py-0.5 px-2 rounded block text-center">
                            Code: {stu.loginCode}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- 6. PAYMENT QR CODE MANAGEMENT --- */}
        {activeTab === "qrCode" && (
          <div className="space-y-6" id="erp-qrcode-panel">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-amber-500" />
                पेमेंट QR कोड व्यवस्थापन (Payment QR Management)
              </h3>
              <p className="text-xs text-slate-400 mt-1 uppercase">
                Manage the UPI QR Code displayed to Students and Parents for online fee payments
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Side: Upload & Controls */}
              <div className="lg:col-span-7 bg-slate-950/40 border border-slate-850 p-6 rounded-xl space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                    QR कोड अपलोड करा (Upload / Replace QR)
                  </h4>
                  <p className="text-xs text-slate-400 leading-normal">
                    Please upload the official UPI Merchant QR Code image from your device. This QR code will be instantly visible to all students and parents in the "Pay Fees" center.
                  </p>

                  {/* File Upload Selector Zone */}
                  <div className="space-y-3">
                    <div className="border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-xl p-6 transition-all bg-slate-950/60 flex flex-col items-center justify-center text-center gap-3 relative group">
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        id="qr-file-input"
                      />
                      <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 group-hover:bg-amber-500/10 group-hover:border-amber-500/20 transition-all">
                        <Upload className="w-5 h-5 text-slate-400 group-hover:text-amber-500 transition-all" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-300">
                          {selectedFile ? selectedFile.name : "फोटो निवडण्यासाठी येथे क्लिक करा किंवा ड्रॅग करा"}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Supports: PNG, JPG, JPEG, WEBP (Max: 5 MB)
                        </p>
                      </div>
                    </div>

                    {qrError && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs font-semibold">
                        ⚠️ {qrError}
                      </div>
                    )}
                  </div>

                  {/* Selected QR Preview */}
                  {qrPreview && (
                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-center gap-4">
                      <div className="shrink-0 bg-white p-2 rounded-lg border border-slate-700">
                        <img
                          src={qrPreview}
                          alt="QR Code Preview"
                          className="w-24 h-24 object-contain"
                        />
                      </div>
                      <div className="space-y-2 text-xs text-slate-300 w-full">
                        <div>
                          <p className="font-bold text-white uppercase text-[10px] tracking-wider text-slate-500 font-sans">निवडलेला फोटो (Selected Preview):</p>
                          <p className="font-semibold truncate max-w-xs mt-0.5">{selectedFile?.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">Size: {selectedFile ? (selectedFile.size / 1024).toFixed(1) + " KB" : ""}</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleUploadQr}
                          disabled={uploadLoading}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 text-xs shadow-md"
                          id="btn-save-uploaded-qr"
                        >
                          {uploadLoading ? (
                            <>
                              <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                              जतन होत आहे (Saving...)
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              QR कोड जतन करा (Save QR Code)
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Upload Success Details Banner */}
                  {uploadSuccess && activeQr && (
                    <div className="bg-emerald-500/10 border-2 border-emerald-500/20 p-4 rounded-xl space-y-2.5 text-xs text-emerald-300">
                      <div className="flex items-center gap-2 text-emerald-400 font-black">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>✅ Upload Successful (QR कोड अपलोड यशस्वी झाला)</span>
                      </div>
                      <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 pt-1.5 border-t border-emerald-500/10 font-medium">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-500 block leading-none">Upload Date:</span>
                          <span className="text-white text-[11px] font-mono">{activeQr.uploadDate ? new Date(activeQr.uploadDate).toLocaleString("en-IN") : "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-500 block leading-none">Uploaded By:</span>
                          <span className="text-white text-[11px] font-semibold">{activeQr.uploadedBy || "Pratibha Rajesh Ingole"}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-500 block leading-none">File Size:</span>
                          <span className="text-white text-[11px] font-mono">{activeQr.fileSize || "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-500 block leading-none">File Name:</span>
                          <span className="text-white text-[11px] truncate max-w-[120px] block font-mono">{activeQr.fileName || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 text-[11px] text-slate-400 leading-normal space-y-2 mt-4">
                  <span className="text-amber-500 font-bold uppercase block tracking-wider">⚠️ Security Notice:</span>
                  <p>
                    Only authorized Admins (Founding Director Pratibha R. Ingole) can upload, delete, or replace this QR code. Teachers, students, and parents have read-only permissions and can only view this QR in order to make secure payments. No developer coding is required to modify this QR image.
                  </p>
                </div>
              </div>

              {/* Right Side: Active QR Status & Preview */}
              <div className="lg:col-span-5 bg-slate-950/40 border border-slate-850 p-6 rounded-xl flex flex-col items-center justify-between text-center min-h-[400px]">
                <div className="w-full space-y-4">
                  <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider block">
                    सध्याचा सक्रिय QR (Active QR Status)
                  </h4>

                  {/* QR Box */}
                  <div className="flex flex-col items-center justify-center p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3.5 shadow-inner">
                    {activeQr ? (
                      <>
                        <div className="bg-white p-2.5 rounded-2xl shadow-xl border border-slate-755">
                          <img
                            src={activeQr.image}
                            alt="Active UPI QR Code"
                            className="w-48 h-48 object-contain rounded-xl"
                          />
                        </div>
                        <div className="text-xs space-y-1">
                          <p className="font-extrabold text-amber-500 uppercase tracking-wider text-[10px]">सक्रिय कस्टम QR कोड (Active Custom QR)</p>
                          <p className="text-[10px] text-slate-400 font-mono">Uploaded: {new Date(activeQr.uploadDate).toLocaleDateString("en-IN")}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-48 h-48 bg-slate-950/80 rounded-2xl border border-slate-850 flex flex-col items-center justify-center gap-2">
                          <QrCode className="w-12 h-12 text-slate-600 animate-pulse" />
                          <span className="text-[10px] text-slate-500 uppercase font-black">Default QR Code Active</span>
                        </div>
                        <div className="text-xs text-slate-400 leading-normal max-w-xs">
                          <p className="font-semibold text-white text-[11px] text-amber-500 uppercase tracking-wider">अकॅडमी डीफॉल्ट QR कोड चालू आहे</p>
                          <p className="text-[10px] text-slate-400 mt-1">
                            No custom QR has been uploaded yet. The system is currently displaying the default merchant QR image to payers.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="w-full pt-6 border-t border-slate-850 flex flex-col gap-2.5">
                  {activeQr ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          const win = window.open();
                          if (win) {
                            win.document.write(`<iframe src="${activeQr.image}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                          } else {
                            alert("Allow popups to view full-size preview.");
                          }
                        }}
                        className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                        id="btn-preview-qr-full"
                      >
                        <Search className="w-3.5 h-3.5 text-amber-500" />
                        QR कोड पाहा (Preview QR Code)
                      </button>

                      <button
                        type="button"
                        onClick={handleDeleteQr}
                        className="w-full py-2.5 px-4 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                        id="btn-delete-active-qr"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        QR कोड हटवा (Delete QR Code)
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full py-2.5 px-4 bg-slate-900 text-slate-500 border border-slate-850 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 opacity-40 cursor-not-allowed"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      QR कोड हटवा (Delete QR)
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
