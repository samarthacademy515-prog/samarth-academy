import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ override: true });

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DB_FILE = path.join(process.cwd(), "db.json");
const BUCKET_ID = "55Hzc2BTocPjFMadrLYjbq";


app.use(cors({
  origin: true,
  credentials: true,
}));

app.options("*", cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    const bodyStr = JSON.stringify(req.body);
    if (bodyStr.length > 500) {
      console.log("[REQUEST BODY]", bodyStr.substring(0, 500) + "... (truncated)");
    } else {
      console.log("[REQUEST BODY]", bodyStr);
    }
  }
  next();
});

// Initialize Lazy Gemini Client helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set. Please configure it in your Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiClient;
}

// Default Seed Data
const DEFAULT_STUDENTS: any[] = [];

const DEFAULT_FEE_LOGS: any[] = [];

const DEFAULT_ASSIGNMENTS: any[] = [];

const DEFAULT_LIVE_CLASSES: any[] = [];

const DEFAULT_ATTENDANCE: any[] = [];

const DEFAULT_MEETING_LOGS: any[] = [];

const DEFAULT_MEETING_RECORDINGS: any[] = [];

// Read DB or Initialize
function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initialData: any = {
        students: DEFAULT_STUDENTS,
        feeLogs: DEFAULT_FEE_LOGS,
        assignments: DEFAULT_ASSIGNMENTS,
        liveClasses: DEFAULT_LIVE_CLASSES,
        attendance: DEFAULT_ATTENDANCE,
        meetingLogs: DEFAULT_MEETING_LOGS,
        meetingRecordings: DEFAULT_MEETING_RECORDINGS,
        whatsappLogs: [],
        notifications: [],
        liveClassHistory: [],
        settings: {
          academyName: "Samarth Academy",
          tagline: "ज्ञान हेच सामर्थ्य",
          director: "Pratibha Rajesh Ingole",
          phone: "9511668617",
          location: "Sinchan Nagar, Parbhani, Maharashtra"
        }
      };
      // Populate login codes for initial students
      initialData.students = initialData.students.map((student: any) => {
        if (!student.loginCode) {
          student.loginCode = Math.floor(1000000 + Math.random() * 9000000).toString();
        }
        return student;
      });
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
      return initialData;
    }
    const data = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(data);
    let changed = false;
    
    if (!parsed.students || !Array.isArray(parsed.students)) {
      parsed.students = DEFAULT_STUDENTS;
      changed = true;
    }
    
    if (!parsed.feeLogs || !Array.isArray(parsed.feeLogs)) {
      parsed.feeLogs = DEFAULT_FEE_LOGS;
      changed = true;
    }
    
    if (!parsed.assignments || !Array.isArray(parsed.assignments)) {
      parsed.assignments = DEFAULT_ASSIGNMENTS;
      changed = true;
    }
    
    if (!parsed.liveClasses || !Array.isArray(parsed.liveClasses)) {
      parsed.liveClasses = DEFAULT_LIVE_CLASSES;
      changed = true;
    }
    
    if (!parsed.attendance || !Array.isArray(parsed.attendance)) {
      parsed.attendance = DEFAULT_ATTENDANCE;
      changed = true;
    }
    
    if (!parsed.meetingLogs || !Array.isArray(parsed.meetingLogs)) {
      parsed.meetingLogs = DEFAULT_MEETING_LOGS;
      changed = true;
    }
    
    if (!parsed.meetingRecordings || !Array.isArray(parsed.meetingRecordings)) {
      parsed.meetingRecordings = DEFAULT_MEETING_RECORDINGS;
      changed = true;
    }
    
    if (!parsed.whatsappLogs || !Array.isArray(parsed.whatsappLogs)) {
      parsed.whatsappLogs = [];
      changed = true;
    }

    if (!parsed.notifications || !Array.isArray(parsed.notifications)) {
      parsed.notifications = [];
      changed = true;
    }

    if (!parsed.liveClassHistory || !Array.isArray(parsed.liveClassHistory)) {
      parsed.liveClassHistory = [];
      changed = true;
    }
    
    if (!parsed.settings) {
      parsed.settings = {
        academyName: "Samarth Academy",
        tagline: "ज्ञान हेच सामर्थ्य",
        director: "Pratibha Rajesh Ingole",
        phone: "9511668617",
        location: "Sinchan Nagar, Parbhani, Maharashtra"
      };
      changed = true;
    }

    // Filter out demo classes
    if (parsed.liveClasses && Array.isArray(parsed.liveClasses)) {
      const originalLength = parsed.liveClasses.length;
      parsed.liveClasses = parsed.liveClasses.filter((c: any) => c.id !== "LC-101" && c.id !== "LC-102" && c.id !== "LC-103");
      if (parsed.liveClasses.length !== originalLength) {
        changed = true;
      }
    }
    if (parsed.attendance && Array.isArray(parsed.attendance)) {
      const originalLength = parsed.attendance.length;
      parsed.attendance = parsed.attendance.filter((a: any) => a.meetingId !== "LC-101" && a.meetingId !== "LC-102" && a.meetingId !== "LC-103");
      if (parsed.attendance.length !== originalLength) {
        changed = true;
      }
    }
    if (parsed.meetingLogs && Array.isArray(parsed.meetingLogs)) {
      const originalLength = parsed.meetingLogs.length;
      parsed.meetingLogs = parsed.meetingLogs.filter((l: any) => l.meetingId !== "LC-101" && l.meetingId !== "LC-102" && l.meetingId !== "LC-103");
      if (parsed.meetingLogs.length !== originalLength) {
        changed = true;
      }
    }
    if (parsed.meetingRecordings && Array.isArray(parsed.meetingRecordings)) {
      const originalLength = parsed.meetingRecordings.length;
      parsed.meetingRecordings = parsed.meetingRecordings.filter((r: any) => r.meetingId !== "LC-101" && r.meetingId !== "LC-102" && r.meetingId !== "LC-103");
      if (parsed.meetingRecordings.length !== originalLength) {
        changed = true;
      }
    }

    // Filter out demo students
    const demoStudentIds = ["STU-101", "STU-102", "STU-103", "STU-104", "STU-105"];
    if (parsed.students && Array.isArray(parsed.students)) {
      const originalLength = parsed.students.length;
      parsed.students = parsed.students.filter((s: any) => !demoStudentIds.includes(s.id));
      if (parsed.students.length !== originalLength) {
        changed = true;
      }
    }
    if (parsed.feeLogs && Array.isArray(parsed.feeLogs)) {
      const originalLength = parsed.feeLogs.length;
      parsed.feeLogs = parsed.feeLogs.filter((f: any) => !demoStudentIds.includes(f.studentId));
      if (parsed.feeLogs.length !== originalLength) {
        changed = true;
      }
    }
    if (parsed.assignments && Array.isArray(parsed.assignments)) {
      const originalLength = parsed.assignments.length;
      parsed.assignments = parsed.assignments.filter((a: any) => a.id !== "ASM-201" && a.id !== "ASM-202" && a.id !== "ASM-203");
      if (parsed.assignments.length !== originalLength) {
        changed = true;
      }
    }
    
    // Ensure all students have a 7-digit login code
    parsed.students = parsed.students.map((student: any) => {
      if (!student.loginCode) {
        student.loginCode = Math.floor(1000000 + Math.random() * 9000000).toString();
        changed = true;
      }
      return student;
    });

    if (changed) {
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), "utf-8");
    }
    return parsed;
  } catch (error) {
    console.error("Error reading database file:", error);
    return { students: [], feeLogs: [], assignments: [], liveClasses: [], attendance: [], meetingLogs: [], meetingRecordings: [], whatsappLogs: [], settings: {} };
  }
}

