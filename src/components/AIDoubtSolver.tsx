import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, GraduationCap, ArrowRightLeft, BookOpen, Clock, Loader2, HelpCircle } from "lucide-react";
import { API } from "../config";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const PRESET_PROMPTS = [
  { label: "MPSC घाट मार्ग ट्रिक", text: "महाराष्ट्रातील महत्त्वाचे घाट आणि ते जोडणारे शहरे लक्षात ठेवण्यासाठी सोपी ट्रिक द्या." },
  { label: "Cramer's Rule Algebra", text: "Explain Cramer's Rule for solving simultaneous equations step-by-step with a 10th-standard board example." },
  { label: "NMMS संख्या मालिका युक्ती", text: "NMMS मधील संख्या मालिका (Number Series) प्रश्न वेगाने सोडवण्यासाठी कोणती सूत्रे व ट्रिक्स वापराव्यात?" },
  { label: "मराठी व्याकरण: प्रयोग", text: "मराठी व्याकरणातील 'कर्मणी प्रयोग' म्हणजे काय? उदाहरणांसह सोप्या भाषेत स्पष्ट करा." }
];

export default function AIDoubtSolver() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "नमस्कार! मी समर्थ अकॅडमीचा AI स्टडी कम्पेनियन आहे. मी तुम्हाला महाराष्ट्र बोर्ड अभ्यासक्रम (४ थी ते १० वी) आणि सर्व स्पर्धा परीक्षा जसे की MPSC, Scholarship, Navodaya, NMMS, व पोलीस भरती यांच्या तयारीसाठी मदत करेन.\n\nतुम्ही तुमचे प्रश्न मराठी किंवा इंग्रजीत विचारू शकता. विचारण्यासाठी खालीलपैकी एका सुचवलेल्या प्रश्नावर क्लिक करा किंवा स्वतः टाईप करा! **ज्ञान हेच सामर्थ्य!**"
    }
  ]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("General Study");
  const [level, setLevel] = useState("Competitive Exam");
  
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (customQuery?: string) => {
    const textToSend = (customQuery || query).trim();
    if (!textToSend || loading) return;

    // Append user message
    const updatedMessages: Message[] = [...messages, { role: "user", content: textToSend }];
    setMessages(updatedMessages);
    if (!customQuery) setQuery("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/api/ai/solve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: textToSend,
          history: updatedMessages.slice(0, -1), // Send previous history
          currentSubject: subject,
          level: level
        })
      });

      if (!response.ok) {
        throw new Error("Failed to contact tutoring server.");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "क्षमस्व! सर्व्हरशी संपर्क साधता आला नाही. कृपया तुमचे इंटरनेट तपासा किंवा काही वेळाने पुन्हा प्रयत्न करा."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Safe manual formatter of bold texts, bullet points, and code boxes inside chat replies
  const renderFormattedText = (text: string) => {
    return text.split("\n").map((line, lineIdx) => {
      // Check for code blocks
      if (line.startsWith("```")) {
        return null; // hide backticks
      }

      // Format bullet points
      const isBullet = line.trim().startsWith("- ") || line.trim().startsWith("* ");
      let cleanLine = line;
      if (isBullet) {
        cleanLine = line.trim().substring(2);
      }

      // Bold text parser (**text**)
      const parts = cleanLine.split(/\*\*([\s\S]*?)\*\*/g);
      const renderedLine = parts.map((part, partIdx) => {
        if (partIdx % 2 === 1) {
          return <strong key={partIdx} className="text-amber-400 font-bold">{part}</strong>;
        }
        return part;
      });

      if (isBullet) {
        return (
          <li key={lineIdx} className="ml-4 list-disc text-slate-300 mt-1 pl-1 leading-relaxed">
            {renderedLine}
          </li>
        );
      }

      return (
        <p key={lineIdx} className="text-slate-300 leading-relaxed text-xs sm:text-sm mt-1.5 min-h-[1.2em]">
          {renderedLine}
        </p>
      );
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[620px]" id="ai-doubt-solver-root">
      
      {/* Dynamic Settings Bar */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              समर्थ AI शंका निरसन मार्गदर्शक (AI Study Companion)
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Securely powered by Gemini 3.5 Flash for State Boards & Competitive Syllabus.
            </p>
          </div>
        </div>

        {/* Course & Level tuning */}
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg text-xs px-2 py-1.5 text-slate-300 focus:outline-none focus:border-amber-500 w-1/2 sm:w-36"
          >
            <option value="General Study">All General Study</option>
            <option value="Mathematics">Mathematics & MAT</option>
            <option value="Marathi Grammar">Marathi (मराठी)</option>
            <option value="English Grammar">English Grammar</option>
            <option value="Polity & History">Polity & History</option>
          </select>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg text-xs px-2 py-1.5 text-slate-300 focus:outline-none focus:border-amber-500 w-1/2 sm:w-36"
          >
            <option value="Competitive Exam">MPSC & Talathi</option>
            <option value="School Standard">Class 4th - 10th</option>
            <option value="Scholarship & Navodaya">Navodaya / NMMS</option>
          </select>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-950/40" id="ai-chat-history">
        {messages.map((msg, index) => {
          const isAI = msg.role === "assistant";
          return (
            <div
              key={index}
              className={`flex gap-3 max-w-3xl ${isAI ? "mr-auto" : "ml-auto flex-row-reverse"}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                isAI ? "bg-amber-500/10 border-amber-500/20" : "bg-slate-800 border-slate-700"
              }`}>
                {isAI ? (
                  <Sparkles className="w-4 h-4 text-amber-500" />
                ) : (
                  <GraduationCap className="w-4 h-4 text-slate-300" />
                )}
              </div>

              <div className={`p-4 rounded-2xl text-xs sm:text-sm border ${
                isAI
                  ? "bg-slate-900/90 border-slate-800 text-slate-200"
                  : "bg-gradient-to-br from-red-950/55 to-slate-900 border-red-900/30 text-white"
              }`}>
                {isAI ? (
                  <div className="space-y-1">{renderFormattedText(msg.content)}</div>
                ) : (
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 max-w-3xl mr-auto">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 animate-pulse text-amber-500" />
              समर्थ AI तुमचे उत्तर तयार करत आहे, कृपया प्रतीक्षा करा...
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Presets and entry */}
      <div className="p-4 border-t border-slate-800 bg-slate-950">
        {messages.length === 1 && !loading && (
          <div className="mb-3.5" id="presets-container">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 flex items-center gap-1">
              <HelpCircle className="w-3 h-3" /> पटकन प्रश्न विचारण्यासाठी क्लिक करा (Suggested doubts):
            </p>
            <div className="flex flex-wrap gap-2">
              {PRESET_PROMPTS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(preset.text)}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg px-3 py-1.5 text-xs text-left transition-colors cursor-pointer hover:border-amber-500/30"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
          id="ai-doubt-form"
        >
          <input
            type="text"
            required
            placeholder="तुमची शंका येथे टाईप करा (Type your educational doubt in Marathi or English here...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-gradient-to-r from-red-600 to-amber-600 text-white p-3 rounded-xl hover:from-red-500 hover:to-amber-500 transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
