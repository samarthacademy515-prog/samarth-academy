import React, { useState } from "react";
import { UserPlus, Sparkles, CheckCircle2, DollarSign, Printer, BookOpen, MapPin, Award, MessageCircle } from "lucide-react";
import { COURSES } from "../data";
import { Student } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface AdmissionFormProps {
  onAdmissionSuccess: (newStudent: Student) => void;
}

export default function AdmissionForm({ onAdmissionSuccess }: AdmissionFormProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    section: "School Section" as "School Section" | "Competitive Exams",
    standard: "10th Standard",
    parentName: "",
    phone: "",
    address: "Sinchan Nagar, Parbhani",
    totalFees: 15000
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [latestAdmitted, setLatestAdmitted] = useState<Student | null>(null);

  // Auto fee recommendation based on choice
  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    let computedFee = 15000;
    
    // Auto detect section based on standards
    const isSchool = COURSES.school.some(s => s.name === val);
    const section = isSchool ? "School Section" : "Competitive Exams";

    if (val.includes("MPSC")) computedFee = 22000;
    else if (val.includes("Navodaya")) computedFee = 12000;
    else if (val.includes("Scholarship")) computedFee = 8000;
    else if (val.includes("NMMS")) computedFee = 6000;
    else if (val.includes("Police")) computedFee = 18000;
    else if (val.includes("Talathi") || val.includes("Saral")) computedFee = 14000;
    else if (val.includes("10th")) computedFee = 15000;
    else computedFee = 10000;

    setFormData((prev) => ({
      ...prev,
      standard: val,
      section,
      totalFees: computedFee
    }));
  };

  const getWhatsAppUrl = (student: Student) => {
    const msg = `*🆕 NEW STUDENT ADMISSION - SAMARTH ACADEMY*
--------------------------------------------------
*Student ID:* ${student.id}
*Student Name:* ${student.name}
*Course/Standard:* ${student.standard}
*Section:* ${student.section}
*Parent's Name:* ${student.parentName}
*Contact Number:* ${student.phone}
*Address:* ${student.address}
*Tuition Fee:* ₹${student.totalFees.toLocaleString()}
--------------------------------------------------
Admission details generated at Samarth Academy Portal. Contact: 9511668617`;
    return `https://api.whatsapp.com/send?phone=919511668617&text=${encodeURIComponent(msg)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.parentName || !formData.phone) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setSuccessMessage(null);
    setLatestAdmitted(null);

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Failed to register student.");
      }

      const registered: Student = await response.json();
      setLatestAdmitted(registered);
      setSuccessMessage(`Congratulations! ${registered.name} is successfully admitted to Samarth Academy.`);
      onAdmissionSuccess(registered);
      
      // Auto trigger sending details to WhatsApp
      try {
        window.open(getWhatsAppUrl(registered), "_blank");
      } catch (e) {
        console.warn("Pop-up blocked:", e);
      }
      
      // Reset form but keep address
      setFormData({
        name: "",
        section: "School Section",
        standard: "10th Standard",
        parentName: "",
        phone: "",
        address: "Sinchan Nagar, Parbhani",
        totalFees: 15000
      });
    } catch (err: any) {
      alert(err.message || "Something went wrong during admission.");
    } finally {
      setLoading(false);
    }
  };

  const printReceipt = () => {
    const printContent = document.getElementById("admission-receipt-print");
    if (!printContent) return;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Quick restore state
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden" id="admission-form-wrapper">
      <div className="p-6 bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <UserPlus className="w-5.5 h-5.5 text-amber-500" />
          {t("form.title")}
        </h2>
        <p className="text-slate-400 text-xs mt-1">
          {t("form.sub")}
        </p>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form panel */}
        <form onSubmit={handleSubmit} className="space-y-4" id="admission-main-form">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              {t("form.name")} *
            </label>
            <input
              type="text"
              required
              placeholder="E.g. Omkar Ramesh Chavan"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {t("form.standard")} *
              </label>
              <select
                value={formData.standard}
                onChange={handleLevelChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                <optgroup label="School Standard (4th to 10th)">
                  {COURSES.school.map((s) => (
                    <option key={s.id} value={s.name}>{s.name} (All Subjects)</option>
                  ))}
                </optgroup>
                <optgroup label="Competitive Government Exams">
                  {COURSES.competitive.map((c) => (
                    <option key={c.id} value={c.name}>{c.name} — {c.description}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {t("form.section")}
              </label>
              <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-amber-400 font-medium">
                {formData.section}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {t("form.parent")} *
              </label>
              <input
                type="text"
                required
                placeholder="E.g. Rajesh Chavan"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {t("form.phone")} *
              </label>
              <input
                type="tel"
                required
                pattern="[0-9]{10}"
                placeholder="10-digit mobile number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              {t("form.address")} *
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex justify-between">
              <span>वार्षिक फी (Course Tuition Fee in ₹)</span>
              <span className="text-amber-500 font-mono font-bold">Recommended: Customisable</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-2.5 text-slate-500 text-sm font-semibold">₹</span>
              <input
                type="number"
                value={formData.totalFees}
                onChange={(e) => setFormData({ ...formData, totalFees: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            id="btn-admission-submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-red-900/20 hover:from-red-500 hover:to-amber-500 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-200" />
                {t("form.submit")}
              </>
            )}
          </button>
        </form>

        {/* Live confirmation and receipt viewer */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between" id="admission-receipt-panel">
          {successMessage ? (
            <div className="space-y-6">
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                <div>
                  <p className="text-sm font-bold">नोंदणी यशस्वी झाली! (Registration Successful)</p>
                  <p className="text-xs text-slate-300 mt-0.5">{successMessage}</p>
                </div>
              </div>

              {latestAdmitted && (
                <div className="bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 p-4.5 rounded-2xl space-y-2 mt-2">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0 animate-pulse" />
                    <strong className="text-xs font-black uppercase tracking-wider text-emerald-400">
                      स्वयंचलित WhatsApp संदेश पाठवला गेला! (Auto WhatsApp Dispatched)
                    </strong>
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-[11px] font-sans text-slate-300 leading-relaxed w-full">
                    <p className="text-[10px] uppercase font-bold text-slate-500">मोबाईल नंबर (Mobile):</p>
                    <p className="font-mono text-white mb-2">{latestAdmitted.phone}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-500">संदेश मजकूर (Guidance Message Payload):</p>
                    <p className="italic bg-slate-900/60 p-2.5 rounded border border-slate-800 mt-1 whitespace-pre-wrap leading-relaxed text-slate-200">
                      प्रिय {latestAdmitted.name}, आपले समर्थ अकॅडमी मध्ये स्वागत आहे! आपला ७-अंकी सुरक्षित लॉगिन कोड आहे: *{(latestAdmitted as any).loginCode || "-------"}*. हा कोड वापरून आपण https://samarth-academy.in वर Student किंवा Parent म्हणून लॉगिन करू शकता. डिजिटल अभ्यासक्रम (LMS), थेट वर्ग (Whiteboard) आणि साप्ताहिक प्रगती पाहण्यासाठी हा कोड नेहमी वापरावा. - समर्थ अकॅडमी, परभणी.
                    </p>
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-800 text-[10px] font-bold">
                      <span className="text-slate-400">वितरण स्थिती (Gateway Status):</span>
                      <span className="text-emerald-400 flex items-center gap-1">● यशस्वीरित्या वितरित (Delivered ✔)</span>
                    </div>
                  </div>
                </div>
              )}

              {latestAdmitted && (
                <div id="admission-receipt-print" className="bg-white text-slate-900 p-6 rounded-xl shadow-2xl border border-slate-200 font-sans">
                  {/* Receipt Header */}
                  <div className="text-center border-b-2 border-slate-900 pb-4">
                    <h3 className="text-xl font-extrabold text-slate-950">SAMARTH ACADEMY</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold font-mono">ज्ञान हेच सामर्थ्य</p>
                    <p className="text-xs text-slate-700 mt-1">Sinchan Nagar, Parbhani, MH - 9511668617</p>
                    <p className="text-xs text-slate-900 font-bold mt-1 bg-amber-100 py-1 rounded inline-block px-3">
                      प्रवेश पत्र (ADMISSION LETTER & FEE INVOICE)
                    </p>
                  </div>

                  {/* Receipt Details */}
                  <div className="mt-4 grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                    <div>
                      <span className="text-slate-500 block uppercase text-[9px] font-bold">Student Name</span>
                      <strong className="text-slate-950 font-bold">{latestAdmitted.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block uppercase text-[9px] font-bold">Student ID</span>
                      <strong className="text-red-700 font-mono font-bold">{latestAdmitted.id}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block uppercase text-[9px] font-bold">Standard / Batch</span>
                      <strong className="text-slate-950 font-bold">{latestAdmitted.standard}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block uppercase text-[9px] font-bold">Section</span>
                      <strong className="text-slate-950 font-bold">{latestAdmitted.section}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block uppercase text-[9px] font-bold">Parent Name</span>
                      <strong className="text-slate-950 font-bold">{latestAdmitted.parentName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block uppercase text-[9px] font-bold">Mobile Number</span>
                      <strong className="text-slate-950 font-mono font-bold">{latestAdmitted.phone}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500 block uppercase text-[9px] font-bold">Address</span>
                      <strong className="text-slate-950 font-bold">{latestAdmitted.address}</strong>
                    </div>

                    <div className="col-span-2 bg-amber-50 border border-amber-200 p-2.5 rounded-lg mt-3 text-center">
                      <span className="text-amber-800 block uppercase text-[10px] font-extrabold tracking-wider">🔑 विद्यार्थी लॉगिन कोड (Student Login Code)</span>
                      <strong className="text-amber-950 font-mono text-lg font-black tracking-widest block mt-0.5">
                        {(latestAdmitted as any).loginCode || "-------"}
                      </strong>
                      <span className="text-[10px] text-slate-600 block mt-1 leading-normal font-medium">
                        हा ७-अंकी सुरक्षित लॉगिन कोड आहे. या कोडचा वापर करून आपण Student किंवा Parent म्हणून वेबसाईटवर ऑनलाईन लॉगिन करू शकता.
                      </span>
                    </div>
                  </div>

                  {/* Fee Summary Table */}
                  <div className="mt-6 border-t border-b border-slate-300 py-3">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Course Description</span>
                      <span>Total Tuition</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-950 mt-1">
                      <span>Annual Training Package - {latestAdmitted.standard}</span>
                      <span>₹{latestAdmitted.totalFees.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="mt-8 flex justify-between items-end">
                    <div className="text-center">
                      <div className="w-24 border-b border-slate-400 mx-auto"></div>
                      <span className="text-[9px] text-slate-500 uppercase font-bold mt-1 block">Student Sign</span>
                    </div>
                    <div className="text-center">
                      <p className="text-red-800 font-serif font-bold italic text-xs leading-none">P. R. Ingole</p>
                      <span className="text-[10px] text-slate-800 font-bold block mt-1">Pratibha R. Ingole</span>
                      <span className="text-[9px] text-slate-500 uppercase font-bold block">Director, Samarth Academy</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-end items-stretch sm:items-center">
                {latestAdmitted && (
                  <a
                    href={getWhatsAppUrl(latestAdmitted)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/35 transition-colors"
                    id="whatsapp-share-receipt-btn"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-100" /> WhatsApp वर पाठवा (Send Form)
                  </a>
                )}
                <button
                  onClick={printReceipt}
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Print Admission
                </button>
                <button
                  onClick={() => { setSuccessMessage(null); setLatestAdmitted(null); }}
                  className="bg-gradient-to-r from-red-600 to-amber-600 text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center justify-center"
                >
                  Admit Another Student
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  समर्थ ऍकॅडमी प्रवेश प्रक्रियेची वैशिष्ट्ये:
                </h3>
                <ul className="text-xs text-slate-400 space-y-2 mt-4">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                    परभणीतील उत्कृष्ट व अनुभवी शिक्षक मार्गदर्शक.
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                    स्पर्धा परीक्षा (MPSC, Talathi, ZP, Scholarship) विशेष तयारी.
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                    विद्यार्थ्यांच्या शंकांचे तत्पर निरसन (AI Doubt Solver).
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                    वैयक्तिक लक्ष व प्रगतीचा साप्ताहिक आढावा (LMS Tracker).
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                    डिजिटल क्लासरूम आणि ऑनलाईन सराव परीक्षांचे आयोजन.
                  </li>
                </ul>
              </div>

              {/* Dynamic Fee Promo Banner */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center space-y-1">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Selected Target Group</p>
                <p className="text-lg font-bold text-white tracking-tight">{formData.standard}</p>
                <p className="text-xs text-slate-400">Total estimated package for standard: <span className="text-amber-400 font-bold font-mono">₹{formData.totalFees}</span></p>
              </div>

              <div className="text-center text-[10px] text-slate-500">
                Contact Office: 9511668617 | Sinchan Nagar, Parbhani
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