// Debounce cloud sync to avoid rate limits
let syncTimeout: NodeJS.Timeout | null = null;

// Write DB
function writeDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    
    // Trigger asynchronous cloud sync with a 1.5s debounce
    if (syncTimeout) clearTimeout(syncTimeout);
    syncTimeout = setTimeout(() => {
      syncToCloud(data);
    }, 1500);
  } catch (error) {
    console.error("Error writing database file:", error);
  }
}

let supabaseAdmin: any = null;
let supabaseInitializationChecked = false;

function getSupabaseClient() {
  if (supabaseInitializationChecked) {
    return supabaseAdmin;
  }

  try {
    const supabaseUrlRaw = process.env.SUPABASE_URL || "https://fvjklkfdvvkuffrwjskb.supabase.co";
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseServiceKey) {
      console.log("[SUPABASE] Initializing Supabase Client via Service Role key...");
      
      // Trim rest/v1 or rest/v1/ suffix if any
      let cleanedUrl = supabaseUrlRaw.trim();
      if (cleanedUrl.endsWith("/rest/v1/")) {
        cleanedUrl = cleanedUrl.substring(0, cleanedUrl.length - 8);
      } else if (cleanedUrl.endsWith("/rest/v1")) {
        cleanedUrl = cleanedUrl.substring(0, cleanedUrl.length - 7);
      }
      
      supabaseAdmin = createClient(cleanedUrl, supabaseServiceKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      });
      console.log("[SUPABASE] Supabase Admin Client initialized successfully.");
    } else {
      console.warn("[SUPABASE] SUPABASE_SERVICE_ROLE_KEY environment variable is not defined.");
      console.log("Supabase unavailable. Running in local database mode.");
    }
  } catch (error: any) {
    console.error("[SUPABASE] Failed to initialize Supabase Client:", error.message || error);
    supabaseAdmin = null;
  } finally {
    supabaseInitializationChecked = true;
  }
  return supabaseAdmin;
}

const KEYS_TO_SYNC = [
  "students",
  "feeLogs",
  "assignments",
  "liveClasses",
  "attendance",
  "meetingLogs",
  "meetingRecordings",
  "whatsappLogs",
  "notifications",
  "liveClassHistory",
  "loginHistory",
  "settings"
];

// Async Cloud Sync Helper using Supabase Database
async function syncToCloud(data: any) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.warn("[SUPABASE] Supabase not initialized, skipping sync.");
      return;
    }
    
    console.log("[SUPABASE] Syncing database to Supabase PostgreSQL...");
    
    // Sync each key to its own row in academy_sync table
    for (const key of KEYS_TO_SYNC) {
      if (data[key] !== undefined) {
        const { error } = await supabase
          .from("academy_sync")
          .upsert({
            key,
            data: data[key],
            updated_at: new Date().toISOString()
          }, { onConflict: "key" });

        if (error) {
          if (error.message && error.message.includes("Could not find the table")) {
            console.warn(`[SUPABASE] NOTICE: 'academy_sync' table not found during sync for key "${key}". Run schema.sql in Supabase SQL Editor.`);
          } else {
            console.error(`[SUPABASE] Error upserting key "${key}" to Supabase:`, error.message);
          }
        }
      }
    }
    
    // Also sync paymentQR if it exists in data
    if (data.paymentQR) {
      await syncQrToCloud(data.paymentQR);
    }
    
    console.log("[SUPABASE] Database state successfully synced to Supabase PostgreSQL.");
  } catch (error: any) {
    console.error("[SUPABASE] Error syncing to Supabase PostgreSQL:", error.message);
  }
}

