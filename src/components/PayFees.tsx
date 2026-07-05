import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Landmark, CreditCard, Coins, CheckCircle, ArrowRight, Printer, RefreshCw, QrCode, Search, FileText } from "lucide-react";
import { Student } from "../types";
import { useLanguage } from "../context/LanguageContext";
import payFeesQrImage from "../assets/images/pay_fees_qr_1782914359262.jpg";
import { API } from "../config";

interface PayFeesProps {
  students: Student[];
  currentUser: {
    role: "admin" | "teacher" | "student" | "parent" | "guest";
    name: string;
    studentId?: string;
    loginCode?: string;
  };
  onPaymentSuccess: () => void;
}

export default function PayFees({ students, currentUser, onPaymentSuccess }: PayFeesProps) {
  const { t } = useLanguage();
  
  // State variables
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [customStudentName, setCustomStudentName] = useState<string>("");
  const [selectedStandard, setSelectedStandard] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [paymentMode, setPaymentMode] = useState<"Cash" | "UPI">("UPI");
  const [utrNumber, setUtrNumber] = useState<string>("");
  const [receivedBy, setReceivedBy] = useState<string>("Pratibha R. Ingole");
  
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [successReceipt, setSuccessReceipt] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [customQr, setCustomQr] = useState<{
    image: string;
    fileName: string;
    fileSize: string;
    uploadedBy: string;
    uploadDate: string;
  } | null>(null);

  // Fetch custom QR Code from server on mount
  useEffect(() => {
    const fetchQr = async () => {
      try {
        const response = await fetch(`${API}/api/qr`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.image) {
            setCustomQr(data);
          }
        }
      } catch (err) {
        console.error("Error fetching payment QR code:", err);
      }
    };
    fetchQr();
  }, []);

  // Initialize for Logged-In Student or Parent
  useEffect(() => {
    if (currentUser.role === "student" || currentUser.role === "parent") {
      const stuId = currentUser.studentId;
      if (stuId) {
        const found = students.find(s => s.id === stuId);
        if (found) {
          setSelectedStudent(found);
          setSelectedStudentId(found.id);
          setCustomStudentName(found.name);
          setSelectedStandard(found.standard);
        }
      }
    }
  }, [currentUser, students]);

  // Filter students for admin/teacher lookup
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStudents([]);
    } else {
      const q = searchQuery.toLowerCase();
      const filtered = students.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.standard.toLowerCase().includes(q)
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setSelectedStudentId(student.id);
    setCustomStudentName(student.name);
    setSelectedStandard(student.standard);
    setSearchQuery("");
    setFilteredStudents([]);
    setErrorMsg(null);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedStudentId) {
      setErrorMsg("कृपया विद्यार्थी निवडा. (Please select a student)");
      return;
    }

    const payAmount = parseFloat(amount);
    if (isNaN(payAmount) || payAmount <= 0) {
      setErrorMsg("कृपया वैध रक्कम प्रविष्ट करा. (Please enter a valid amount)");
      return;
    }

    if (paymentMode === "UPI" && !utrNumber.trim()) {
      setErrorMsg("कृपया १२-अंकी UPI UTR / संदर्भ क्रमांक प्रविष्ट करा. (Please enter the 12-digit UPI UTR / Transaction reference number)");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        studentId: selectedStudentId,
        amount: payAmount,
        mode: paymentMode === "UPI" ? `UPI (UTR: ${utrNumber})` : "Cash",
        receivedBy: currentUser.role === "admin" ? currentUser.name : receivedBy
      };

      const response = await fetch(`${API}/api/fees/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "फी भरताना त्रुटी आली.");
      }

      setSuccessReceipt(data.receipt);
      onPaymentSuccess();
      
      // Update local state if we want to show updated balance
      if (selectedStudent) {
        setSelectedStudent({
          ...selectedStudent,
          paidFees: Number(selectedStudent.paidFees || 0) + payAmount
        });
      }

    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong during payment logging.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = () => {
    const printContent = document.getElementById("receipt-print-area");
    if (!printContent) return;

    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload to restore React bindings
  };

  const handleReset = () => {
    setSuccessReceipt(null);
    setAmount("");
    setUtrNumber("");
    if (currentUser.role === "admin" || currentUser.role === "teacher") {
      setSelectedStudent(null);
      setSelectedStudentId("");
      setCustomStudentName("");
      setSelectedStandard("");
    }
  };

  // Calculations for display
  const outstandingFees = selectedStudent ? selectedStudent.totalFees - selectedStudent.paidFees : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden" id="fee-payment-system">
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Landmark className="w-6 h-6 text-amber-500" />
            फी भरणे केंद्र (Fee Payment Center)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            समर्थ अकॅडमी प्रवेश फी किंवा मासिक वर्ग फी सुरक्षितपणे ऑनलाईन किंवा रोख जमा करा.
          </p>
        </div>
        {successReceipt && (
          <button 
            onClick={handleReset}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            नवीन पेमेंट करा (New Payment)
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!successReceipt ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left Column: Form Details */}
            <form onSubmit={handleSubmitPayment} className="lg:col-span-7 space-y-5" id="form-pay-fees">
              
              {/* Error Alert */}
              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-xs font-semibold leading-relaxed">
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Student Selection for Admin/Teacher */}
              {(currentUser.role === "admin" || currentUser.role === "teacher") ? (
                <div className="space-y-2">
                  <label className="text-xs font-extrabold uppercase tracking-widest text-slate-400 block">
                    विद्यार्थी शोधा (Search Student)
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="विद्यार्थ्याचे नाव किंवा आयडी प्रविष्ट करा..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                      id="input-student-search"
                    />
                  </div>

                  {filteredStudents.length > 0 && (
                    <div className="bg-slate-950 border border-slate-800 rounded-xl max-h-52 overflow-y-auto divide-y divide-slate-900 shadow-xl z-20 relative">
                      {filteredStudents.map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => handleSelectStudent(st)}
                          className="w-full px-4 py-3 text-left hover:bg-slate-900/60 transition flex items-center justify-between text-xs"
                        >
                          <div>
                            <strong className="text-white block font-semibold">{st.name}</strong>
                            <span className="text-slate-500 font-mono text-[10px]">{st.id} • {st.standard}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-amber-500 font-bold">बाकी: ₹{st.totalFees - st.paidFees}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedStudent && (
                    <div className="bg-amber-500/5 border border-amber-500/10 p-3.5 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500">निवडलेला विद्यार्थी (Selected Student):</span>
                        <strong className="text-white block text-sm mt-0.5">{selectedStudent.name}</strong>
                        <span className="text-[11px] text-slate-400 font-medium">{selectedStudent.standard}</span>
                      </div>
                      <div className="text-right border-l border-slate-800 pl-4">
                        <span className="text-[9px] uppercase font-bold text-slate-500 block leading-none">फी स्थिती (Balance):</span>
                        <strong className="text-amber-500 font-mono text-base block mt-1">₹{outstandingFees}</strong>
                        <span className="text-[9px] text-slate-400">एकूण: ₹{selectedStudent.totalFees} / जमा: ₹{selectedStudent.paidFees}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Static Details for Logged-In Student/Parent */
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-[9px] text-amber-500 font-bold uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                      विद्यार्थी खाते (Student Account)
                    </span>
                    <strong className="text-white block text-base font-bold mt-1.5">{customStudentName || currentUser.name}</strong>
                    <span className="text-xs text-slate-400">{selectedStandard || "Samarth Academy Scholar"}</span>
                  </div>
                  {selectedStudent && (
                    <div className="bg-slate-900 border border-slate-800/60 p-3 rounded-xl text-right shrink-0 w-full sm:w-auto">
                      <span className="text-[9px] uppercase font-bold text-slate-500 block leading-none">थकीत फी (Outstanding Fee):</span>
                      <strong className="text-red-400 font-mono text-lg block mt-1 leading-none">₹{outstandingFees}</strong>
                      <span className="text-[10px] text-slate-400 font-medium block mt-1">एकूण फी: ₹{selectedStudent.totalFees} | जमा: ₹{selectedStudent.paidFees}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Class/Batch (only shown if not selected yet or custom input needed) */}
              {(!selectedStudentId && (currentUser.role === "admin" || currentUser.role === "teacher")) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">विद्यार्थ्याचे नाव (Student Name)</label>
                    <input
                      type="text"
                      placeholder="विद्यार्थ्याचे नाव प्रविष्ट करा"
                      value={customStudentName}
                      onChange={(e) => setCustomStudentName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">वर्ग किंवा बॅच (Class / Batch)</label>
                    <input
                      type="text"
                      placeholder="उदा. 10th Standard / MPSC Group B"
                      value={selectedStandard}
                      onChange={(e) => setSelectedStandard(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Amount Section */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-widest text-slate-400 block" id="label-amount">
                  भरण्याची रक्कम (Fee Amount to Pay)
                </label>
                <div className="relative">
                  <span className="text-slate-400 font-black absolute left-4 top-3 text-lg">₹</span>
                  <input
                    type="number"
                    placeholder="उदा. 5000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-xl pl-8 pr-4 py-3 text-lg font-mono text-white focus:outline-none focus:border-amber-500 transition-colors font-extrabold"
                    required
                    id="input-fee-amount"
                  />
                </div>
                {selectedStudent && (
                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <span>* कमाल अनुमत रक्कम: ₹{outstandingFees}</span>
                    <button 
                      type="button" 
                      onClick={() => setAmount(outstandingFees.toString())} 
                      className="text-amber-500 font-bold hover:underline"
                    >
                      पूर्ण थकबाकी भरा (Pay Full Balance)
                    </button>
                  </div>
                )}
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-widest text-slate-400 block">
                  पेमेंट पर्याय निवडा (Choose Payment Mode)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMode("UPI")}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition cursor-pointer ${
                      paymentMode === "UPI"
                        ? "bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/5"
                        : "bg-slate-950 border-slate-800/80 text-slate-400 hover:border-slate-700"
                    }`}
                    id="btn-mode-upi"
                  >
                    <QrCode className="w-6 h-6 text-amber-500" />
                    <span className="text-xs font-bold block">ऑनलाईन UPI पेमेंट (Online UPI)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMode("Cash")}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition cursor-pointer ${
                      paymentMode === "Cash"
                        ? "bg-emerald-500/10 border-emerald-500 text-white shadow-lg shadow-emerald-500/5"
                        : "bg-slate-950 border-slate-800/80 text-slate-400 hover:border-slate-700"
                    }`}
                    id="btn-mode-cash"
                  >
                    <Coins className="w-6 h-6 text-emerald-500" />
                    <span className="text-xs font-bold block">कार्यालयात रोख देणे (Cash Office)</span>
                  </button>
                </div>
              </div>

              {/* Payment Mode Specific Instructions */}
              <AnimatePresence mode="wait">
                {paymentMode === "Cash" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-4 space-y-2.5 text-xs text-emerald-300 leading-relaxed"
                  >
                    <strong className="text-emerald-400 block font-bold">Office Cash Payment Instructions:</strong>
                    <p>
                      १. कृपया तुमची रक्कम <strong>₹{amount || "0"}</strong> घेऊन समर्थ अकॅडमी कार्यालयात या. <br />
                      २. कार्यालयात संचालक <strong>प्रतिभा राजेश इंगोले</strong> यांच्याकडे रोख रक्कम जमा करा. <br />
                      ३. जमा केल्यानंतर त्वरित डिजिटल आणि छापील पावती कार्यालयातून मिळवा.
                    </p>
                    {currentUser.role === "admin" && (
                      <div className="pt-2 border-t border-emerald-500/10">
                        <span className="text-[10px] text-emerald-400 font-bold block">Director Admin Verification:</span>
                        <p className="text-[10px] text-slate-400">Since you are logged in as Director, clicking "Submit" will immediately record and confirm this cash payment in the active fee register.</p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-4"
                  >
                    {/* UPI Transaction ID Input */}
                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                          UPI संदर्भ / UTR क्रमांक (UPI Transaction ID / UTR No.)
                        </label>
                        <input
                          type="text"
                          maxLength={12}
                          placeholder="उदा. 345678901234 (12-Digit)"
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9]/g, ""))}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                          id="input-utr-no"
                        />
                      </div>
                      <p className="text-[10px] text-slate-500 leading-normal">
                        * पेमेंट केल्यानंतर आपल्या PhonePe / GPay / Paytm च्या Transaction Details मधून १२-अंकी UTR किंवा Transaction ID कॉपी करून येथे प्रविष्ट करा.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-xl text-sm font-extrabold shadow-xl hover:shadow-amber-500/10 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                id="btn-pay-submit"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    माहिती पाठवली जात आहे... (Processing...)
                  </>
                ) : (
                  <>
                    {paymentMode === "UPI" ? <QrCode className="w-4 h-4" /> : <Coins className="w-4 h-4" />}
                    फी जमा नोंदवा (Submit Fee Register)
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

            {/* Right Column: Dynamic UPI QR Code & Pay Amount Display */}
            <div className="lg:col-span-5 flex flex-col justify-between" id="right-qr-display">
              {paymentMode === "UPI" ? (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-5 shadow-inner">
                  <div>
                    <span className="text-[9px] font-black uppercase bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full tracking-widest">
                      स्कॅन करून पेमेंट करा (Scan & Pay QR)
                    </span>
                    <p className="text-xs text-slate-400 mt-2 font-medium">खालील QR कोड कोणत्याही UPI ॲपद्वारे स्कॅन करा:</p>
                  </div>

                  {/* Dynamic Amount Board */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 w-full">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block leading-none">भरण्याची रक्कम (To Pay Amount):</span>
                    <strong className="text-2xl font-black text-amber-400 font-mono block mt-1.5">
                      ₹{amount ? Number(amount).toLocaleString("en-IN") : "0.00"}
                    </strong>
                  </div>

                  {/* QR Image Wrapper */}
                  <div className="relative p-2 bg-white rounded-2xl shadow-xl overflow-hidden group">
                    <img 
                      src={customQr ? customQr.image : payFeesQrImage} 
                      alt="UPI QR Code" 
                      className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-950/5 group-hover:bg-transparent transition duration-300 pointer-events-none"></div>
                  </div>

                  {/* Instructional Footer */}
                  <div className="space-y-1.5 text-xs text-slate-400 font-sans max-w-xs">
                    <p className="font-semibold text-white">Samarth Academy Merchant QR</p>
                    <p className="text-[10px] leading-relaxed">
                      आपला PhonePe, Google Pay, BHIM, किंवा Paytm चालू करा, हा QR कोड स्कॅन करा, आणि वरील रक्कम 
                      <span className="text-amber-400 font-bold"> ₹{amount || "0"}</span> अचूक पाठवा.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 min-h-[300px]">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center">
                    <Coins className="w-8 h-8 text-emerald-400 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-sm">कार्यालयीन रोख व्यवहार (Cash Transactions)</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mt-2 max-w-xs">
                      जर आपण कार्यालयात जाऊन रोख रक्कम देणार असाल, तर कृपया डाव्या बाजूच्या फॉर्ममध्ये रक्कम टाकून "फी जमा नोंदवा" बटणावर क्लिक करा.
                    </p>
                  </div>
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 w-full text-left text-[11px] text-slate-400 leading-normal">
                    <span className="text-amber-500 font-bold block mb-1">विशेष सूचना:</span>
                    अकॅडमी संचालक प्रतिभा राजेश इंगोले यांच्या प्रत्यक्ष मंजुरीशिवाय कार्यालयात रोख व्यवहार करू नये.
                  </div>
                </div>
              )}
            </div>

          </motion.div>
        ) : (
          /* Payment Success & Digital Receipt State */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
            id="success-receipt-card"
          >
            {/* Visual Success Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 animate-pulse">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-white">यशस्वी पेमेंट नोंद! (Payment Successfully Registered)</h3>
              <p className="text-xs text-slate-400">आपली फी पावती खालीलप्रमाणे तयार झाली आहे आणि रेकॉर्ड अद्ययावत केले गेले आहे.</p>
            </div>

            {/* Printable Area Wrapper */}
            <div id="receipt-print-area" className="bg-white text-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xl max-w-xl mx-auto font-sans leading-normal">
              
              {/* Receipt Header */}
              <div className="text-center border-b-2 border-slate-800 pb-4 relative">
                <h4 className="text-xl font-black uppercase tracking-tight text-slate-950">समर्थ अकॅडमी, परभणी</h4>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold mt-0.5">ज्ञान हेच सामर्थ्य • Estd. 2026</p>
                <span className="text-[9px] text-slate-400 block mt-1.5">Sinchan Nagar, Parbhani • Mo. 9511668617</span>
                <div className="absolute top-0 right-0 border border-slate-300 rounded px-2 py-0.5 text-[9px] font-mono font-bold text-emerald-600 bg-emerald-50 uppercase">
                  Verified ✔
                </div>
              </div>

              {/* Receipt Body Meta */}
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 py-4 text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-black block leading-none">पावती क्रमांक (Receipt ID):</span>
                  <strong className="text-slate-950 font-mono text-sm block mt-0.5">{successReceipt.id}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 uppercase font-black block leading-none">तारीख (Payment Date):</span>
                  <strong className="text-slate-950 font-mono text-sm block mt-0.5">{successReceipt.date}</strong>
                </div>

                <div className="col-span-2 border-t border-dashed border-slate-200 pt-3">
                  <span className="text-[9px] text-slate-400 uppercase font-black block leading-none">विद्यार्थ्याचे नाव (Student Name):</span>
                  <strong className="text-slate-950 text-base font-black block mt-0.5">{successReceipt.studentName}</strong>
                </div>

                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-black block leading-none">विद्यार्थी आयडी (Student ID):</span>
                  <strong className="text-slate-900 font-mono block mt-0.5">{successReceipt.studentId}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 uppercase font-black block leading-none">वर्ग/बॅच (Standard/Batch):</span>
                  <strong className="text-slate-900 block mt-0.5">{selectedStandard || "Scholar"}</strong>
                </div>
              </div>

              {/* Fee Breakdown Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden mt-2">
                <div className="bg-slate-50 grid grid-cols-12 px-3 py-1.5 border-b border-slate-200 text-[10px] uppercase font-black text-slate-500 tracking-wider">
                  <div className="col-span-8">तपशील (Particulars)</div>
                  <div className="col-span-4 text-right">रक्कम (Amount)</div>
                </div>
                <div className="grid grid-cols-12 px-3 py-2.5 text-xs font-semibold text-slate-800">
                  <div className="col-span-8">
                    <span>समर्थ अकॅडमी - शैक्षणिक फी जमा</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-normal">मार्ग (Mode): {successReceipt.mode}</span>
                  </div>
                  <div className="col-span-4 text-right text-slate-950 font-mono text-sm font-bold">₹{successReceipt.amount}.00</div>
                </div>
                <div className="bg-slate-50 border-t border-slate-200 grid grid-cols-12 px-3 py-2 text-xs font-bold text-slate-950">
                  <div className="col-span-8 text-right uppercase text-[9px] text-slate-500 pt-0.5">एकूण भरलेली रक्कम (Total Paid):</div>
                  <div className="col-span-4 text-right text-slate-950 font-mono text-base font-black">₹{successReceipt.amount}.00</div>
                </div>
              </div>

              {/* Outstanding Balance Info */}
              {selectedStudent && (
                <div className="bg-amber-50/50 border border-amber-100 p-2.5 rounded-xl mt-3 text-[10px] flex justify-between items-center text-amber-900 font-medium">
                  <span>* अद्ययावत थकबाकी (Outstanding Balance):</span>
                  <strong className="font-mono text-xs">₹{selectedStudent.totalFees - selectedStudent.paidFees}.00</strong>
                </div>
              )}

              {/* Receipt Sign-off */}
              <div className="flex justify-between items-end mt-6 pt-4 border-t border-dashed border-slate-200 text-[10px]">
                <div className="text-slate-500">
                  <p>स्वीकारले: <strong>{successReceipt.receivedBy}</strong></p>
                  <p className="text-[9px] mt-0.5 text-slate-400">समर्थ अकॅडमी डिजिटल रेकॉर्ड</p>
                </div>
                <div className="text-right">
                  <div className="inline-block w-24 border-b border-slate-900 text-center pb-1 text-slate-400">
                    Signature
                  </div>
                  <p className="mt-1 text-slate-500 font-bold">प्राधिकृत स्वाक्षरी (Auth Sign)</p>
                </div>
              </div>

              {/* Footer instruction */}
              <div className="text-center mt-6 text-[8px] text-slate-400 border-t border-slate-100 pt-3 uppercase tracking-wider">
                This is a computer-generated digital fee receipt from Samarth Academy Parbhani. No physical stamp is legally required.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={handlePrintReceipt}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 active:scale-95 cursor-pointer"
                id="btn-print-receipt"
              >
                <Printer className="w-4 h-4" />
                छापून घ्या (Print Receipt)
              </button>

              <button
                onClick={handleReset}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-2 active:scale-95 cursor-pointer"
                id="btn-payment-done"
              >
                <CheckCircle className="w-4 h-4" />
                मुख्य स्क्रीनवर जा (Back to Main Screen)
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
