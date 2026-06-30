import { useState, useEffect } from "react";
import { Timer, Award, AlertCircle, RefreshCw, CheckCircle, XCircle, ArrowRight, ArrowLeft, BookOpen, GraduationCap } from "lucide-react";
import { QUIZZES } from "../data";
import { Quiz, QuizQuestion } from "../types";

export default function PracticeTests() {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [results, setResults] = useState<{
    score: number;
    percentage: number;
    correctCount: number;
    incorrectCount: number;
    passed: boolean;
  } | null>(null);

  // Timer hook
  useEffect(() => {
    if (!quizActive || timeLeft <= 0 || quizSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest(true); // Auto-submit on timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizActive, timeLeft, quizSubmitted]);

  const handleStartQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeLeft(quiz.durationMinutes * 60);
    setQuizSubmitted(false);
    setQuizActive(true);
    setResults(null);
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitTest = (auto = false) => {
    if (!selectedQuiz || quizSubmitted) return;

    let correct = 0;
    selectedQuiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const total = selectedQuiz.questions.length;
    const score = correct;
    const percentage = Math.round((correct / total) * 100);
    const passed = percentage >= 40;

    setResults({
      score,
      percentage,
      correctCount: correct,
      incorrectCount: total - correct,
      passed
    });
    setQuizSubmitted(true);
    if (auto) {
      alert("वेळ संपली! तुमची परीक्षा स्वयंचलितपणे सबमिट केली गेली आहे. (Time's up! Your test has been auto-submitted.)");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden" id="practice-tests-root">
      
      {/* Catalog Selector */}
      {!quizActive && (
        <div className="p-6">
          <div className="border-b border-slate-800 pb-4 mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-6.5 h-6.5 text-amber-500" />
              ऑनलाईन सराव चाचणी केंद्र (Online Practice Test Center)
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Select an academy-approved mock test series. Tailored directly for competitive exams and class preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {QUIZZES.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-amber-500/50 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="bg-slate-900 border border-slate-800 text-slate-400 font-semibold px-2 py-0.5 rounded uppercase">
                      {quiz.standardOrExam}
                    </span>
                    <span className="text-amber-400 font-mono font-bold">
                      {quiz.questions.length} Questions
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                    {quiz.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Timer className="w-3.5 h-3.5" />
                      {quiz.durationMinutes} Mins
                    </span>
                    <span className="bg-amber-500/5 border border-amber-500/10 text-amber-500 px-2 py-0.5 rounded text-[10px] font-bold">
                      {quiz.category}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartQuiz(quiz)}
                  className="w-full bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 font-bold text-xs py-2.5 rounded-lg transition-all mt-5 cursor-pointer border border-slate-800 hover:border-transparent"
                >
                  Start Practice Test
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Quiz Dashboard */}
      {quizActive && selectedQuiz && (
        <div className="flex flex-col" id="active-quiz-dashboard">
          {/* Header */}
          <div className="bg-slate-950 border-b border-slate-800 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20 px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                {selectedQuiz.standardOrExam}
              </span>
              <h3 className="font-bold text-white text-sm mt-1">{selectedQuiz.title}</h3>
            </div>

            {/* Timer and Submit */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-sm">
                <Timer className={`w-4 h-4 ${timeLeft < 60 ? "text-red-500 animate-pulse" : "text-amber-400"}`} />
                <span className={timeLeft < 60 ? "text-red-500 font-bold" : "text-white"}>{formatTime(timeLeft)}</span>
              </div>

              {!quizSubmitted && (
                <button
                  onClick={() => handleSubmitTest(false)}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer"
                >
                  परीक्षा संपवा (Submit Test)
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
            {/* Question layout (col-span-3) */}
            <div className="lg:col-span-3 space-y-6">
              {/* Question card */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}</span>
                  <span className="font-mono">Single Choice Match</span>
                </div>

                <h4 className="text-white font-semibold text-base leading-relaxed">
                  {selectedQuiz.questions[currentQuestionIndex].question}
                </h4>

                {/* Options list */}
                <div className="space-y-3 pt-2">
                  {selectedQuiz.questions[currentQuestionIndex].options.map((option, index) => {
                    const isSelected = selectedAnswers[selectedQuiz.questions[currentQuestionIndex].id] === index;
                    const qId = selectedQuiz.questions[currentQuestionIndex].id;
                    const isCorrect = selectedQuiz.questions[currentQuestionIndex].correctAnswer === index;
                    
                    let cardClass = "border-slate-800 hover:border-slate-700 bg-slate-900";
                    if (isSelected) {
                      cardClass = "border-amber-500 bg-amber-500/5 text-amber-300";
                    }
                    if (quizSubmitted) {
                      if (isCorrect) {
                        cardClass = "border-emerald-500 bg-emerald-500/10 text-emerald-400";
                      } else if (isSelected) {
                        cardClass = "border-red-500 bg-red-500/10 text-red-400";
                      } else {
                        cardClass = "border-slate-800 bg-slate-950 opacity-50";
                      }
                    }

                    return (
                      <button
                        key={index}
                        disabled={quizSubmitted}
                        onClick={() => handleSelectOption(qId, index)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between ${cardClass} ${!quizSubmitted && "cursor-pointer"}`}
                      >
                        <span className="font-medium">{option}</span>
                        {quizSubmitted && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                        {quizSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Explanatory text (only after submission) */}
              {quizSubmitted && (
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-2">
                  <h5 className="text-xs font-bold text-amber-500 uppercase tracking-wide flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" /> स्पष्टीकरण (Question Explanation):
                  </h5>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {selectedQuiz.questions[currentQuestionIndex].explanation}
                  </p>
                </div>
              )}

              {/* Navigation Actions */}
              <div className="flex justify-between items-center">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:border-slate-800 text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer font-bold"
                >
                  <ArrowLeft className="w-4 h-4" /> Previous
                </button>

                <button
                  disabled={currentQuestionIndex === selectedQuiz.questions.length - 1}
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:border-slate-800 text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer font-bold"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Status panel (col-span-1) */}
            <div className="space-y-4">
              {/* Question Navigator Grid */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">प्रश्न नेव्हिगेटर</h4>
                <div className="grid grid-cols-4 gap-2">
                  {selectedQuiz.questions.map((q, idx) => {
                    const isAnswered = selectedAnswers[q.id] !== undefined;
                    const isCurrent = idx === currentQuestionIndex;
                    
                    let btnClass = "bg-slate-900 text-slate-400 border border-slate-800";
                    if (isAnswered) {
                      btnClass = "bg-amber-500/20 text-amber-400 border border-amber-500/40";
                    }
                    if (isCurrent) {
                      btnClass = "bg-amber-500 text-slate-950 font-bold border border-amber-500 scale-105";
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`w-9 h-9 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${btnClass}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="text-[10px] text-slate-500 space-y-1 pt-2 border-t border-slate-900">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded bg-amber-500/20 border border-amber-500/40"></span>
                    <span>Answered Questions</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded bg-slate-900 border border-slate-800"></span>
                    <span>Unanswered/Skipped</span>
                  </div>
                </div>
              </div>

              {/* Grade Report (Only after submission) */}
              {quizSubmitted && results && (
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center space-y-3 animate-fade-in">
                  <div className="mx-auto w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20">
                    <Award className="w-6 h-6 text-amber-400" />
                  </div>
                  
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">प्राप्त निकाल (Test Result)</p>
                    <p className="text-2xl font-black text-white mt-1">{results.score} / {selectedQuiz.questions.length}</p>
                    <p className="text-xs text-amber-400 mt-1 font-semibold">{results.percentage}% Marks Scored</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-medium pt-2 border-t border-slate-900">
                    <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded border border-emerald-500/10">
                      <span className="block text-slate-500">Correct</span>
                      <strong className="text-sm font-bold">{results.correctCount}</strong>
                    </div>
                    <div className="bg-red-500/10 text-red-400 p-2 rounded border border-red-500/10">
                      <span className="block text-slate-500">Incorrect</span>
                      <strong className="text-sm font-bold">{results.incorrectCount}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => setQuizActive(false)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-lg cursor-pointer flex items-center justify-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Back to Quizzes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