async function syncQrToCloud(qrData: any) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    
    const { error } = await supabase
      .from("academy_sync")
      .upsert({
        key: "payment_qr",
        data: qrData,
        updated_at: new Date().toISOString()
      }, { onConflict: "key" });

    if (error) {
      if (error.message && error.message.includes("Could not find the table")) {
        console.warn("[SUPABASE] NOTICE: 'academy_sync' table not found during QR sync. Run schema.sql in Supabase SQL Editor.");
      } else {
        console.error("[SUPABASE] Error syncing QR code to Supabase:", error.message);
      }
    } else {
      console.log("[SUPABASE] QR code successfully synced to Supabase PostgreSQL.");
    }
  } catch (error: any) {
    console.error("[SUPABASE] Error syncing QR code to Supabase:", error.message);
  }
}

async function initialCloudRestore() {
  console.log("[SUPABASE] Attempting to restore database from Supabase PostgreSQL...");
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.warn("[SUPABASE] Supabase not initialized, skipping cloud restore.");
      return;
    }
    
    let localData: any = {
      students: [],
      feeLogs: [],
      assignments: [],
      liveClasses: [],
      attendance: [],
      meetingLogs: [],
      meetingRecordings: [],
      whatsappLogs: [],
      notifications: [],
      liveClassHistory: [],
      loginHistory: [],
      settings: {}
    };
    
    if (fs.existsSync(DB_FILE)) {
      try {
        localData = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
      } catch (err) {}
    }
    
    const cloudData: any = {};
    let hasCloudData = false;
    
    // Fetch all keys at once for higher optimization!
    const { data: rows, error } = await supabase
      .from("academy_sync")
      .select("key, data");

    if (error) {
      if (error.message && error.message.includes("Could not find the table")) {
        console.warn("\n==================================================================================");
        console.warn("[SUPABASE] NOTICE: The 'academy_sync' table was not found in your Supabase database.");
        console.warn("Please copy the contents of 'schema.sql' and run them in your Supabase SQL Editor!");
        console.warn("==================================================================================\n");
      } else {
        console.error("[SUPABASE] Error fetching from Supabase database:", error.message);
      }
    } else if (rows && rows.length > 0) {
      for (const row of rows) {
        if (KEYS_TO_SYNC.includes(row.key)) {
          cloudData[row.key] = row.data;
          hasCloudData = true;
        }
      }
    }
    
    if (!hasCloudData) {
      console.log("[SUPABASE] No cloud database state found on Supabase. Starting fresh or using local cache.");
      return;
    }
    
    console.log("[SUPABASE] Cloud state fetched from Supabase. Merging into local database...");
    
    // Merge Students carefully by unique student id / email / loginCode
    const mergedStudents = [...(localData.students || [])];
    if (cloudData.students && Array.isArray(cloudData.students)) {
      for (const cs of cloudData.students) {
        if (!mergedStudents.some((ls: any) => ls.id === cs.id || (cs.email && ls.email === cs.email))) {
          mergedStudents.push(cs);
        }
      }
    }
    
    // Merge Fee Logs
    const mergedFeeLogs = [...(localData.feeLogs || [])];
    if (cloudData.feeLogs && Array.isArray(cloudData.feeLogs)) {
      for (const cf of cloudData.feeLogs) {
        if (!mergedFeeLogs.some((lf: any) => lf.id === cf.id)) {
          mergedFeeLogs.push(cf);
        }
      }
    }
    
    // Merge settings
    const mergedSettings = { ...(localData.settings || {}), ...(cloudData.settings || {}) };
    
    // Merge other collections completely, preferring cloud data if available
    const mergedData = {
      ...localData,
      ...cloudData,
      students: mergedStudents,
      feeLogs: mergedFeeLogs,
      settings: mergedSettings
    };
    
    // Save merged data
    fs.writeFileSync(DB_FILE, JSON.stringify(mergedData, null, 2), "utf-8");
    console.log("[SUPABASE] Cloud database merge successful! Active students count:", mergedData.students?.length || 0);
  } catch (error: any) {
    console.error("[SUPABASE] Error restoring from Supabase database:", error.message);
  }
}

async function restoreQrFromCloud() {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    
    const { data, error } = await supabase
      .from("academy_sync")
      .select("data")
      .eq("key", "payment_qr")
      .maybeSingle();

    if (error) {
      if (error.message && error.message.includes("Could not find the table")) {
        console.warn("[SUPABASE] NOTICE: 'academy_sync' table not found during QR restore.");
      } else {
        console.error("[SUPABASE] Error restoring QR code from Supabase:", error.message);
      }
    } else if (data && data.data) {
      let localData: any = {};
      if (fs.existsSync(DB_FILE)) {
        try {
          localData = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
        } catch (err) {}
      }
      localData.paymentQR = data.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(localData, null, 2), "utf-8");
      console.log("[SUPABASE] Payment QR successfully restored from Supabase.");
    }
  } catch (error: any) {
    console.error("[SUPABASE] Error restoring QR code from Supabase:", error.message);
  }
}

// --- API ROUTES ---

// 1. Health check & metadata
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", academy: "Samarth Academy ERP API", time: new Date() });
});

// 2. Get all state
app.get("/api/db", (req, res) => {
  const db = readDB();
  res.json(db);
});

// Get WhatsApp delivery logs
app.get("/api/whatsapp-logs", (req, res) => {
  const db = readDB();
  res.json(db.whatsappLogs || []);
});

