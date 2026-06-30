import React, { useRef, useState, useEffect } from "react";
import { Video, VideoOff, Mic, MicOff, Send, Users, Trash2, Palette, Play, Info, PenTool, CheckCircle } from "lucide-react";

const MOCK_CHAT_POOL = [
  { sender: "Sneha Shinde", message: "मॅडम, हा टॉपिक MPSC Group B साठी किती गुणांना विचारला जातो?", time: "10:02 AM" },
  { sender: "Omkar Chavan", message: "सर, ब्लॅकबोर्डवरचे सूत्र पुन्हा एकदा समजवून सांगा ना.", time: "10:03 AM" },
  { sender: "Aditya Joshi", message: "Is this lecture useful for 8th scholarship as well?", time: "10:04 AM" },
  { sender: "Rohan Patil", message: "पोलीस भरतीचे ग्राउंड टेस्ट कधी चालू होणार सर?", time: "10:05 AM" },
  { sender: "Pratiksha Kale", message: "मॅडम, NMMS चा हॉल तिकीट कधी येणार आहे?", time: "10:06 AM" }
];

export default function LiveClassroom() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#facc15"); // default yellow
  const [brushWidth, setBrushWidth] = useState(4);
  const [isLive, setIsLive] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("MPSC GS History - 1857 Revolts in MH");
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [messages, setMessages] = useState<Array<{ sender: string; message: string; time: string; isTeacher?: boolean }>>([
    { sender: "System", message: "Welcome to Samarth Academy Live Classroom.", time: "10:00 AM" }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [viewerCount, setViewerCount] = useState(12);

  // Initialize Blackboard Canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    
    // Set display size
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    canvas.style.width = `${canvas.offsetWidth}px`;
    canvas.style.height = `${canvas.offsetHeight}px`;

    const context = canvas.getContext("2d");
    if (!context) return;
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = brushColor;
    context.lineWidth = brushWidth;
    contextRef.current = context;

    // Fill with dark green blackboard color
    context.fillStyle = "#064e3b"; // Forest green blackboard
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, [isLive]); // Re-init blackboard when going live

  // Update stroke styles when tools change
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = brushColor;
      contextRef.current.lineWidth = brushWidth;
    }
  }, [brushColor, brushWidth]);

  // Drawing event handlers
  const startDrawing = ({ nativeEvent }: React.MouseEvent) => {
    const { offsetX, offsetY } = nativeEvent;
    if (!contextRef.current) return;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }: React.MouseEvent) => {
    if (!isDrawing || !contextRef.current) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearBoard = () => {
    if (!canvasRef.current || !contextRef.current) return;
    const canvas = canvasRef.current;
    contextRef.current.fillStyle = "#064e3b";
    contextRef.current.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Simulating student chat participation
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * MOCK_CHAT_POOL.length);
      const randomChat = MOCK_CHAT_POOL[randomIndex];
      
      setMessages((prev) => [
        ...prev,
        {
          sender: randomChat.sender,
          message: randomChat.message,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
      setViewerCount((c) => c + Math.floor(Math.random() * 3) - 1);
    }, 18000); // add questions periodically

    return () => clearInterval(interval);
  }, [isLive]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: "Director / Teacher",
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isTeacher: true
      }
    ]);
    setNewMessage("");
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[580px]" id="live-classroom-container">
      {/* Left pane: Stream and blackboard */}
      <div className="flex-1 p-6 flex flex-col gap-4 border-r border-slate-800">
        
        {/* Topic Header & Start Stage button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${isLive ? "bg-red-500 animate-pulse" : "bg-slate-600"}`}></span>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                डिजिटल लाईव्ह क्लासरूम (Live Classroom)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Select standard or competitive course to initiate instant audio-visual streaming.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isLive ? (
              <button
                onClick={() => setIsLive(true)}
                className="bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 hover:from-red-500 hover:to-amber-500 transition-colors shadow-lg shadow-red-950/20 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                वर्ग सुरू करा (Go Live Now)
              </button>
            ) : (
              <button
                onClick={() => setIsLive(false)}
                className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                वर्ग बंद करा (Stop Stream)
              </button>
            )}
          </div>
        </div>

        {/* Course select while not live */}
        {!isLive ? (
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center space-y-4 my-auto flex flex-col items-center justify-center min-h-[350px]">
            <Video className="w-12 h-12 text-slate-600" />
            <div className="space-y-1 max-w-sm">
              <h3 className="font-bold text-white text-sm">Classroom is currently Offline</h3>
              <p className="text-xs text-slate-400">
                Teachers can configure standard streams and launch interactive blackboard dashboards with one click.
              </p>
            </div>
            <div className="w-full max-w-xs space-y-2">
              <label className="block text-[10px] uppercase font-bold text-slate-500 text-left">Selected Live Topic</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="MPSC GS History - 1857 Revolts in MH">MPSC GS History - 1857 Revolts in MH</option>
                <option value="Scholarship Maths - Compound Interest shortcut tricks">Scholarship Maths - Compound Interest shortcut tricks</option>
                <option value="Navodaya MAT - Alphabetic Series shortcuts">Navodaya MAT - Alphabetic Series shortcuts</option>
                <option value="10th Geometry - Pythagoras Theorem Theorem Proof">10th Geometry - Pythagoras Theorem Theorem Proof</option>
                <option value="Police Bharti - Marathi Grammar Test Review">Police Bharti - Marathi Grammar Test Review</option>
              </select>
            </div>
            <button
              onClick={() => setIsLive(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg transition-all"
            >
              Start Class Stream
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 flex-1">
            
            {/* Main Blackboard Canvas (col-span-3) */}
            <div className="xl:col-span-3 flex flex-col gap-3">
              <div className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <PenTool className="w-3.5 h-3.5 text-amber-500" />
                  <strong>शिक्षक फळा (Smart Blackboard)</strong> — Draw steps here
                </div>
                <div className="flex items-center gap-2">
                  {/* Colors */}
                  {["#facc15", "#ffffff", "#38bdf8", "#4ade80"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setBrushColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-5 h-5 rounded-full border ${brushColor === c ? "border-white scale-110" : "border-slate-800"} transition-all cursor-pointer`}
                    />
                  ))}
                  <div className="h-4 w-px bg-slate-800 mx-1"></div>
                  {/* Clear Button */}
                  <button
                    onClick={clearBoard}
                    className="text-red-400 hover:text-white hover:bg-red-950 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Clear Board
                  </button>
                </div>
              </div>

              {/* Drawing Area */}
              <div className="relative border border-emerald-800 rounded-xl overflow-hidden flex-1 min-h-[300px]">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="w-full h-full cursor-crosshair block"
                />
              </div>
            </div>

            {/* Video preview / Presentation box */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold">Presenter Mode</span>
                  <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wide">Live</span>
                </div>
                
                {/* Simulated Web Cam Frame */}
                <div className="aspect-video bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col justify-center items-center relative">
                  {cameraActive ? (
                    <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-center items-center">
                      <div className="w-12 h-12 rounded-full border border-amber-500/30 flex items-center justify-center bg-amber-500/10">
                        <Video className="w-6 h-6 text-amber-500" />
                      </div>
                      <span className="text-[10px] text-amber-400 mt-2 font-semibold">Rajesh Ingole Sir (Aptitude)</span>
                    </div>
                  ) : (
                    <div className="text-center text-slate-600 text-xs py-4 flex flex-col items-center gap-1.5">
                      <VideoOff className="w-8 h-8" />
                      <span>Camera Disabled</span>
                    </div>
                  )}

                  {/* Micro Indicators */}
                  <div className="absolute bottom-2 left-2 flex gap-1">
                    <span className={`p-1 rounded bg-slate-950/80 border border-slate-800 text-[9px] ${micActive ? "text-emerald-400" : "text-red-400"}`}>
                      {micActive ? <Mic className="w-2.5 h-2.5" /> : <MicOff className="w-2.5 h-2.5" />}
                    </span>
                  </div>
                </div>
              </div>

              {/* Control panels */}
              <div className="space-y-2 text-xs">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Audio/Video Feeds</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCameraActive(!cameraActive)}
                    className={`flex-1 py-1.5 px-2.5 rounded-lg border text-center transition-all cursor-pointer font-semibold ${
                      cameraActive ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-red-950/40 border-red-900 text-red-400"
                    }`}
                  >
                    {cameraActive ? "Cam On" : "Cam Off"}
                  </button>
                  <button
                    onClick={() => setMicActive(!micActive)}
                    className={`flex-1 py-1.5 px-2.5 rounded-lg border text-center transition-all cursor-pointer font-semibold ${
                      micActive ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-red-950/40 border-red-900 text-red-400"
                    }`}
                  >
                    {micActive ? "Mic On" : "Mic Off"}
                  </button>
                </div>
              </div>

              <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/40 text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Viewers:</span>
                  <span className="text-white font-bold">{viewerCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Subject:</span>
                  <span className="text-amber-400 font-bold">MAT Practice</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Right pane: Chat feed & participants (ONLY shown when active) */}
      <div className="w-full lg:w-80 p-6 flex flex-col justify-between bg-slate-950/50">
        <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-500" />
              लाइव्ह चॅट (Live Classroom Chat)
            </h3>
            {isLive && (
              <span className="text-[10px] bg-red-500/10 border border-red-500/30 text-red-400 px-2 py-0.5 rounded-full font-mono font-bold animate-pulse">
                {viewerCount} Online
              </span>
            )}
          </div>

          {/* Chat Messages scroll area */}
          <div className="space-y-3 overflow-y-auto flex-1 pr-1 text-xs max-h-[380px] min-h-[250px]" id="live-chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2.5 rounded-xl border ${
                  msg.isTeacher
                    ? "bg-amber-500/5 border-amber-500/20 ml-4"
                    : "bg-slate-900 border-slate-800"
                }`}
              >
                <div className="flex justify-between items-baseline gap-2 mb-0.5">
                  <strong className={msg.isTeacher ? "text-amber-400 font-bold" : "text-slate-300 font-semibold"}>
                    {msg.sender}
                  </strong>
                  <span className="text-[9px] text-slate-500">{msg.time}</span>
                </div>
                <p className="text-slate-300 leading-relaxed break-words">{msg.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Send message form */}
        {isLive ? (
          <form onSubmit={handleSendMessage} className="mt-4 flex gap-2" id="send-live-chat-form">
            <input
              type="text"
              placeholder="Ask a question..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 p-2 rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-slate-800/60 text-center text-[10px] text-slate-500">
            Chat feeds will automatically sync once the classroom session goes live.
          </div>
        )}
      </div>
    </div>
  );
}
