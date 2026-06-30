import React, { useState } from "react";
import { Play, FileText, CheckCircle, Upload, Award, FileDown, ArrowRight, BookOpen, Clock, Calendar, MessageSquare, Video } from "lucide-react";
import { LMS_VIDEOS, STUDY_MATERIALS } from "../data";
import { Assignment } from "../types";

interface LMSViewerProps {
  assignments: Assignment[];
  userRole: string; // "admin" | "teacher" | "student" | "parent"
  onRefreshData: () => void;
}

export default function LMSViewer({ assignments, userRole, onRefreshData }: LMSViewerProps) {
  const [activeSubSection, setActiveSubSection] = useState<"videos" | "documents" | "assignments">("videos");
  
  // Video player states
  const [selectedVideo, setSelectedVideo] = useState(LMS_VIDEOS[0]);
  const [playbackSpeed, setPlaybackSpeed] = useState("1.0x");
  const [isPlaying, setIsPlaying] = useState(false);

  // Homework submission states
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [studentContent, setStudentContent] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Grading states
  const [selectedSubmission, setSelectedSubmission] = useState<{ assignmentId: string; studentId: string; studentName: string } | null>(null);
  const [gradingScore, setGradingScore] = useState("A+");
  const [gradingFeedback, setGradingFeedback] = useState("Excellent work! Keep it up.");

  // Submit Homework to server
  const handleHomeworkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignmentId || !studentContent.trim()) return;

    try {
      const response = await fetch(`/api/assignments/${selectedAssignmentId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: "STU-101", // Mocked active student (Omkar)
          studentName: "Omkar Rajesh Chavan",
          content: studentContent
        })
      });

      if (response.ok) {
        setSubmitSuccess("गृहपाठ यशस्वीरित्या सबमिट केला गेला आहे! (Homework submitted successfully!)");
        setStudentContent("");
        onRefreshData();
      } else {
        alert("Failed to submit homework.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Grading to server
  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    try {
      const response = await fetch(`/api/assignments/${selectedSubmission.assignmentId}/grade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedSubmission.studentId,
          grade: gradingScore,
          feedback: gradingFeedback
        })
      });

      if (response.ok) {
        alert("Grade and feedback saved successfully.");
        setSelectedSubmission(null);
        onRefreshData();
      } else {
        alert("Grading submission failed.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadDoc = (title: string) => {
    alert(`सुरक्षित डाउनलोड यशस्वी! '${title}' फाईल तुमच्या उपकरणावर जतन केली आहे. (Secure download successful! '${title}' file is saved to your device.)`);
  };

  const isTeacherOrAdmin = userRole === "admin" || userRole === "teacher";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl" id="lms-viewer-root">
      
      {/* Tab Selectors */}
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center flex-col md:flex-row gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-500" />
            समर्थ डिजिटल एलएमएस (Learning Management System)
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Access recorded video lectures, download PDFs & study notes, and submit homework assignments.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubSection("videos")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeSubSection === "videos" ? "bg-amber-500 text-slate-950" : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            <Video className="w-3.5 h-3.5 inline-block mr-1" /> व्हिडिओ व्याख्याने (Lectures)
          </button>
          <button
            onClick={() => setActiveSubSection("documents")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeSubSection === "documents" ? "bg-amber-500 text-slate-950" : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5 inline-block mr-1" /> अभ्यास साहित्य (Notes Vault)
          </button>
          <button
            onClick={() => { setActiveSubSection("assignments"); setSubmitSuccess(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeSubSection === "assignments" ? "bg-amber-500 text-slate-950" : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            <Upload className="w-3.5 h-3.5 inline-block mr-1" /> गृहपाठ (Assignments)
          </button>
        </div>
      </div>

      <div className="p-6">
        
        {/* --- 1. VIDEO LECTURES LOBBY --- */}
        {activeSubSection === "videos" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="lms-videos-panel">
            {/* Player (col-span-2) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="aspect-video bg-black rounded-2xl overflow-hidden relative border border-slate-800 shadow-2xl flex flex-col justify-center items-center">
                {selectedVideo.youtubeUrl && isPlaying ? (
                  <iframe
                    src={`${selectedVideo.youtubeUrl}?autoplay=1`}
                    title={selectedVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <div className="text-center p-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500 shadow-lg">
                      <Play className="w-8 h-8 fill-amber-500 ml-1" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-white text-base max-w-md">{selectedVideo.title}</h3>
                      <p className="text-slate-400 text-xs">Instructor: {selectedVideo.instructor} • {selectedVideo.duration}</p>
                    </div>
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2 rounded-full text-xs shadow-lg transition-all"
                    >
                      आता व्याख्यान पहा (Start Lecture Video)
                    </button>
                  </div>
                )}
              </div>

              {/* Controls bar */}
              <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-bold text-white text-sm">{selectedVideo.title}</h4>
                  <p className="text-slate-500 text-xs mt-1">Instructor: {selectedVideo.instructor} • Subject: {selectedVideo.subject}</p>
                </div>

                <div className="flex gap-2">
                  {["1.0x", "1.25x", "1.5x", "2.0x"].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2 py-1 rounded text-[10px] font-bold ${
                        playbackSpeed === spd ? "bg-amber-500 text-slate-950" : "bg-slate-900 text-slate-400"
                      }`}
                    >
                      {spd}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description summary */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">व्याख्यान सारांश (Lecture Notes)</span>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedVideo.description}</p>
              </div>
            </div>

            {/* Playlist list (col-span-1) */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">उपलब्ध व्याख्यान मालिका (Playlist)</h3>
              
              <div className="space-y-3 max-h-[450px] overflow-y-auto">
                {LMS_VIDEOS.map((vid) => (
                  <div
                    key={vid.id}
                    onClick={() => { setSelectedVideo(vid); setIsPlaying(false); }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedVideo.id === vid.id
                        ? "bg-slate-950 border-amber-500 text-amber-400"
                        : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="bg-slate-900 border border-slate-800 text-slate-400 text-[9px] px-1.5 py-0.5 rounded font-mono">
                        {vid.standardOrExam}
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                        <Clock className="w-3 h-3" /> {vid.duration}
                      </span>
                    </div>

                    <h4 className="font-semibold text-xs mt-2.5 leading-relaxed text-white">
                      {vid.title}
                    </h4>

                    <p className="text-[10px] text-slate-500 mt-1">By {vid.instructor}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- 2. NOTES VAULT --- */}
        {activeSubSection === "documents" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="lms-notes-panel">
            {STUDY_MATERIALS.map((doc) => (
              <div
                key={doc.id}
                className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex justify-between items-center hover:border-slate-700 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex gap-2 text-[9px] font-bold">
                    <span className="bg-slate-900 text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded">
                      {doc.category}
                    </span>
                    <span className="bg-amber-500/5 text-amber-500 border border-amber-500/10 px-1.5 py-0.5 rounded">
                      {doc.level}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-xs sm:text-sm">{doc.title}</h3>
                  <p className="text-[10px] text-slate-500">Prepared by: {doc.author} • {doc.pages} ({doc.size})</p>
                </div>

                <button
                  onClick={() => handleDownloadDoc(doc.title)}
                  className="bg-slate-900 hover:bg-amber-500 hover:text-slate-950 border border-slate-800 hover:border-transparent text-slate-400 p-3 rounded-xl transition-all cursor-pointer"
                  title="Secure PDF Download"
                >
                  <FileDown className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* --- 3. HOMEWORK / ASSIGNMENTS --- */}
        {activeSubSection === "assignments" && (
          <div className="space-y-6" id="lms-assignments-panel">
            
            {/* If Student: Submit homework panel */}
            {!isTeacherOrAdmin && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* List of assignments */}
                <div className="lg:col-span-1 space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">गृहपाठ यादी (Homework Tasks)</h3>
                  {assignments.map((asm) => (
                    <div
                      key={asm.id}
                      onClick={() => { setSelectedAssignmentId(asm.id); setSubmitSuccess(null); }}
                      className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                        selectedAssignmentId === asm.id
                          ? "bg-slate-950 border-amber-500 text-amber-400"
                          : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-300"
                      }`}
                    >
                      <div className="flex justify-between items-center text-[9px]">
                        <span className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">
                          {asm.standard}
                        </span>
                        <span className="text-slate-500 flex items-center gap-0.5">
                          <Calendar className="w-3 h-3" /> Due {asm.dueDate}
                        </span>
                      </div>

                      <h4 className="font-bold text-white mt-2.5">{asm.title}</h4>
                      
                      {/* Submission status check */}
                      {asm.submissions?.some((s) => s.studentId === "STU-101") ? (
                        <span className="inline-block mt-2.5 text-[10px] text-emerald-400 font-bold">
                          ✓ Already Submitted
                        </span>
                      ) : (
                        <span className="inline-block mt-2.5 text-[10px] text-amber-500 font-bold">
                          ● Pending Submission
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Submit Workspace */}
                <div className="lg:col-span-2">
                  {selectedAssignmentId ? (
                    (() => {
                      const asm = assignments.find((x) => x.id === selectedAssignmentId);
                      if (!asm) return null;
                      const mySubmission = asm.submissions?.find((s) => s.studentId === "STU-101");
                      
                      return (
                        <div className="bg-slate-950 p-6 border border-slate-800 rounded-xl space-y-4">
                          <div className="border-b border-slate-900 pb-3">
                            <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 border border-amber-500/20 rounded font-mono uppercase">
                              {asm.standard}
                            </span>
                            <h3 className="font-bold text-white mt-1.5 text-base">{asm.title}</h3>
                            <p className="text-xs text-slate-400 mt-2">{asm.description}</p>
                          </div>

                          {submitSuccess && (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                              <CheckCircle className="w-4 h-4" /> {submitSuccess}
                            </div>
                          )}

                          {mySubmission ? (
                            <div className="space-y-4">
                              <div className="bg-slate-900/50 p-4 border border-slate-800/40 rounded-lg text-xs space-y-1.5">
                                <span className="text-slate-500 block uppercase text-[9px] font-bold">Your Submitted Content</span>
                                <p className="text-slate-200 italic">"{mySubmission.content}"</p>
                              </div>

                              {mySubmission.status === "Graded" ? (
                                <div className="bg-amber-500/5 p-4 border border-amber-500/10 rounded-lg text-xs space-y-2">
                                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                                    <Award className="w-4 h-4 text-amber-500" />
                                    <span>Teacher Grade: {mySubmission.grade}</span>
                                  </div>
                                  <p className="text-slate-300">Feedback: "{mySubmission.feedback}"</p>
                                </div>
                              ) : (
                                <div className="text-[10px] text-slate-500">
                                  ● Homework is under evaluation. Director Pratibha Ingole will post grades shortly.
                                </div>
                              )}
                            </div>
                          ) : (
                            <form onSubmit={handleHomeworkSubmit} className="space-y-3">
                              <div>
                                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">
                                  गृहपाठ उत्तर किंवा निबंध (Type your answer essays here)
                                </label>
                                <textarea
                                  required
                                  rows={5}
                                  placeholder="Write your assignment solutions or essay paragraphs..."
                                  value={studentContent}
                                  onChange={(e) => setStudentContent(e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                                />
                              </div>

                              <button
                                type="submit"
                                className="bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center gap-1 cursor-pointer hover:from-red-500 hover:to-amber-500"
                              >
                                Submit Homework Task <ArrowRight className="w-4 h-4" />
                              </button>
                            </form>
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    <div className="bg-slate-950 p-8 border border-slate-800/60 rounded-xl text-center text-slate-500 text-xs py-16">
                      Please select any homework task on the left roster to view description and submit solution.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* If Teacher/Admin: View submissions and grade */}
            {isTeacherOrAdmin && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Pending grading roster */}
                <div className="bg-slate-950 p-6 border border-slate-800 rounded-xl space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-900 pb-3">
                    विद्यार्थी गृहपाठ नोंदी (Student Submissions Ledger)
                  </h3>

                  <div className="divide-y divide-slate-900 space-y-2 max-h-[380px] overflow-y-auto">
                    {assignments.map((asm) => (
                      <div key={asm.id} className="pt-2">
                        <span className="text-[9px] bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono uppercase">
                          {asm.standard} — {asm.title}
                        </span>

                        <div className="space-y-2 mt-2">
                          {asm.submissions && asm.submissions.length > 0 ? (
                            asm.submissions.map((sub) => (
                              <div
                                key={sub.studentId}
                                onClick={() => setSelectedSubmission({
                                  assignmentId: asm.id,
                                  studentId: sub.studentId,
                                  studentName: sub.studentName
                                })}
                                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex justify-between items-center ${
                                  selectedSubmission?.studentId === sub.studentId && selectedSubmission?.assignmentId === asm.id
                                    ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                    : "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300"
                                }`}
                              >
                                <div>
                                  <strong className="text-white block font-medium">{sub.studentName}</strong>
                                  <span className="text-[10px] text-slate-400 block italic mt-0.5">"{sub.content}"</span>
                                </div>

                                <span className={`text-[10px] font-bold ${
                                  sub.status === "Graded" ? "text-emerald-400" : "text-amber-500"
                                }`}>
                                  {sub.status === "Graded" ? `Graded: ${sub.grade}` : "● Pending"}
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="text-[10px] text-slate-600 italic pl-1">No student homework submitted for this task yet.</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grading form */}
                <div className="bg-slate-950 p-6 border border-slate-800 rounded-xl space-y-4">
                  {selectedSubmission ? (
                    (() => {
                      const asm = assignments.find((x) => x.id === selectedSubmission.assignmentId);
                      const sub = asm?.submissions?.find((s) => s.studentId === selectedSubmission.studentId);
                      if (!sub) return null;

                      return (
                        <form onSubmit={handleGradeSubmit} className="space-y-4">
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1">
                            <Award className="w-4 h-4 text-amber-500" /> Grade Homework Submission
                          </h3>

                          <div className="text-xs bg-slate-900 p-3 rounded-lg space-y-1.5 border border-slate-800">
                            <span className="text-slate-500 uppercase text-[9px] font-bold block">Student Details</span>
                            <strong className="text-white block text-sm">{sub.studentName}</strong>
                            <p className="text-slate-400 text-xs italic">" {sub.content} "</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">ग्रेड (Grade)*</label>
                              <select
                                value={gradingScore}
                                onChange={(e) => setGradingScore(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                              >
                                <option value="O (Outstanding)">O (Outstanding)</option>
                                <option value="A+">A+</option>
                                <option value="A">A</option>
                                <option value="B+">B+</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Feedback Date</label>
                              <div className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-400 font-mono">
                                {new Date().toISOString().split("T")[0]}
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">मार्गदर्शन व शेरा (Teacher feedback remarks)*</label>
                            <input
                              type="text"
                              required
                              value={gradingFeedback}
                              onChange={(e) => setGradingFeedback(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold py-2.5 rounded-lg text-xs cursor-pointer shadow-lg hover:from-red-500 hover:to-amber-500"
                          >
                            Grade Submit
                          </button>
                        </form>
                      );
                    })()
                  ) : (
                    <div className="h-full flex flex-col justify-center items-center text-center text-slate-500 space-y-2 py-16">
                      <MessageSquare className="w-10 h-10 text-slate-700" />
                      <p className="text-xs">Select any student's homework submission on the left ledger to evaluate and award grades.</p>
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