// Get student login history
app.get("/api/login-history", (req, res) => {
  const db = readDB();
  res.json(db.loginHistory || []);
});

// Clear login history
app.post("/api/login-history/clear", (req, res) => {
  const db = readDB();
  db.loginHistory = [];
  writeDB(db);
  res.json({ success: true, message: "Login history cleared" });
});

// Auth Login API
app.post("/api/auth/login", (req, res) => {
  try {
    const { role, loginCode, passcode, email, loginType } = req.body || {};
    const db = readDB();

    console.log("Auth Login Attempt:", { role, loginType, hasCode: !!loginCode, hasPass: !!passcode });

    if (loginType === "google" || loginType === "email") {
      // New User Sign Up / Login via Google or Email
      const emailVal = email?.trim().toLowerCase() || "google-user@gmail.com";
      let student = (db.students || []).find((s: any) => s.email?.trim().toLowerCase() === emailVal);
      let isNewUser = false;
      
      if (!student) {
        isNewUser = true;
        const code = Math.floor(1000000 + Math.random() * 9000000).toString();
        const studentName = emailVal.split("@")[0];
        const formattedName = studentName.split(/[\._\-]/).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        student = {
          id: `STU-${Math.floor(100 + Math.random() * 900)}`,
          name: formattedName,
          email: emailVal,
          phone: "9511668617", // Default placeholder
          loginCode: code,
          standard: "10th Standard",
          section: "School Section",
          parentName: "Self Registered",
          address: "Parbhani",
          totalFees: 15000,
          paidFees: 0,
          attendance: {},
          admissionDate: new Date().toISOString().split("T")[0]
        };
        db.students.push(student);
      }

      // Add to login history
      db.loginHistory = db.loginHistory || [];
      db.loginHistory.unshift({
        id: `LH-${Math.floor(1000 + Math.random() * 9000)}`,
        studentId: student.id,
        studentName: student.name,
        role: "student",
        timestamp: new Date().toISOString(),
        method: loginType
      });

      writeDB(db);

      return res.json({
        success: true,
        user: {
          role: "student",
          name: student.name,
          email: student.email,
          studentId: student.id,
          loginCode: student.loginCode,
          isNewUser: isNewUser,
          studentDetails: student
        }
      });
    }

    if (role === "admin") {
      if (passcode === "80855") {
        return res.json({
          success: true,
          user: {
            role: "admin",
            name: "Director (Pratibha R. Ingole)"
          }
        });
      } else {
        return res.json({ success: false, error: "चुकीचा पासवर्ड! (Invalid Admin Passcode)" });
      }
    }

    if (role === "teacher") {
      if (passcode === "10985") {
        return res.json({
          success: true,
          user: {
            role: "teacher",
            name: "Expert Faculty"
          }
        });
      } else {
        return res.json({ success: false, error: "चुकीचा पासवर्ड! (Invalid Teacher Passcode)" });
      }
    }

    if (role === "student") {
      const student = (db.students || []).find((s: any) => s.loginCode === loginCode);
      if (student) {
        db.loginHistory = db.loginHistory || [];
        db.loginHistory.unshift({
          id: `LH-${Math.floor(1000 + Math.random() * 9000)}`,
          studentId: student.id,
          studentName: student.name,
          role: "student",
          timestamp: new Date().toISOString(),
          method: "loginCode"
        });
        writeDB(db);

        return res.json({
          success: true,
          user: {
            role: "student",
            name: student.name,
            studentId: student.id,
            loginCode: student.loginCode,
            studentDetails: student
          }
        });
      } else {
        return res.json({ success: false, error: "चुकीचा ७-अंकी लॉगिन कोड! (Invalid 7-digit Login Code)" });
      }
    }

    if (role === "parent") {
      // Parent can login with child's login code or parent phone
      const student = (db.students || []).find((s: any) => s.loginCode === loginCode || s.phone === loginCode);
      if (student) {
        db.loginHistory = db.loginHistory || [];
        db.loginHistory.unshift({
          id: `LH-${Math.floor(1000 + Math.random() * 9000)}`,
          studentId: student.id,
          studentName: student.name,
          role: "parent",
          timestamp: new Date().toISOString(),
          method: "loginCode"
        });
        writeDB(db);

        return res.json({
          success: true,
          user: {
            role: "parent",
            name: `${student.parentName} (${student.name} चे पालक)`,
            studentId: student.id,
            loginCode: student.loginCode,
            studentDetails: student
          }
        });
      } else {
        return res.json({ success: false, error: "चुकीचा कोड किंवा मोबाईल नंबर! (Invalid Child's Code or Mobile)" });
      }
    }

    return res.json({ success: false, error: "Invalid role or credentials" });
  } catch (err: any) {
    console.error("CRITICAL ERROR IN LOGIN ROUTE:", err);
    return res.json({ success: false, error: "सर्व्हरमध्ये त्रुटी आली: " + (err.message || "Unknown error") });
  }
});

// 3. Students operations
app.get("/api/students", (req, res) => {
  const db = readDB();
  res.json(db.students);
});

