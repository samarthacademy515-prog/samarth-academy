import { Quiz, Teacher } from "./types";

export const ACADEMY_INFO = {
  name: "Samarth Academy",
  tagline: "ज्ञान हेच सामर्थ्य",
  mission: "Provide quality education from school level to competitive examinations through technology-driven teaching.",
  address: "Sinchan Nagar, Parbhani, Maharashtra",
  contact: "9511668617",
  director: "Pratibha Rajesh Ingole"
};

export const COURSES = {
  school: [
    { id: "SCH-4", name: "4th Standard", subjects: ["Marathi", "English", "Mathematics", "EVS"] },
    { id: "SCH-5", name: "5th Standard", subjects: ["Marathi", "English", "Mathematics", "EVS", "Scholarship Studies"] },
    { id: "SCH-6", name: "6th Standard", subjects: ["Marathi", "English", "Hindi", "Mathematics", "Science", "Social Science"] },
    { id: "SCH-7", name: "7th Standard", subjects: ["Marathi", "English", "Hindi", "Mathematics", "Science", "Social Science"] },
    { id: "SCH-8", name: "8th Standard", subjects: ["Marathi", "English", "Hindi", "Mathematics", "Science", "Social Science", "NMMS Preparation"] },
    { id: "SCH-9", name: "9th Standard", subjects: ["Marathi", "English", "Hindi", "Mathematics", "Science", "Social Science"] },
    { id: "SCH-10", name: "10th Standard", subjects: ["Marathi", "English", "Hindi", "Algebra", "Geometry", "Science Part I", "Science Part II", "History & Civics", "Geography"] }
  ],
  competitive: [
    { id: "COMP-NMMS", name: "NMMS Exam", description: "National Means cum Merit Scholarship for 8th Standard" },
    { id: "COMP-SCHOL", name: "Scholarship Exam", description: "5th & 8th Standard state scholarship training" },
    { id: "COMP-NAV", name: "Navodaya Exam", description: "Jawahar Navodaya Vidyalaya Entrance preparation" },
    { id: "COMP-MPSCB", name: "MPSC Group B", description: "Sub-Inspector, State Tax Inspector, ASO exam preparation" },
    { id: "COMP-MPSCC", name: "MPSC Group C", description: "Tax Assistant, Clerk-Typist, Excise Inspector" },
    { id: "COMP-TAL", name: "Talathi Bharti", description: "Revenue department clerk recruitment training" },
    { id: "COMP-POL", name: "Police Bharti", description: "Maharashtra Police Constable recruitment coaching" },
    { id: "COMP-ZP", name: "ZP Recruitment", description: "Zilla Parishad administrative and technical posts exam" },
    { id: "COMP-SARAL", name: "Saral Seva", description: "Unified Maharashtra Grade C & D government recruitments" }
  ]
};

export const TEACHERS: Teacher[] = [
  { id: "TCH-1", name: "Pratibha Rajesh Ingole (Director)", subjects: ["English Grammar", "Marathi Grammar", "General Administration"], phone: "9511668617", designation: "Founder & Academic Director" },
  { id: "TCH-2", name: "Rajesh Ingole", subjects: ["Mathematics", "Quantitative Aptitude", "Mental Ability Test (MAT)"], phone: "9511668617", designation: "Co-Founder & Senior Aptitude Expert" },
  { id: "TCH-3", name: "Prof. S. D. Deshmukh", subjects: ["History", "Geography", "Polity (MPSC Group B/C)"], phone: "9422883311", designation: "Senior General Studies Faculty" },
  { id: "TCH-4", name: "Shri. Ankush Shinde", subjects: ["Science", "General Knowledge", "Police Bharti Specialist"], phone: "9823451122", designation: "Competitive Science Coach" }
];

export const LMS_VIDEOS = [
  {
    id: "VID-301",
    title: "MPSC Group B/C - Indian Polity & Constitution Introduction",
    subject: "Polity",
    standardOrExam: "MPSC Group B",
    duration: "45 Mins",
    instructor: "Pratibha Rajesh Ingole",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Fallback placeholder embed
    description: "In this session, Director Pratibha Ma'am covers the historical background of the Constitution, the Preamble, and core concepts of MPSC Group B/C exam."
  },
  {
    id: "VID-302",
    title: "Navodaya Entrance - Mental Ability Test (MAT) Tricks",
    subject: "Mathematics",
    standardOrExam: "Navodaya",
    duration: "32 Mins",
    instructor: "Rajesh Ingole",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Learn shortcut methods to solve mirror images, paper folding, and figure pattern completion for Navodaya Exam."
  },
  {
    id: "VID-303",
    title: "10th Standard Algebra - Linear Equations in Two Variables",
    subject: "Algebra",
    standardOrExam: "10th Standard",
    duration: "50 Mins",
    instructor: "Rajesh Ingole",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Step-by-step guidance on solving simultaneous equations using Cramer's Rule and graphical methods according to the Maharashtra State Board."
  },
  {
    id: "VID-304",
    title: "NMMS MAT - Number Series & Coding-Decoding Tricks",
    subject: "Mental Ability",
    standardOrExam: "NMMS",
    duration: "28 Mins",
    instructor: "Rajesh Ingole",
    description: "Special coaching tricks to decode complex alphabetical and number series within seconds for 8th Standard NMMS students."
  }
];

