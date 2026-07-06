-- ==========================================
-- SAMARTH ACADEMY ERP - SUPABASE SCHEMA
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Academy Sync Table (For seamless cloud synchronization with local DB)
CREATE TABLE IF NOT EXISTS academy_sync (
    key TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for academy_sync
ALTER TABLE academy_sync ENABLE ROW LEVEL SECURITY;

-- Create policy for academy_sync (Service role & authenticated bypass)
CREATE POLICY "Allow all access to academy_sync for service role"
    ON academy_sync
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 2. User Profiles / Roles & Permissions
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'student',
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Students Table
CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    login_code VARCHAR(7) UNIQUE NOT NULL,
    student_name TEXT NOT NULL,
    name TEXT NOT NULL, -- Compatibility column
    phone VARCHAR(20) UNIQUE NOT NULL,
    parent_name TEXT NOT NULL,
    parent_phone VARCHAR(20),
    email TEXT,
    dob VARCHAR(20),
    gender VARCHAR(10) DEFAULT 'Male',
    class VARCHAR(100) DEFAULT '10th Standard',
    standard VARCHAR(100) DEFAULT '10th Standard', -- Compatibility column
    section VARCHAR(100) DEFAULT 'School Section', -- Compatibility column
    batch VARCHAR(100) DEFAULT 'Regular',
    address TEXT,
    admission_date VARCHAR(20),
    profile_photo TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    total_fees NUMERIC DEFAULT 0, -- Compatibility column
    paid_fees NUMERIC DEFAULT 0, -- Compatibility column
    password TEXT, -- Compatibility column for hashed passwords
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Teachers Table
CREATE TABLE IF NOT EXISTS teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    specialization TEXT,
    salary NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Parents Table
CREATE TABLE IF NOT EXISTS parents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    student_id TEXT REFERENCES students(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Present', 'Absent', 'Late')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_id, date)
);

-- 8. Fee Logs Table
CREATE TABLE IF NOT EXISTS fee_logs (
    id TEXT PRIMARY KEY, -- Supports 'PAY-XXXX' format
    student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
    student_name TEXT,
    amount NUMERIC NOT NULL,
    date TEXT NOT NULL,
    mode TEXT DEFAULT 'Cash',
    received_by TEXT DEFAULT 'Pratibha R. Ingole',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
    id TEXT PRIMARY KEY, -- Supports custom ID prefix
    title TEXT NOT NULL,
    description TEXT,
    due_date TEXT,
    standard TEXT,
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Assignment Submissions
CREATE TABLE IF NOT EXISTS assignment_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id TEXT REFERENCES assignments(id) ON DELETE CASCADE,
    student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
    student_name TEXT,
    content TEXT,
    status TEXT DEFAULT 'Pending',
    grade TEXT,
    feedback TEXT,
    submitted_at TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Online Tests Table
CREATE TABLE IF NOT EXISTS online_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER DEFAULT 30,
    standard TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Test Questions Table
CREATE TABLE IF NOT EXISTS test_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_id UUID REFERENCES online_tests(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of options
    correct_option INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Test Attempts Table
CREATE TABLE IF NOT EXISTS test_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_id UUID REFERENCES online_tests(id) ON DELETE CASCADE,
    student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    answers JSONB,
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Notifications & Announcements Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    role_target TEXT DEFAULT 'All', -- 'All', 'Student', 'Teacher', 'Parent'
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    published_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. WhatsApp Logs Table
CREATE TABLE IF NOT EXISTS whatsapp_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_phone TEXT NOT NULL,
    recipient_name TEXT,
    message_type TEXT NOT NULL,
    status TEXT DEFAULT 'Sent',
    response_payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. Live Classes Table
CREATE TABLE IF NOT EXISTS live_classes (
    id TEXT PRIMARY KEY, -- Custom meeting ID
    topic TEXT NOT NULL,
    teacher_name TEXT NOT NULL,
    scheduled_time TEXT,
    duration_minutes INTEGER DEFAULT 60,
    meet_link TEXT,
    status TEXT DEFAULT 'Upcoming',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. Live Class Attendance & History
CREATE TABLE IF NOT EXISTS live_class_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id TEXT REFERENCES live_classes(id) ON DELETE CASCADE,
    student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
    joined_at TEXT,
    duration_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 18. Payments (QR payments configuration & logs)
CREATE TABLE IF NOT EXISTS qr_settings (
    id TEXT PRIMARY KEY DEFAULT 'current_qr',
    image TEXT NOT NULL, -- base64 image or storage URL
    file_name TEXT,
    file_size TEXT,
    uploaded_by TEXT DEFAULT 'Admin',
    upload_date TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    transaction_id TEXT,
    status TEXT DEFAULT 'Pending',
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 19. Books & Study Material
CREATE TABLE IF NOT EXISTS books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    author TEXT,
    subject TEXT,
    price NUMERIC DEFAULT 0,
    stock_count INTEGER DEFAULT 0,
    cover_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS study_material (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subject TEXT,
    file_url TEXT NOT NULL,
    file_type TEXT,
    uploaded_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 20. Analytics & Dashboard Stats
CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name TEXT NOT NULL,
    metric_value NUMERIC NOT NULL,
    measured_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 21. Chat & Messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    sender_role TEXT NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 22. Activity Logs & App Configuration
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS app_configuration (
    id TEXT PRIMARY KEY,
    config_value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS for all relational tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_class_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_material ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create Security Policies for Global Access
-- Since the application operates with a single Node.js backend using a service role key,
-- the backend acts as a secure proxy. We allow full access to the service role.
CREATE POLICY "Full access for service_role to students" ON students FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Full access for service_role to teachers" ON teachers FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Full access for service_role to admins" ON admins FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Full access for service_role to parents" ON parents FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Full access for service_role to attendance" ON attendance FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Full access for service_role to fee_logs" ON fee_logs FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Full access for service_role to assignments" ON assignments FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Full access for service_role to assignment_submissions" ON assignment_submissions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Full access for service_role to live_classes" ON live_classes FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Full access for service_role to live_class_attendance" ON live_class_attendance FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Full access for service_role to qr_settings" ON qr_settings FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Full access for service_role to study_material" ON study_material FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Full access for service_role to chat_messages" ON chat_messages FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Enable public reading of QR settings for payment
CREATE POLICY "Allow public read access to qr_settings" ON qr_settings FOR SELECT TO public USING (true);

-- Enable public reading of study materials
CREATE POLICY "Allow public read access to study_material" ON study_material FOR SELECT TO public USING (true);


-- ==========================================
-- INDEXES FOR QUERY OPTIMIZATION
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_students_login_code ON students (login_code);
CREATE INDEX IF NOT EXISTS idx_students_phone ON students (phone);
CREATE INDEX IF NOT EXISTS idx_students_email ON students (email);
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance (student_id, date);
CREATE INDEX IF NOT EXISTS idx_fee_logs_student ON fee_logs (student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON assignment_submissions (assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON assignment_submissions (student_id);
CREATE INDEX IF NOT EXISTS idx_live_attendance_meeting ON live_class_attendance (meeting_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages (timestamp DESC);