app.post("/api/students", (req, res) => {
  const db = readDB();
  const code = Math.floor(1000000 + Math.random() * 9000000).toString();
  const newStudent = {
    id: `STU-${Math.floor(100 + Math.random() * 900)}`,
    attendance: {},
    paidFees: 0,
    loginCode: code,
    ...req.body,
    admissionDate: new Date().toISOString().split("T")[0]
  };

  // Generate automated WhatsApp Guidance Log
  const guidanceMsg = `प्रिय ${newStudent.name}, आपले समर्थ अकॅडमी मध्ये स्वागत आहे! आपला ७-अंकी सुरक्षित लॉगिन कोड आहे: *${code}*. हा कोड वापरून आपण https://samarth-academy.in वर Student किंवा Parent म्हणून लॉगिन करू शकता. अभ्यासक्रम, थेट वर्ग व प्रगती पाहण्यासाठी हा कोड नेहमी वापरावा. - समर्थ अकॅडमी, परभणी.`;

  const whatsappLog = {
    id: `WA-${Math.floor(100000 + Math.random() * 900000)}`,
    studentId: newStudent.id,
    studentName: newStudent.name,
    phone: newStudent.phone,
    loginCode: code,
    message: guidanceMsg,
    sentAt: new Date().toISOString(),
    status: "Delivered ✔"
  };

  db.whatsappLogs = db.whatsappLogs || [];
  db.whatsappLogs.unshift(whatsappLog);

  db.students.push(newStudent);
  writeDB(db);
  res.status(201).json(newStudent);
});

app.put("/api/students/:id", (req, res) => {
  const db = readDB();
  const index = db.students.findIndex((s: any) => s.id === req.params.id);
  if (index !== -1) {
    db.students[index] = { ...db.students[index], ...req.body };
    writeDB(db);
    res.json(db.students[index]);
  } else {
    res.status(404).json({ error: "Student not found" });
  }
});

app.delete("/api/students/:id", (req, res) => {
  const db = readDB();
  const initialCount = db.students.length;
  db.students = db.students.filter((s: any) => s.id !== req.params.id);
  if (db.students.length < initialCount) {
    writeDB(db);
    res.json({ success: true, message: "Student deleted" });
  } else {
    res.status(404).json({ error: "Student not found" });
  }
});

// 4. Attendance Logger
app.post("/api/attendance", (req, res) => {
  const { date, attendanceMap } = req.body; // Map format: { studentId: "Present" | "Absent" }
  if (!date || !attendanceMap) {
    return res.status(400).json({ error: "Date and attendanceMap are required." });
  }

  const db = readDB();
  db.students = db.students.map((student: any) => {
    if (attendanceMap[student.id]) {
      student.attendance = student.attendance || {};
      student.attendance[date] = attendanceMap[student.id];
    }
    return student;
  });

  writeDB(db);
  res.json({ success: true, message: `Attendance updated for ${date}` });
});

// 5. Fee Payments & receipts
app.post("/api/fees/pay", (req, res) => {
  const { studentId, amount, mode, receivedBy } = req.body;
  if (!studentId || !amount) {
    return res.status(400).json({ error: "studentId and amount are required." });
  }

  const db = readDB();
  const student = db.students.find((s: any) => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: "Student not found." });
  }

  student.paidFees = Number(student.paidFees || 0) + Number(amount);
  
  const newReceipt = {
    id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
    studentId,
    studentName: student.name,
    amount: Number(amount),
    date: new Date().toISOString().split("T")[0],
    mode: mode || "Cash",
    receivedBy: receivedBy || "Pratibha R. Ingole"
  };

  db.feeLogs.unshift(newReceipt); // Add to the top of logs
  writeDB(db);
  res.status(201).json({ success: true, receipt: newReceipt, student });
});

// 5.5. Payment QR Code Management
app.get("/api/qr", (req, res) => {
  try {
    const db = readDB();
    res.json(db.paymentQR || null);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch QR code." });
  }
});

app.post("/api/qr", (req, res) => {
  try {
    const { image, fileName, fileSize, uploadedBy } = req.body;
    if (!image) {
      return res.status(400).json({ error: "Image data is required." });
    }

    // Verify format (must be data:image/...)
    if (!image.startsWith("data:image/")) {
      return res.status(400).json({ error: "Unsupported file format. Please upload JPG, JPEG, PNG or WEBP." });
    }

    // Validate size (5MB binary limit)
    const approxBinarySize = (image.length * 3) / 4;
    if (approxBinarySize > 5 * 1024 * 1024) {
      return res.status(400).json({ error: "QR code image size must not exceed 5 MB." });
    }

    const db = readDB();
    db.paymentQR = {
      image,
      fileName: fileName || "payment_qr.png",
      fileSize: fileSize || "Unknown size",
      uploadedBy: uploadedBy || "Admin",
      uploadDate: new Date().toISOString()
    };
    writeDB(db);
    res.status(200).json({ success: true, paymentQR: db.paymentQR });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to upload QR code: " + err.message });
  }
});

app.delete("/api/qr", (req, res) => {
  try {
    const db = readDB();
    db.paymentQR = null;
    writeDB(db);
    res.status(200).json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete QR code." });
  }
});

// 6. Assignment operations
app.post("/api/assignments/:id/submit", (req, res) => {
  const { studentId, studentName, content } = req.body;
  const db = readDB();
  const assignment = db.assignments.find((a: any) => a.id === req.params.id);
  if (!assignment) {
    return res.status(404).json({ error: "Assignment not found" });
  }

  const submission = {
    studentId,
    studentName,
    content,
    status: "Pending",
    submittedAt: new Date().toISOString().split("T")[0]
  };

  assignment.submissions = assignment.submissions || [];
  // Overwrite if already submitted
  const existingIndex = assignment.submissions.findIndex((s: any) => s.studentId === studentId);
  if (existingIndex !== -1) {
    assignment.submissions[existingIndex] = submission;
  } else {
    assignment.submissions.push(submission);
  }

  writeDB(db);
  res.status(201).json(submission);
});

