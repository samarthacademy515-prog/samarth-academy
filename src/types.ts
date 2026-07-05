export interface Student {
  id: string;
  name: string;
  standard: string; // e.g. "10th Standard", "MPSC Group B"
  section: "School Section" | "Competitive Exams";
  parentName: string;
  phone: string;
  address: string;
  admissionDate: string;
  totalFees: number;
  paidFees: number;
  attendance: Record<string, "Present" | "Absent">;
  loginCode?: string;
}

export interface FeeLog {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  date: string;
  mode: string; // "Cash" | "Google Pay" | "PhonePe" | "UPI" | etc.
  receivedBy: string;
}

export interface Submission {
  studentId: string;
  studentName: string;
  content: string;
  status: "Pending" | "Graded";
  grade?: string;
  feedback?: string;
  submittedAt?: string;
}

export interface Assignment {
  id: string;
  title: string;
  standard: string;
  description: string;
  dueDate: string;
  submissions?: Submission[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-3 index
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  category: "School Section" | "Competitive Exams";
  standardOrExam: string; // e.g., "MPSC Group B", "Scholarship", "10th Standard"
  durationMinutes: number;
  questions: QuizQuestion[];
}

export interface Teacher {
  id: string;
  name: string;
  subjects: string[];
  phone: string;
  designation: string;
}