export const STUDY_MATERIALS = [
  { id: "DOC-401", title: "MPSC Group B/C Marathi Grammar Complete Notes", category: "Competitive Exams", level: "MPSC Group B", author: "Pratibha Ingole", pages: "48 Pages", size: "3.2 MB" },
  { id: "DOC-402", title: "Navodaya Math Formulas Cheat Sheet (मराठी & English)", category: "Competitive Exams", level: "Navodaya", author: "Rajesh Ingole", pages: "12 Pages", size: "1.5 MB" },
  { id: "DOC-403", title: "10th Standard Science Part I - Master Summary Notes", category: "School Section", level: "10th Standard", author: "Shri. Ankush Shinde", pages: "35 Pages", size: "4.1 MB" },
  { id: "DOC-404", title: "NMMS MAT (Mental Ability Test) Previous Years Questions Booklet", category: "Competitive Exams", level: "NMMS", author: "Rajesh Ingole", pages: "60 Pages", size: "5.8 MB" }
];

export const QUIZZES: Quiz[] = [
  {
    id: "QUIZ-501",
    title: "MPSC Group B & C History & Geography Mock Test (मराठी)",
    category: "Competitive Exams",
    standardOrExam: "MPSC Group B",
    durationMinutes: 10,
    questions: [
      {
        id: "Q1",
        question: "महाराष्ट्रातील खालीलपैकी कोणत्या जिल्ह्यात चिखलदरा हे थंड हवेचे ठिकाण आहे?",
        options: ["पुणे", "अमरावती", "नाशिक", "सातारा"],
        correctAnswer: 1,
        explanation: "चिखलदरा हे थंड हवेचे ठिकाण विदर्भातील अमरावती जिल्ह्यात मेळघाट व्याघ्र प्रकल्पाच्या कुशीत सातपुडा पर्वतरांगेत वसलेले आहे."
      },
      {
        id: "Q2",
        question: "चिपळूण आणि कराड यांच्या दरम्यान खालीलपैकी कोणता घाट आहे?",
        options: ["वरंधा घाट", "कुंभार्ली घाट", "फोंडा घाट", "आंबा घाट"],
        correctAnswer: 1,
        explanation: "कुंभार्ली घाट हा कोकणातील चिपळूण शहर आणि देशावरील कराड (सातारा) शहर यांना जोडणारा महत्त्वाचा घाट मार्ग आहे."
      },
      {
        id: "Q3",
        question: "१८५७ च्या उठावात सातार्‍याचे छत्रपतींचे प्रतिनिधी म्हणून कोणी नेतृत्व केले?",
        options: ["रंगो बापूजी गुप्ते", "चिमासाहेब", "भागोजी नाईक", "नानासाहेब"],
        correctAnswer: 0,
        explanation: "रंगो बापूजी गुप्ते यांनी सातारा गादीचे हक्क इंग्रजांकडून मिळवण्यासाठी इंग्लंडपर्यंत लढा दिला व १८५७ च्या उठावात सातारा परिसरात क्रांतिकारकांचे नेतृत्व केले."
      }
    ]
  },
  {
    id: "QUIZ-502",
    title: "NMMS & Navodaya Mathematics Scholarship Test (ENG/मराठी)",
    category: "Competitive Exams",
    standardOrExam: "Scholarship",
    durationMinutes: 15,
    questions: [
      {
        id: "Q4",
        question: "दसा दशे १० दराने ५००० रुपयांचे २ वर्षांचे सरळव्याज किती होईल?",
        options: ["५०० रुपये", "१००० रुपये", "१२०० रुपये", "१५०० रुपये"],
        correctAnswer: 1,
        explanation: "सरळव्याज = (मुद्दल * दर * काळ) / १०० = (५००० * १० * २) / १०० = १००० रुपये."
      },
      {
        id: "Q5",
        question: "If a number is multiplied by 3 and then increased by 15, it becomes 45. Find the number.",
        options: ["5", "10", "15", "20"],
        correctAnswer: 1,
        explanation: "Equation: 3x + 15 = 45 => 3x = 30 => x = 10."
      },
      {
        id: "Q6",
        question: "पहिल्या ५ मूळ संख्यांची सरासरी किती?",
        options: ["५.६", "५.८", "६.०", "६.२"],
        correctAnswer: 0,
        explanation: "पहिल्या ५ मूळ संख्या: २, ३, ५, ७, ११. बेरीज = २८. सरासरी = २८ / ५ = ५.६."
      }
    ]
  },
  {
    id: "QUIZ-503",
    title: "10th Algebra - Boards Preparation Mini Mock",
    category: "School Section",
    standardOrExam: "10th Standard",
    durationMinutes: 8,
    questions: [
      {
        id: "Q7",
        question: "If x + y = 7 and x - y = 3, what is the value of x and y?",
        options: ["x = 5, y = 2", "x = 4, y = 3", "x = 6, y = 1", "x = 3, y = 4"],
        correctAnswer: 0,
        explanation: "Adding both: 2x = 10 => x = 5. Substituting in x+y=7 => 5+y=7 => y=2."
      },
      {
        id: "Q8",
        question: "What is the discriminant (Δ) of the quadratic equation x^2 + 5x + 6 = 0?",
        options: ["1", "5", "6", "25"],
        correctAnswer: 0,
        explanation: "Discriminant Δ = b^2 - 4ac = 5^2 - 4(1)(6) = 25 - 24 = 1."
      }
    ]
  }
];