app.post("/api/assignments/:id/grade", (req, res) => {
  const { studentId, grade, feedback } = req.body;
  const db = readDB();
  const assignment = db.assignments.find((a: any) => a.id === req.params.id);
  if (!assignment) {
    return res.status(404).json({ error: "Assignment not found" });
  }

  const submission = assignment.submissions?.find((s: any) => s.studentId === studentId);
  if (!submission) {
    return res.status(404).json({ error: "Submission not found" });
  }

  submission.status = "Graded";
  submission.grade = grade;
  submission.feedback = feedback;

  writeDB(db);
  res.json(submission);
});

// 7. Dynamic AI Doubt solver with Gemini!
app.post("/api/ai/solve", async (req, res) => {
  const { query, history, currentSubject, level } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const ai = getGeminiClient();
    
    // Custom system instruction for Samarth Academy Tutor
    const systemInstruction = `
You are the "Samarth Academy AI Tutor & Doubt Solver", a world-class AI educator created for Samarth Academy in Parbhani, Maharashtra.
The director of Samarth Academy is Pratibha Rajesh Ingole. The academy contact is 9511668617, and it is located in Sinchan Nagar, Parbhani.
You specialize in Maharashtra State Board syllabus (4th to 10th standard) and Maharashtra State Competitive Exams: NMMS, Navodaya, Scholarship, MPSC (Group B/C), Talathi, Police Bharti, ZP, Gram Sevak, and other recruitments.

Your tone should be highly professional, deeply encouraging, clear, and bilingual. You should respond in a mix of Marathi (using Marathi script) and English depending on the context, or purely in Marathi if asked, to make it extremely easy for Maharashtra rural and semi-urban students to understand.
Explain concepts step-by-step. For math and competitive logic, provide neat markdown steps, shortcut formulas, and trick methods (like scholarship shortcuts!).
Always keep the explanation pedagogical. Finish with a small positive Marathi proverb or encouraging line like "ज्ञान हेच सामर्थ्य!" (Knowledge is Power!).

Current context of the student:
Subject/Category: ${currentSubject || "General Study"}
Standard/Exam Level: ${level || "Competitive / School"}
`;

    // Format chat history
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }]
        });
      });
    }
    contents.push({
      role: "user",
      parts: [{ text: query }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    const reply = response.text;
    res.json({ reply });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ 
      error: "Could not solve doubt via Gemini. " + (err.message || ""), 
      reply: "क्षमस्व! सर्व्हरमध्ये काही तांत्रिक त्रुटी आली आहे. कृपया थोड्या वेळाने प्रयत्न करा. (Sorry, there was a technical error on our AI server. Please try again later.)"
    });
  }
});


// --- LIVE CLASSES MODULE APIS ---

// 1. Get all live classes list
app.get("/api/live-classes", (req, res) => {
  try {
    const db = readDB();
    res.json(db.liveClasses || []);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch live classes" });
  }
});

// 2. Create a live class
app.post("/api/live-classes", (req, res) => {
  try {
    const db = readDB();
    const {
      subject,
      teacher,
      class: className,
      section,
      description,
      meetingTitle,
      startDate,
      startTime,
      endTime,
      duration,
      meetLink,
      createdBy
    } = req.body;

    if (!subject || !teacher || !className || !meetingTitle || !startDate || !startTime || !meetLink) {
      return res.status(400).json({ error: "Required fields are missing. Make sure to enter Title, Subject, Standard, Batch, Teacher, Date, Start Time, and Google Meet Link." });
    }

    const classId = "LC-" + Date.now();
    const parsedDuration = Number(duration) || 60;

    const newClass = {
      id: classId,
      subject,
      teacher,
      class: className,
      section: section || "School Section",
      description: description || "",
      meetingTitle,
      startDate,
      startTime,
      endTime: endTime || "",
      duration: parsedDuration,
      meetLink,
      meetingRoom: meetLink, // fallback for backwards compatibility
      createdBy: createdBy || teacher,
      status: "scheduled",
      createdAt: new Date().toISOString(),
      startedTime: null,
      endedTime: null
    };

    db.liveClasses = db.liveClasses || [];
    db.liveClasses.push(newClass);

    // 1. In-app notification inside database
    db.notifications = db.notifications || [];
    db.notifications.push({
      id: "NTF-" + Date.now(),
      title: "🔴 New Live Class Scheduled",
      message: `${subject}: "${meetingTitle}" is scheduled by ${teacher} on ${startDate} at ${startTime}.`,
      class: className,
      section: section || "School Section",
      type: "scheduled",
      classId: classId,
      createdAt: new Date().toISOString(),
      readBy: []
    });

    // 2. WhatsApp logs backup
    db.whatsappLogs = db.whatsappLogs || [];
    db.whatsappLogs.push({
      id: "WAL-" + Date.now(),
      recipient: `Students of ${className}`,
      message: `🔴 *नवीन लाईव्ह क्लास शेड्यूल! (New Live Class Scheduled)*\n\nविषय: *${subject}*\nशीर्षक: *${meetingTitle}*\nशिक्षक: *${teacher}*\nवेळ: *${startDate}* रोजी *${startTime}* वाजता.\n\nसामर्थ अकॅडमी ॲपमध्ये जाऊन लाईव्ह क्लास जॉइन करा!`,
      timestamp: new Date().toISOString(),
      status: "delivered"
    });

    writeDB(db);
    res.status(201).json(newClass);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to create live class: " + err.message });
  }
});

// 3. Update a live class
app.put("/api/live-classes/:id", (req, res) => {
  try {
    const db = readDB();
    const { id } = req.params;
    const index = db.liveClasses.findIndex((c: any) => c.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Live class not found" });
    }

    const currentClass = db.liveClasses[index];
    const updatedClass = {
      ...currentClass,
      ...req.body,
      id: currentClass.id,
      createdAt: currentClass.createdAt
    };

    db.liveClasses[index] = updatedClass;

    // 1. In-app notification
    db.notifications = db.notifications || [];
    db.notifications.push({
      id: "NTF-" + Date.now(),
      title: "🔴 Live Class Schedule Updated",
      message: `${updatedClass.subject}: "${updatedClass.meetingTitle}" schedule has been updated. New schedule: ${updatedClass.startDate} at ${updatedClass.startTime}.`,
      class: updatedClass.class,
      section: updatedClass.section,
      type: "updated",
      classId: id,
      createdAt: new Date().toISOString(),
      readBy: []
    });

    // 2. WhatsApp update
    db.whatsappLogs = db.whatsappLogs || [];
    db.whatsappLogs.push({
      id: "WAL-" + Date.now(),
      recipient: `Students of ${updatedClass.class}`,
      message: `🔔 *लाईव्ह क्लास शेड्यूल बदलले! (Class Schedule Updated)*\n\nविषय: *${updatedClass.subject}*\nशीर्षक: *${updatedClass.meetingTitle}*\nवेळ: *${updatedClass.startDate}* रोजी *${updatedClass.startTime}* वाजता.`,
      timestamp: new Date().toISOString(),
      status: "delivered"
    });

    writeDB(db);
    res.json(updatedClass);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to update live class" });
  }
});

// 4. Delete a live class
app.delete("/api/live-classes/:id", (req, res) => {
  try {
    const db = readDB();
    const { id } = req.params;
    const index = db.liveClasses.findIndex((c: any) => c.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Live class not found" });
    }

    const deletedClass = db.liveClasses[index];
    db.liveClasses.splice(index, 1);

    // Cancel notification
    db.notifications = db.notifications || [];
    db.notifications.push({
      id: "NTF-" + Date.now(),
      title: "⚠️ Live Class Cancelled",
      message: `${deletedClass.subject}: "${deletedClass.meetingTitle}" class scheduled for ${deletedClass.startDate} has been cancelled.`,
      class: deletedClass.class,
      section: deletedClass.section,
      type: "cancelled",
      classId: id,
      createdAt: new Date().toISOString(),
      readBy: []
    });

    db.whatsappLogs = db.whatsappLogs || [];
    db.whatsappLogs.push({
      id: "WAL-" + Date.now(),
      recipient: `Students of ${deletedClass.class}`,
      message: `⚠️ *लाईव्ह क्लास रद्द! (Class Cancelled)*\n\n*${deletedClass.meetingTitle}* हा वर्ग रद्द करण्यात आला आहे.`,
      timestamp: new Date().toISOString(),
      status: "delivered"
    });

    writeDB(db);
    res.json({ success: true, message: "Live class deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete live class" });
  }
});

// 5. Start a live class
app.post("/api/live-classes/:id/start", (req, res) => {
  try {
    const db = readDB();
    const { id } = req.params;
    const index = db.liveClasses.findIndex((c: any) => c.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Live class not found" });
    }

    db.liveClasses[index].status = "live";
    db.liveClasses[index].startedTime = new Date().toISOString();

    // 1. Send app notifications
    db.notifications = db.notifications || [];
    db.notifications.push({
      id: "NTF-" + Date.now(),
      title: "🔴 Live Class Started",
      message: `🚀 ${db.liveClasses[index].subject}: "${db.liveClasses[index].meetingTitle}" by ${db.liveClasses[index].teacher} is now LIVE! Join immediately!`,
      class: db.liveClasses[index].class,
      section: db.liveClasses[index].section,
      type: "started",
      classId: id,
      createdAt: new Date().toISOString(),
      readBy: []
    });

    // 2. WhatsApp alert
    db.whatsappLogs = db.whatsappLogs || [];
    db.whatsappLogs.push({
      id: "WAL-" + Date.now(),
      recipient: `Students of ${db.liveClasses[index].class}`,
      message: `🚀 *लाईव्ह क्लास सुरू झाला आहे! (Class is Live)*\n\nविषय: *${db.liveClasses[index].subject}*\nशीर्षक: *${db.liveClasses[index].meetingTitle}*\nशिक्षक: *${db.liveClasses[index].teacher}*\n\nत्वरित ॲपमध्ये जाऊन जॉइन करा!`,
      timestamp: new Date().toISOString(),
      status: "delivered"
    });

    writeDB(db);
    res.json(db.liveClasses[index]);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to start live class" });
  }
});

// 6. End a live class
app.post("/api/live-classes/:id/end", (req, res) => {
  try {
    const db = readDB();
    const { id } = req.params;
    const index = db.liveClasses.findIndex((c: any) => c.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Live class not found" });
    }

    const liveClass = db.liveClasses[index];
    liveClass.status = "completed";
    const endedTimeStr = new Date().toISOString();
    liveClass.endedTime = endedTimeStr;

    // Calculate actual live duration
    let liveDuration = liveClass.duration;
    if (liveClass.startedTime) {
      const diffMs = new Date(endedTimeStr).getTime() - new Date(liveClass.startedTime).getTime();
      liveDuration = Math.max(1, Math.round(diffMs / 60000));
    }

    // Auto-complete ongoing attendance join durations
    db.attendance = db.attendance || [];
    db.attendance.forEach((att: any) => {
      if (att.meetingId === id && !att.leftAt) {
        att.leftAt = endedTimeStr;
        const diffMs = new Date(endedTimeStr).getTime() - new Date(att.joinedAt).getTime();
        att.duration = Math.max(1, Math.round(diffMs / 60000));
        att.status = "Present";
      }
    });

    // Gather unique students joined for history
    const classAttendance = db.attendance.filter((att: any) => att.meetingId === id);
    const attendanceCount = classAttendance.length;
    const studentsJoined = classAttendance.map((att: any) => ({
      studentId: att.studentId,
      studentName: att.studentName,
      joinedAt: att.joinedAt
    }));

    // Record class history
    db.liveClassHistory = db.liveClassHistory || [];
    db.liveClassHistory.push({
      id: "HST-" + Date.now(),
      classId: id,
      title: liveClass.meetingTitle,
      subject: liveClass.subject,
      teacher: liveClass.teacher,
      date: liveClass.startDate,
      meetLink: liveClass.meetLink,
      duration: liveDuration,
      attendanceCount,
      studentsJoined,
      createdBy: liveClass.createdBy,
      createdTime: liveClass.createdAt,
      endedTime: endedTimeStr
    });

    writeDB(db);
    res.json(liveClass);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to end live class" });
  }
});

// 7. Get attendance for a specific meeting
app.get("/api/live-classes/:id/attendance", (req, res) => {
  try {
    const db = readDB();
    const { id } = req.params;
    const list = (db.attendance || []).filter((a: any) => a.meetingId === id);
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

// 8. Join a live class (marks attendance)
app.post("/api/live-classes/:id/join", (req, res) => {
  try {
    const db = readDB();
    const { id } = req.params;
    const { studentId, studentName, device, browser } = req.body;

    if (!studentName) {
      return res.status(400).json({ error: "Student name is required to join" });
    }

    db.attendance = db.attendance || [];

    // Idempotent check: if already joined and not left, or even if joined, let's keep one record per student per class to avoid duplication.
    const existing = db.attendance.find(
      (a: any) => a.meetingId === id && a.studentId === studentId
    );

    if (existing) {
      // Just return existing record to avoid duplications
      return res.json(existing);
    }

    const newAttendance = {
      id: "ATT-" + Date.now(),
      meetingId: id,
      studentId: studentId || "STU-GUEST-" + Math.floor(Math.random() * 1000),
      studentName,
      joinedAt: new Date().toISOString(),
      leftAt: null,
      duration: 0,
      device: device || "Desktop/Mobile Browser",
      browser: browser || "Web Browser",
      status: "Present"
    };

    db.attendance.push(newAttendance);
    writeDB(db);
    res.json(newAttendance);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to log joining" });
  }
});

// 9. Leave a live class
app.post("/api/live-classes/:id/leave", (req, res) => {
  try {
    const db = readDB();
    const { id } = req.params;
    const { studentId } = req.body;

    db.attendance = db.attendance || [];
    const record = db.attendance.find(
      (a: any) => a.meetingId === id && a.studentId === studentId && !a.leftAt
    );

    if (record) {
      record.leftAt = new Date().toISOString();
      const diffMs = new Date(record.leftAt).getTime() - new Date(record.joinedAt).getTime();
      record.duration = Math.max(1, Math.round(diffMs / 60000));
      writeDB(db);
      return res.json(record);
    }

    res.json({ message: "No active session to leave" });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to log leaving" });
  }
});

// 10. Get all recordings
app.get("/api/meeting-recordings", (req, res) => {
  try {
    const db = readDB();
    res.json(db.meetingRecordings || []);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch recordings" });
  }
});

// 11. Get live class history
app.get("/api/live-classes/history", (req, res) => {
  try {
    const db = readDB();
    res.json(db.liveClassHistory || []);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch live class history" });
  }
});

// 12. Get all attendance logs
app.get("/api/live-classes/attendance", (req, res) => {
  try {
    const db = readDB();
    res.json(db.attendance || []);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch all attendance logs" });
  }
});

// 13. Get all notifications
app.get("/api/notifications", (req, res) => {
  try {
    const db = readDB();
    res.json(db.notifications || []);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// 14. Mark notifications as read for a student
app.post("/api/notifications/read", (req, res) => {
  try {
    const db = readDB();
    const { studentId } = req.body;
    if (studentId) {
      db.notifications = db.notifications || [];
      db.notifications.forEach((ntf: any) => {
        ntf.readBy = ntf.readBy || [];
        if (!ntf.readBy.includes(studentId)) {
          ntf.readBy.push(studentId);
        }
      });
      writeDB(db);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to mark notifications read" });
  }
});



// --- VITE DEV / PRODUCTION MIDDLEWARE ---

async function startServer() {
  const isProd = process.env.NODE_ENV === "production";
  const distExists = fs.existsSync(path.join(process.cwd(), "dist"));

  if (!isProd || !distExists) {
    console.log("Starting server in DEVELOPMENT/VITE mode...");
    const { createServer: createViteServer } = await (eval('import("vite")') as Promise<any>);
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION static mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Samarth Academy Server running on http://localhost:${PORT}`);
    
    // Trigger cloud database check and restore safely 3 seconds after server is fully started
    setTimeout(async () => {
      try {
        console.log("[STARTUP] Triggering cloud database check and restore...");
        await initialCloudRestore();
        await restoreQrFromCloud();
      } catch (err: any) {
        console.error("[STARTUP] Error during deferred cloud restoration:", err.message || err);
      }
    }, 3000);
  });
}

startServer();
