export type Language = "english" | "hinglish" | "marathi" | "hindi";

export const LANGUAGE_NAMES: Record<Language, string> = {
  english: "English",
  hinglish: "Hinglish (हिंदी-Eng)",
  marathi: "मराठी (Marathi)",
  hindi: "हिंदी (Hindi)"
};

export const TRANSLATIONS: Record<string, Record<Language, string>> = {
  // Navigation & General
  "nav.brand": {
    english: "Samarth Academy",
    hinglish: "Samarth Academy",
    marathi: "समर्थ अकॅडमी",
    hindi: "समर्थ एकेडमी"
  },
  "nav.tagline": {
    english: "Knowledge is Strength",
    hinglish: "Gyan Hi Shakti Hai",
    marathi: "ज्ञान हेच सामर्थ्य",
    hindi: "ज्ञान ही शक्ति है"
  },
  "nav.home": {
    english: "Admissions & Home",
    hinglish: "Home & Admission",
    marathi: "प्रवेश व अकॅडमी",
    hindi: "प्रवेश व मुख्य पृष्ठ"
  },
  "nav.tracker": {
    english: "Study Tracker",
    hinglish: "Progress Tracker",
    marathi: "प्रगती ट्रॅकर",
    hindi: "प्रगति ट्रैकर"
  },
  "nav.fees": {
    english: "Pay Fees",
    hinglish: "Pay Fees On-line",
    marathi: "फी भरणे केंद्र",
    hindi: "फीस भुगतान"
  },
  "nav.erp": {
    english: "ERP Panel",
    hinglish: "Director ERP Panel",
    marathi: "ईआरपी व्यवस्थापन",
    hindi: "ईआरपी प्रबंधन"
  },
  "nav.lms": {
    english: "LMS Study",
    hinglish: "LMS Digital Padhai",
    marathi: "डिजिटल अभ्यासक्रम",
    hindi: "डिजिटल पाठ्यक्रम"
  },
  "nav.live": {
    english: "Live Whiteboard",
    hinglish: "Live Class Board",
    marathi: "थेट वर्ग",
    hindi: "लाइव क्लास"
  },
  "nav.practice": {
    english: "MCQ Practice",
    hinglish: "Practice Tests",
    marathi: "सराव चाचणी",
    hindi: "अभ्यास टेस्ट"
  },
  "nav.ai": {
    english: "AI Doubt Solver",
    hinglish: "AI Doubt Solver",
    marathi: "एआय शंका निवारण",
    hindi: "एआई शंका समाधान"
  },
  "role.student": {
    english: "Student Profile",
    hinglish: "Student Account",
    marathi: "विद्यार्थी खाते",
    hindi: "छात्र प्रोफाइल"
  },
  "role.parent": {
    english: "Parent Profile",
    hinglish: "Parent Account",
    marathi: "पालक खाते",
    hindi: "अभिभावक प्रोफाइल"
  },
  "role.teacher": {
    english: "Teacher Portal",
    hinglish: "Teacher Portal",
    marathi: "शिक्षक दालन",
    hindi: "शिक्षक पोर्टल"
  },
  "role.admin": {
    english: "Director Admin",
    hinglish: "Director Admin",
    marathi: "संचालक पॅनेल",
    hindi: "निदेशक एडमिन"
  },
  "contact.desk": {
    english: "Contact Desk",
    hinglish: "Contact Desk",
    marathi: "संपर्क केंद्र",
    hindi: "संपर्क डेस्क"
  },
  "language.select": {
    english: "Select Language",
    hinglish: "Bhasha Chune",
    marathi: "भाषा निवडा",
    hindi: "भाषा चुनें"
  },
  "address.info": {
    english: "Sinchan Nagar, Parbhani • ERP 2026 Secure Access System",
    hinglish: "Sinchan Nagar, Parbhani • ERP 2026 Secure Access System",
    marathi: "सिंचन नगर, परभणी • ईआरपी २०२६ सुरक्षित प्रवेश प्रणाली",
    hindi: "सिंचन नगर, परभणी • ईआरपी 2026 सुरक्षित प्रणाली"
  },
  "header.admissions_open": {
    english: "Sinchan Nagar, Parbhani, Maharashtra — Admissions Open (2026)",
    hinglish: "Sinchan Nagar, Parbhani — Admissions Open (2026)",
    marathi: "सिंचन नगर, परभणी, महाराष्ट्र — नवीन प्रवेश सुरू (२०२६)",
    hindi: "सिंचन नगर, परभणी, महाराष्ट्र — नए प्रवेश शुरू (2026)"
  },
  "header.contact": {
    english: "Contact:",
    hinglish: "Contact:",
    marathi: "संपर्क:",
    hindi: "संपर्क:"
  },
  "header.logout": {
    english: "Logout",
    hinglish: "Logout",
    marathi: "बाहेर पडा",
    hindi: "लॉगआउट"
  },
  "nav.category1": {
    english: "Dashboard Categories",
    hinglish: "Main Categories",
    marathi: "मुख्य विभाग",
    hindi: "मुख्य विभाग"
  },
  "nav.category2": {
    english: "All Website Features",
    hinglish: "All Features",
    marathi: "सर्व पर्याय",
    hindi: "सभी विकल्प"
  },
  "nav.home.desc": {
    english: "Academy main admissions & faculty portal",
    hinglish: "Academy main admissions & teachers info",
    marathi: "अकॅडमी मुख्य प्रवेश आणि शिक्षक माहिती केंद्र",
    hindi: "एकेडमी मुख्य प्रवेश और शिक्षक जानकारी"
  },
  "nav.tracker.desc": {
    english: "Student progress, mock grades & attendance",
    hinglish: "Student progress, mock test marks aur attendance",
    marathi: "विद्यार्थी प्रगती, उपस्थिती आणि गुण नियंत्रण",
    hindi: "छात्र प्रगति, उपस्थिति और अंक नियंत्रण"
  },
  "nav.fees.desc": {
    english: "Pay academy admission or monthly fees safely",
    hinglish: "Online ya cash academy fees bhare safely",
    marathi: "अकॅडमी प्रवेश किंवा मासिक शुल्क सुरक्षितपणे भरा",
    hindi: "एकेडमी प्रवेश या मासिक शुल्क सुरक्षित रूप से जमा करें"
  },
  "nav.lms.desc": {
    english: "View syllabus materials & assignments",
    hinglish: "Study materials aur homework assignments dekho",
    marathi: "अभ्यास साहित्य, नोट्स आणि गृहपाठ तपासा",
    hindi: "अध्ययन सामग्री, नोट्स और गृहकार्य जांचें"
  },
  "auth.existing_tab": {
    english: "Existing User Login",
    hinglish: "Old User Login",
    marathi: "जुने युझर प्रवेश",
    hindi: "पुराने यूजर लॉगिन"
  },
  "auth.new_tab": {
    english: "New User Register",
    hinglish: "Naya User Register",
    marathi: "नवीन युझर नोंदणी",
    hindi: "नए यूजर रजिस्ट्रेशन"
  },
  "auth.choose_role": {
    english: "Choose Your Role",
    hinglish: "Apni Role Chune",
    marathi: "आपली भूमिका निवडा",
    hindi: "अपनी भूमिका चुनें"
  },
  "auth.login_code_title": {
    english: "7-Digit Secure Login Code",
    hinglish: "7-Digit Login Code",
    marathi: "७-अंकी सुरक्षित लॉगिन कोड",
    hindi: "7-अंकीय सुरक्षित लॉगिन कोड"
  },
  "auth.login_code_desc": {
    english: "For new admissions, we have sent a unique 7-digit secure code directly to your WhatsApp. Please enter that code here to log in.",
    hinglish: "Aapke registered mobile par humne 7-digit login code WhatsApp kiya hai. Login karne ke liye vo code yaha enter kare.",
    marathi: "नवीन प्रवेश घेताना आम्ही विद्यार्थ्यांच्या मोबाईलवर ७-अंकी लॉगिन कोड थेट WhatsApp द्वारे पाठवला आहे. लॉगिन करण्यासाठी तो कोड येथे टाकावा.",
    hindi: "नए प्रवेश के समय हमने आपके मोबाइल पर 7-अंकीय लॉगिन कोड सीधे व्हाट्सएप पर भेजा है। लॉगिन करने के लिए वह कोड यहां दर्ज करें।"
  },
  "auth.student_code_label": {
    english: "Student 7-Digit Login Code *",
    hinglish: "Student 7-Digit Login Code *",
    marathi: "विद्यार्थी ७-अंकी लॉगिन कोड *",
    hindi: "छात्र 7-अंकीय लॉगिन कोड *"
  },
  "auth.parent_code_label": {
    english: "Student Code or Parent Phone Number *",
    hinglish: "Student Code ya Parent Mobile Number *",
    marathi: "विद्यार्थी ७-अंकी कोड किंवा पालकांचा फोन नंबर *",
    hindi: "छात्र कोड या अभिभावक का फोन नंबर *"
  },
  "auth.find_code": {
    english: "Find Code",
    hinglish: "Find Code",
    marathi: "लॉगिन कोड शोधा",
    hindi: "लॉगिन कोड खोजें"
  },
  "auth.student_placeholder": {
    english: "E.g. 8420511",
    hinglish: "E.g. 8420511",
    marathi: "उदा. ८४२०५११",
    hindi: "उदा. 8420511"
  },
  "auth.parent_placeholder": {
    english: "E.g. 7-digit code or 10-digit phone",
    hinglish: "7-digit code ya 10-digit phone",
    marathi: "उदा. ७-अंकी कोड किंवा १०-अंकी फोन नंबर",
    hindi: "उदा. 7-अंकीय कोड या 10-अंकीय फोन"
  },
  "auth.admin_pass_label": {
    english: "Director / Admin Passcode *",
    hinglish: "Director Admin Passcode *",
    marathi: "संचालिका / प्रशासक पासवर्ड *",
    hindi: "निदेशिका / एडमिन पासवर्ड *"
  },
  "auth.teacher_pass_label": {
    english: "Teacher Security PIN *",
    hinglish: "Teacher Security PIN *",
    marathi: "शिक्षक सुरक्षा पिन *",
    hindi: "शिक्षक सुरक्षा पिन *"
  },
  "auth.login_btn": {
    english: "Secure Login",
    hinglish: "Secure Login",
    marathi: "प्रवेश करा",
    hindi: "लॉगिन करें"
  },
  "auth.code_finder_title": {
    english: "Student Code Finder (Demo Tool)",
    hinglish: "Student Code Finder (Demo Tool)",
    marathi: "विद्यार्थी लॉगिन कोड शोधक (डेमो टूल)",
    hindi: "छात्र लॉगिन कोड खोजक (डेमो टूल)"
  },
  "auth.code_finder_desc": {
    english: "For demo testing, you can search for a student's 10-digit mobile number (e.g. 9511668617 or 9876543210) to retrieve their login code instantly.",
    hinglish: "Demo testing ke liye, aap student ka 10-digit phone number (E.g. 9511668617 ya 9876543210) search karke code nikal sakte hai.",
    marathi: "डेमो चाचणीसाठी, आपण खाली कोणत्याही विद्यार्थ्याचा १०-अंकी मोबाईल नंबर टाकून (उदा. ९५११६६८६१७ किंवा ९८७६५४३२१०) त्यांचा लॉगिन कोड तात्काळ शोधू शकता.",
    hindi: "डेमो परीक्षण के लिए, आप नीचे किसी भी छात्र का 10-अंकीय मोबाइल नंबर डालकर (उदा. 9511668617 या 9876543210) उनका लॉगिन कोड तुरंत खोज सकते हैं।"
  },
  "auth.search_placeholder": {
    english: "Enter mobile number or student name...",
    hinglish: "Mobile number ya student name dale...",
    marathi: "मोबाईल नंबर किंवा विद्यार्थ्याचे नाव टाका...",
    hindi: "मोबाइल नंबर या छात्र का नाम दर्ज करें..."
  },
  "auth.search_btn": {
    english: "Search",
    hinglish: "Search",
    marathi: "शोध घ्या",
    hindi: "खोजें"
  },
  "auth.student_found": {
    english: "Student Found!",
    hinglish: "Student Mil Gaya!",
    marathi: "विद्यार्थी सापडला!",
    hindi: "छात्र मिल गया!"
  },
  "auth.student_name": {
    english: "Name:",
    hinglish: "Name:",
    marathi: "नाव:",
    hindi: "नाम:"
  },
  "auth.student_phone": {
    english: "Mobile:",
    hinglish: "Mobile:",
    marathi: "मोबाईल क्रमांक:",
    hindi: "मोबाइल:"
  },
  "auth.student_code_display": {
    english: "7-Digit Login Code:",
    hinglish: "7-Digit Login Code:",
    marathi: "७-अंकी लॉगिन कोड:",
    hindi: "7-अंकीय लॉगिन कोड:"
  },
  "auth.autofill_btn": {
    english: "Auto-fill Code",
    hinglish: "Auto-fill Code",
    marathi: "हा कोड ऑटो-फिल करा",
    hindi: "यह कोड ऑटो-फिल करें"
  },
  "auth.new_user_title": {
    english: "Open New Account",
    hinglish: "Naya Account Khole",
    marathi: "नवीन खाते उघडा",
    hindi: "नया खाता खोलें"
  },
  "auth.new_user_desc": {
    english: "Instant registration for new users. You can explore the academy portal by registering using any of the options below:",
    hinglish: "Naye users ke liye instant access. Aap neeche diye gaye option se register karke explore kar sakte hai:",
    marathi: "नवीन युझर्ससाठी थेट प्रवेश. आपण खालीलपैकी कोणत्याही पर्यायाद्वारे नोंदणी करून अकॅडमी पोर्टल एक्सप्लोर करू शकता:",
    hindi: "नए उपयोगकर्ताओं के लिए तत्काल प्रवेश। आप नीचे दिए गए विकल्पों में से किसी से पंजीकरण करके पोर्टल एक्सप्लोर कर सकते हैं:"
  },
  "auth.google_btn": {
    english: "Sign In with Google",
    hinglish: "Google se Login kare",
    marathi: "गुगलद्वारे लॉग इन करा",
    hindi: "गूगल से लॉगिन करें"
  },
  "auth.google_chooser": {
    english: "Choose Google Account",
    hinglish: "Google Account Chune",
    marathi: "गुगल खाते निवडा",
    hindi: "गूगल खाता चुनें"
  },
  "auth.google_another": {
    english: "Use Another Account",
    hinglish: "Naya Account Use Kare",
    marathi: "इतर खाते वापरा",
    hindi: "अन्य खाता उपयोग करें"
  },
  "auth.email_or": {
    english: "Or Register with Email",
    hinglish: "Ya Email se Account Banaye",
    marathi: "किंवा ईमेलने खाते उघडा",
    hindi: "या ईमेल से खाता खोलें"
  },
  "auth.email_label": {
    english: "Email Address *",
    hinglish: "Email Address *",
    marathi: "ईमेल पत्ता *",
    hindi: "ईमेल पता *"
  },
  "auth.pass_label": {
    english: "Create Password *",
    hinglish: "Create Password *",
    marathi: "पासवर्ड तयार करा *",
    hindi: "पासवर्ड बनाएं *"
  },
  "auth.register_btn": {
    english: "Register with Email",
    hinglish: "Email se Register kare",
    marathi: "ईमेलद्वारे नोंदणी करा",
    hindi: "ईमेल से रजिस्टर करें"
  },
  "auth.help_title": {
    english: "Need Admission? Contact us today:",
    hinglish: "Admission chahiye? Aaj hi contact kare:",
    marathi: "प्रवेश हवा आहे? आजच संपर्क करा:",
    hindi: "प्रवेश चाहिए? आज ही संपर्क करें:"
  },
  "auth.footer_rights": {
    english: "Knowledge is Strength! All Rights Reserved.",
    hinglish: "Gyan Hi Shakti Hai! All Rights Reserved.",
    marathi: "ज्ञान हेच सामर्थ्य! सर्व हक्क सुरक्षित.",
    hindi: "ज्ञान ही शक्ति है! सर्वाधिकार सुरक्षित।"
  },
  "auth.not_found": {
    english: "No student found with this name or number.",
    hinglish: "Is number ya name se koi student nahi mila.",
    marathi: "या नंबर किंवा नावाने कोणताही विद्यार्थी सापडला नाही.",
    hindi: "इस नंबर या नाम से कोई छात्र नहीं मिला।"
  },
  "auth.success_msg": {
    english: "New account created successfully with email!",
    hinglish: "Email se naya account ban gaya hai!",
    marathi: "ईमेलद्वारे नवीन खाते यशस्वीरित्या तयार झाले!",
    hindi: "ईमेल से नया खाता सफलतापूर्वक बन गया!"
  },
  "auth.enter_code_student": {
    english: "Please enter your 7-digit student login code.",
    hinglish: "Please 7-digit student login code enter kare.",
    marathi: "कृपया आपला ७-अंकी विद्यार्थी लॉगिन कोड प्रविष्ट करा.",
    hindi: "कृपया अपना 7-अंकीय छात्र लॉगिन कोड दर्ज करें।"
  },
  "auth.enter_code_parent": {
    english: "Please enter student 7-digit code or parent phone number.",
    hinglish: "Please student code ya parent ka phone number enter kare.",
    marathi: "कृपया विद्यार्थी ७-अंकी कोड किंवा पालकांचा फोन नंबर प्रविष्ट करा.",
    hindi: "कृपया छात्र 7-अंकीय कोड या अभिभावक का फोन नंबर दर्ज करें।"
  },
  "auth.enter_pass": {
    english: "Please enter password or PIN.",
    hinglish: "Please password ya PIN enter kare.",
    marathi: "कृपया पासवर्ड किंवा पिन प्रविष्ट करा.",
    hindi: "कृपया पासवर्ड या पिन दर्ज करें।"
  },
  "auth.invalid_server_resp": {
    english: "Server returned invalid response. Please try again.",
    hinglish: "Server se galat response mila. Please firse try kare.",
    marathi: "सर्व्हरकडून अवैध प्रतिसाद मिळाला. कृपया पुन्हा प्रयत्न करा.",
    hindi: "सर्वर से अमान्य प्रतिक्रिया मिली। कृपया पुनः प्रयास करें।"
  },
  "auth.login_failed": {
    english: "Login failed. Please check credentials.",
    hinglish: "Login nahi ho paya. Please code checking kare.",
    marathi: "लॉगिन अयशस्वी झाले. कृपया कोड तपासा.",
    hindi: "लॉगिन विफल रहा। कृपया क्रेडेंशियल जांचें।"
  },
  "auth.login_success_welcome": {
    english: "Login successful! Welcome, ",
    hinglish: "Login successful! Welcome, ",
    marathi: "यशस्वी लॉगिन! स्वागत आहे, ",
    hindi: "लॉगिन सफल रहा! स्वागत है, "
  },
  "auth.enter_email_pass": {
    english: "Please enter both email and password.",
    hinglish: "Please email aur password dono dale.",
    marathi: "कृपया ईमेल आणि पासवर्ड दोन्ही प्रविष्ट करा.",
    hindi: "कृपया ईमेल और पासवर्ड दोनों दर्ज करें।"
  },
  "auth.email_created": {
    english: "New account created with email!",
    hinglish: "Email se naya account create ho gaya hai!",
    marathi: "ईमेलद्वारे नवीन खाते तयार केले गेले!",
    hindi: "ईमेल द्वारा नया खाता बनाया गया!"
  },

  // Home Screen / Admissions
  "home.title": {
    english: "Admissions Open - Academic Year 2026-27",
    hinglish: "Naye Admissions Open - Session 2026-27",
    marathi: "नवीन प्रवेश सुरू - शैक्षणिक वर्ष २०२६-२७",
    hindi: "नए प्रवेश शुरू - शैक्षणिक वर्ष 2026-27"
  },
  "home.sub": {
    english: "Empowering students in Parbhani through offline personal attention paired with cutting-edge digital learning modules.",
    hinglish: "Parbhani ke students ke liye digital learning aur offline personal attention ka ek solid combo.",
    marathi: "परभणीतील विद्यार्थ्यांसाठी ऑफलाइन वैयक्तिक लक्ष आणि अत्याधुनिक डिजिटल शिक्षण प्रणालीचा सुवर्णसंगम.",
    hindi: "परभणी के छात्रों के लिए ऑफलाइन व्यक्तिगत मार्गदर्शन और उन्नत डिजिटल लर्निंग का बेहतरीन संगम।"
  },
  "home.sections": {
    english: "Academy Offerings",
    hinglish: "Humare Sections",
    marathi: "अकॅडमीचे मुख्य विभाग",
    hindi: "एकेडमी के मुख्य विभाग"
  },
  "home.school": {
    english: "School Section (Classes 4th to 10th)",
    hinglish: "School Section (Class 4th se 10th)",
    marathi: "शालेय विभाग (इयत्ता ४ थी ते १० वी)",
    hindi: "स्कूली अनुभाग (कक्षा 4 से 10वीं)"
  },
  "home.school.desc": {
    english: "Comprehensive tutoring for Maharashtra State Board syllabus. Daily classes, home assignments, weekly revisions, and personal attention to build deep foundational concept clarity.",
    hinglish: "Maharashtra State Board syllabus ki taiyari. Daily classes, homework checking aur personal attention concepts clear karne ke liye.",
    marathi: "महाराष्ट्र स्टेट बोर्ड अभ्यासक्रमाची परिपूर्ण तयारी. रोजचे वर्ग, गृहपाठ तपासणी, साप्ताहिक उजळणी आणि विद्यार्थ्यांच्या पायाभूत संकल्पनांवर विशेष भर.",
    hindi: "महाराष्ट्र स्टेट बोर्ड पाठ्यक्रम की पूरी तैयारी। दैनिक कक्षाएं, गृहकार्य, साप्ताहिक रिवीजन और बुनियादी अवधारणाओं पर विशेष ध्यान।"
  },
  "home.comp": {
    english: "Competitive Exams Prep Center",
    hinglish: "Competitive Exams Preps",
    marathi: "स्पर्धा परीक्षा मार्गदर्शन केंद्र",
    hindi: "प्रतियोगी परीक्षा तैयारी केंद्र"
  },
  "home.comp.desc": {
    english: "Focused tutoring for NMMS, Scholarship, Navodaya Entrance, along with MPSC, Talathi, and Police Bharti recruitment exams.",
    hinglish: "NMMS, Scholarship, Navodaya aur MPSC, Talathi, Police Bharti ki behtareen planning ke sath solid taiyari.",
    marathi: "NMMS, शिष्यवृत्ती (Scholarship), नवोदय प्रवेश परीक्षा तसेच MPSC, तलाठी व पोलीस भरतीची परिपूर्ण व ध्येयनिष्ठ तयारी.",
    hindi: "NMMS, छात्रवृत्ति (Scholarship), नवोदय प्रवेश परीक्षा के साथ-साथ MPSC, तलाठी और पुलिस भर्ती की उत्कृष्ट तैयारी।"
  },
  "home.faculty": {
    english: "Expert Faculty Board",
    hinglish: "Hamare Expert Teachers",
    marathi: "आमचे तज्ञ मार्गदर्शक",
    hindi: "हमारे विशेषज्ञ शिक्षक"
  },
  "home.faculty.sub": {
    english: "Experienced subject matter experts and tutors providing quality guidance from school level to competitive stages.",
    hinglish: "Aise teachers jo school se lekar sarkari naukri tak ke concepts aaram se clear karwayenge.",
    marathi: "शालेय स्तरापासून ते स्पर्धा परीक्षेपर्यंत दर्जेदार व अनुभवी शिक्षकांचे मार्गदर्शन.",
    hindi: "स्कूली स्तर से लेकर प्रतियोगी परीक्षाओं तक अनुभवी शिक्षकों द्वारा गुणवत्तापूर्ण मार्गदर्शन।"
  },

  // Admission Form
  "form.title": {
    english: "Student Admission Enquiry",
    hinglish: "New Admission Enquiry Form",
    marathi: "नवीन प्रवेश चौकशी अर्ज",
    hindi: "नया प्रवेश पूछताछ फॉर्म"
  },
  "form.sub": {
    english: "Submit details to enroll or schedule a counseling session with Director Pratibha Ma'am.",
    hinglish: "Apni details bhare aur Director Pratibha Ma'am ke sath classes start kare.",
    marathi: "प्रवेश घेण्यासाठी किंवा संचालिका प्रतिभा मॅम यांच्यासोबत समुपदेशन सत्रासाठी माहिती सादर करा.",
    hindi: "प्रवेश लेने या निदेशिका प्रतिभा मैम के साथ काउंसिलिंग सेशन के लिए अपनी जानकारी भरें।"
  },
  "form.name": {
    english: "Student's Full Name",
    hinglish: "Student Ka Full Name",
    marathi: "विद्यार्थ्याचे पूर्ण नाव",
    hindi: "विद्यार्थी का पूरा नाम"
  },
  "form.standard": {
    english: "Select Class / Standard",
    hinglish: "Syllabus / Class Chune",
    marathi: "इयत्ता किंवा परीक्षा निवडा",
    hindi: "कक्षा या परीक्षा चुनें"
  },
  "form.section": {
    english: "Academic Division Section",
    hinglish: "Academic Section Category",
    marathi: "शैक्षणिक विभाग प्रकार",
    hindi: "शैक्षणिक श्रेणी"
  },
  "form.parent": {
    english: "Parent / Guardian Name",
    hinglish: "Parent / Guardian Name",
    marathi: "पालकांचे / पालकाचे नाव",
    hindi: "माता-पिता या अभिभावक का नाम"
  },
  "form.phone": {
    english: "WhatsApp / Mobile Number",
    hinglish: "WhatsApp Number",
    marathi: "व्हॉट्सॲप / मोबाईल क्रमांक",
    hindi: "व्हाट्सएप / मोबाइल नंबर"
  },
  "form.address": {
    english: "Resident Address (Parbhani Area)",
    hinglish: "Apna Address",
    marathi: "राहण्याचा पत्ता (परभणी परिसर)",
    hindi: "आवासीय पता (परभणी क्षेत्र)"
  },
  "form.submit": {
    english: "Submit Enquiry Form",
    hinglish: "Form Submit Kare",
    marathi: "चौकशी अर्ज दाखल करा",
    hindi: "पूछताछ फॉर्म सबमिट करें"
  },
  "form.submitting": {
    english: "Registering Student Details...",
    hinglish: "Enquiry Register Ho Rahi Hai...",
    marathi: "माहिती नोंदवली जात आहे...",
    hindi: "जानकारी दर्ज की जा रही है..."
  },
  "form.success": {
    english: "Admission Enquiry Submitted Successfully!",
    hinglish: "Form Submit Ho Gaya! Hamari Team aapse contact karegi.",
    marathi: "प्रवेश चौकशी अर्ज यशस्वीरित्या सादर करण्यात आला आहे!",
    hindi: "प्रवेश पूछताछ फॉर्म सफलतापूर्वक सबमिट हो गया है!"
  },

  // Study Tracker
  "tracker.title": {
    english: "Student Progress & Report Card",
    hinglish: "Student Progress Reports & Marks",
    marathi: "विद्यार्थी प्रगती अहवाल आणि गुणपत्रक",
    hindi: "छात्र प्रगति रिपोर्ट एवं अंकपत्र"
  },
  "tracker.sub": {
    english: "Track grades, class attendance, and digital homework submissions in real-time.",
    hinglish: "Apna marks, attendance, aur homework submission updates real-time me dekho.",
    marathi: "विद्यार्थ्यांची उपस्थिती, चाचणी गुण आणि गृहपाठ प्रगतीचे थेट विश्लेषण पहा.",
    hindi: "छात्रों की उपस्थिति, टेस्ट अंक और गृहकार्य प्रगति का लाइव ट्रैकिंग देखें।"
  },
  "tracker.select": {
    english: "Select Student to View Report",
    hinglish: "Kiske Reports Dekhne Hai?",
    marathi: "अहवाल पाहण्यासाठी विद्यार्थी निवडा",
    hindi: "रिपोर्ट देखने के लिए छात्र का चयन करें"
  },
  "tracker.no_data": {
    english: "No student records available. Apply for admission first!",
    hinglish: "Koi student record nahi mila. Pehle admission enquiry form fill kare!",
    marathi: "कोणताही विद्यार्थ्याचा रेकॉर्ड उपलब्ध नाही. कृपया आधी प्रवेश अर्ज भरा!",
    hindi: "कोई छात्र रिकॉर्ड उपलब्ध नहीं है। कृपया पहले प्रवेश फॉर्म भरें!"
  },
  "tracker.overall": {
    english: "Overall Statistics",
    hinglish: "Performance Stats",
    marathi: "एकूण कामगिरी आकडेवारी",
    hindi: "कुल प्रदर्शन आंकड़े"
  },
  "tracker.attendance": {
    english: "Attendance Average",
    hinglish: "Hajiri (Attendance %)",
    marathi: "सरासरी उपस्थिती",
    hindi: "औसत उपस्थिति"
  },
  "tracker.quiz": {
    english: "Avg Quiz Performance",
    hinglish: "Avg Quiz Marks",
    marathi: "चाचणीतील सरासरी कामगिरी",
    hindi: "क्विज का औसत प्रदर्शन"
  },
  "tracker.homework": {
    english: "Homework Completed",
    hinglish: "Homework Submissions",
    marathi: "पूर्ण केलेला गृहपाठ",
    hindi: "पूरा किया गया गृहकार्य"
  },
  "tracker.class": {
    english: "Class & Standard:",
    hinglish: "Class & Batch:",
    marathi: "इयत्ता व बॅच:",
    hindi: "कक्षा और बैच:"
  },
  "tracker.parent_ph": {
    english: "Parent Phone Number:",
    hinglish: "Ghar ka Phone:",
    marathi: "पालकांचा फोन नंबर:",
    hindi: "अभिभावक का फोन:"
  },
  "tracker.adm_date": {
    english: "Admission Date:",
    hinglish: "Admission Kab Hua:",
    marathi: "प्रवेश तारीख:",
    hindi: "प्रवेश तिथि:"
  },
  "tracker.fee_status": {
    english: "Fees Statement:",
    hinglish: "Fees Jama Detail:",
    marathi: "फी तपशील:",
    hindi: "फीस विवरण:"
  },
  "tracker.total_fee": {
    english: "Total Fees:",
    hinglish: "Total Fees Amount:",
    marathi: "एकूण फी आकारणी:",
    hindi: "कुल फीस:"
  },
  "tracker.paid_fee": {
    english: "Total Paid Fees:",
    hinglish: "Kirti Fees Jama Hui:",
    marathi: "भरलेली फी रक्कम:",
    hindi: "जमा की गई फीस:"
  },
  "tracker.pending_fee": {
    english: "Pending Balance Fees:",
    hinglish: "Pending Fees (Baki):",
    marathi: "उर्वरित फी रक्कम:",
    hindi: "शेष फीस राशि:"
  },

  // ERP Management
  "erp.title": {
    english: "Director Academic ERP System",
    hinglish: "Director Management Dashboard",
    marathi: "संचालकीय शैक्षणिक ईआरपी प्रणाली",
    hindi: "निदेशकीय शैक्षणिक ईआरपी प्रणाली"
  },
  "erp.sub": {
    english: "Official dashboard for managing student fees database, registering admissions, and managing reports.",
    hinglish: "Direct admin control panel fees collect karne aur students register karne ke liye.",
    marathi: "विद्यार्थी फी नोंदी, प्रवेश प्रक्रिया आणि अहवाल व्यवस्थापित करण्यासाठीचे मुख्य कार्यालयीन व्यासपीठ.",
    hindi: "छात्र फीस रिकॉर्ड, प्रवेश प्रक्रिया और रिपोर्ट प्रबंधित करने के लिए आधिकारिक प्रशासनिक पोर्टल।"
  },
  "erp.total_students": {
    english: "Total Admitted Students",
    hinglish: "Total Students",
    marathi: "एकूण प्रवेशित विद्यार्थी",
    hindi: "कुल प्रवेशित छात्र"
  },
  "erp.total_collected": {
    english: "Total Fees Collected",
    hinglish: "Paisa Collected",
    marathi: "एकूण गोळा झालेली फी",
    hindi: "कुल जमा हुई फीस"
  },
  "erp.total_pending": {
    english: "Pending Receivable Fees",
    hinglish: "Receivable Fees Baki",
    marathi: "एकूण येणे बाकी फी रक्कम",
    hindi: "कुल बकाया फीस राशि"
  },
  "erp.add_fee": {
    english: "Record Student Payment (Fee Receipt)",
    hinglish: "Receive Fees (Enter Receipt)",
    marathi: "नवीन फी पावती नोंदवा",
    hindi: "नई फीस रसीद दर्ज करें"
  },
  "erp.student_list": {
    english: "Academy Student Register & Master Directory",
    hinglish: "All Students Master Database",
    marathi: "विद्यार्थी हजेरी व मास्टर नोंदवही",
    hindi: "छात्र उपस्थिति और मास्टर रजिस्टर"
  },
  "erp.select_pay": {
    english: "Select Student:",
    hinglish: "Student Chune:",
    marathi: "विद्यार्थी निवडा:",
    hindi: "छात्र चुनें:"
  },
  "erp.amount": {
    english: "Amount Paid (₹):",
    hinglish: "Kitne Paise Diye (₹):",
    marathi: "भरलेली रक्कम (₹):",
    hindi: "जमा राशि (₹):"
  },
  "erp.mode": {
    english: "Payment Method / Mode:",
    hinglish: "Kise Pay Kiya:",
    marathi: "रक्कम भरण्याचा मार्ग:",
    hindi: "भुगतान का माध्यम:"
  },
  "erp.rec_by": {
    english: "Received By (Teacher/Staff Name):",
    hinglish: "Kisne Collect Kiya Name:",
    marathi: "रक्कम स्वीकारणारा अधिकारी:",
    hindi: "रसीद प्राप्तकर्ता अधिकारी:"
  },
  "erp.save_rec": {
    english: "Save Fee Receipt",
    hinglish: "Receipt Save Kare",
    marathi: "फी पावती जतन करा",
    hindi: "फीस रसीद सहेजें"
  },

  // LMS Study
  "lms.title": {
    english: "LMS E-Learning & Homework Center",
    hinglish: "LMS Padhai Content & Assignments",
    marathi: "डिजिटल एलएमएस अभ्यास केंद्र आणि गृहपाठ",
    hindi: "डिजिटल एलएमएस अध्ययन केंद्र और गृहकार्य"
  },
  "lms.sub": {
    english: "Watch digital syllabus lectures, download study notes, and view homework worksheets.",
    hinglish: "Yaha videos dekho, study notes download karo aur teacher dwara diye gaye assignments check karo.",
    marathi: "डिजिटल व्याख्याने पहा, अभ्यास नोट्स विनामूल्य डाउनलोड करा आणि गृहपाठ असाइनमेंट तपासा.",
    hindi: "डिजिटल वीडियो व्याख्यान देखें, अध्ययन नोट्स डाउनलोड करें और गृहकार्य असाइनमेंट जांचें।"
  },
  "lms.videos": {
    english: "Syllabus Video Lectures",
    hinglish: "Video Lectures",
    marathi: "अभ्यासक्रम व्हिडिओ व्याख्याने",
    hindi: "पाठ्यक्रम वीडियो व्याख्यान"
  },
  "lms.materials": {
    english: "Notes & Reference Documents",
    hinglish: "Notes & Material Downloads",
    marathi: "अभ्यास नोट्स व साहित्य पत्रके",
    hindi: "अध्ययन नोट्स और संदर्भ सामग्री"
  },
  "lms.assignments": {
    english: "Teacher Assignments & Home Tasks",
    hinglish: "Ghar ke Assignments & Homework",
    marathi: "शिक्षकांनी दिलेला गृहपाठ व आव्हाने",
    hindi: "शिक्षकों द्वारा दिया गया गृहकार्य और असाइनमेंट"
  },
  "lms.no_ass": {
    english: "No homework assignments posted for your standard yet.",
    hinglish: "Abhi tak koi homework nahi diya gaya hai.",
    marathi: "तुमच्या वर्गासाठी सध्या कोणताही गृहपाठ उपलब्ध नाही.",
    hindi: "आपकी कक्षा के लिए वर्तमान में कोई गृहकार्य उपलब्ध नहीं है।"
  },
  "lms.submit": {
    english: "Submit Hand-written Homework",
    hinglish: "Homework Submit Kare",
    marathi: "गृहपाठ उत्तर पाठवा",
    hindi: "गृहकार्य उत्तर सबमिट करें"
  },
  "lms.placeholder": {
    english: "Paste Google Drive, Dropbox, or text link of your solved copy...",
    hinglish: "Solves homework ka link yaha paste kare...",
    marathi: "तुमच्या गृहपाठाच्या फोटोची किंवा गुगल ड्राईव्हची लिंक येथे टाका...",
    hindi: "अपने हल किए गए गृहकार्य की गूगल ड्राइव या फोटो लिंक यहां डालें..."
  },
  "lms.send": {
    english: "Send Submissions",
    hinglish: "Answer Bheje",
    marathi: "उत्तर सादर करा",
    hindi: "उत्तर सबमिट करें"
  },

  // Live Whiteboard
  "live.title": {
    english: "Live Virtual Smart Classroom",
    hinglish: "Live Whiteboard Class & Interactive Chat",
    marathi: "थेट डिजिटल आभासी वर्ग",
    hindi: "लाइव डिजिटल वर्चुअल क्लास"
  },
  "live.sub": {
    english: "Interactive real-time whiteboard for live explanation with multi-student chatting desk.",
    hinglish: "Sath me milkar likhne aur doubt discuss karne ke liye live screen board.",
    marathi: "थेट स्पष्टीकरणासाठी संवादात्मक डिजिटल फलक आणि विद्यार्थी शंका निरसन मंच.",
    hindi: "लाइव शिक्षण के लिए इंटरैक्टिव डिजिटल बोर्ड और छात्र शंका समाधान डेस्क।"
  },
  "live.status": {
    english: "Class Live Stream Sync Active",
    hinglish: "Live Class Chalu Hai",
    marathi: "थेट वर्ग प्रसारण प्रणाली सक्रीय",
    hindi: "लाइव क्लास प्रसारण प्रणाली सक्रिय"
  },
  "live.chat": {
    english: "Student Interactive Chatroom Desk",
    hinglish: "Student Chatroom Room",
    marathi: "थेट शंका विचारणा दालन",
    hindi: "लाइव शंका समाधान चैट"
  },
  "live.send": {
    english: "Broadcast",
    hinglish: "Send Message",
    marathi: "पाठवा",
    hindi: "भेजें"
  },
  "live.placeholder": {
    english: "Type your query here for Rajesh Sir or Pratibha Ma'am...",
    hinglish: "Sir/Ma'am se kuch poochna hai? Type kare...",
    marathi: "शिक्षकांना विचारण्यासाठी तुमची शंका येथे लिहा...",
    hindi: "शिक्षकों से पूछने के लिए अपनी शंका यहां लिखें..."
  },

  // Practice Tests
  "quiz.title": {
    english: "Academy Mock Practice Center",
    hinglish: "Mock Tests & Quiz Hub",
    marathi: "अकॅडमी सराव परीक्षा केंद्र",
    hindi: "एकेडमी मॉक टेस्ट सेंटर"
  },
  "quiz.sub": {
    english: "Hone your accuracy using timed examinations curated by senior subject experts.",
    hinglish: "Timer ke sath mock questions try kare apni speed badhane ke liye.",
    marathi: "तज्ञ शिक्षकांनी तयार केलेल्या वेळेच्या मर्यादेत सराव चाचण्या सोडवून आपली प्रगती तपासा.",
    hindi: "अनुभवी शिक्षकों द्वारा तैयार टेस्ट को समय सीमा के भीतर हल कर अपना अभ्यास बढ़ाएं।"
  },
  "quiz.start": {
    english: "Start Timed Assessment",
    hinglish: "Test Start Kare",
    marathi: "सराव परीक्षा सुरू करा",
    hindi: "टेस्ट शुरू करें"
  },
  "quiz.duration": {
    english: "Duration Limit:",
    hinglish: "Time Limit:",
    marathi: "वेळेची मर्यादा:",
    hindi: "समय सीमा:"
  },
  "quiz.questions_count": {
    english: "Questions:",
    hinglish: "Sawal Kitne Hai:",
    marathi: "एकूण प्रश्न संख्या:",
    hindi: "कुल प्रश्न संख्या:"
  },
  "quiz.level": {
    english: "Focus Syllabus:",
    hinglish: "Batch Level:",
    marathi: "लक्षित अभ्यासक्रम:",
    hindi: "लक्षित पाठ्यक्रम:"
  },

  // AI Solver
  "ai.title": {
    english: "AI Doubt Solving Mentor",
    hinglish: "AI Doubt Solver & Study Assistant",
    marathi: "एआय २४/७ शंका निवारण मार्गदर्शक",
    hindi: "एआई 24/7 शंका समाधान मार्गदर्शक"
  },
  "ai.sub": {
    english: "Ask doubt regarding State board books or competitive papers and get explanation immediately.",
    hinglish: "Koi bhi mathematics, science, grammar ka doubt poocho aur instantly details solutions pao.",
    marathi: "गणित, विज्ञान किंवा व्याकरण संदर्भातील शंका विचारा आणि त्वरित विश्लेषण मिळवा.",
    hindi: "गणित, विज्ञान या व्याकरण संबंधी अपनी शंका पूछें और तुरंत सरल उत्तर पाएं।"
  },
  "ai.ask": {
    english: "Analyze & Solve Doubt",
    hinglish: "Doubt Solve Karo AI",
    marathi: "शंका विश्लेषण करा",
    hindi: "शंका का समाधान करें"
  },
  "ai.placeholder": {
    english: "Enter math equation, Marathi/English grammar question, or general knowledge question...",
    hinglish: "Apna question yaha likhe, maths, science kuch bhi...",
    marathi: "गणित सूत्र, इंग्रजी/मराठी व्याकरण किंवा स्पर्धा परीक्षेचा प्रश्न येथे लिहा...",
    hindi: "गणित सूत्र, अंग्रेजी/हिंदी व्याकरण या प्रतियोगी परीक्षा का प्रश्न यहां लिखें..."
  },
  "ai.sample": {
    english: "Try Sample Doubt Prompts:",
    hinglish: "Sample Questions:",
    marathi: "नमुना प्रश्न वापरून पहा:",
    hindi: "नमूना प्रश्न आजमाएं:"
  },
  "ai.response": {
    english: "AI Mentor Resolved Explanation",
    hinglish: "AI Mentor Solution",
    marathi: "एआय मार्गदर्शकाचे स्पष्टीकरण",
    hindi: "एआई मार्गदर्शक का स्पष्टीकरण"
  },

  // Passcode Modal
  "pass.admin_title": {
    english: "Director / Admin Portal",
    hinglish: "Director Admin Portal",
    marathi: "संचालक मुख्य दालन",
    hindi: "निदेशक मुख्य पोर्टल"
  },
  "pass.teacher_title": {
    english: "Teacher Portal",
    hinglish: "Teacher Access Portal",
    marathi: "शिक्षक अधिकृत दालन",
    hindi: "शिक्षक अधिकृत पोर्टल"
  },
  "pass.admin_desc": {
    english: "Enter the official security authorization passcode to unlock administrative privileges.",
    hinglish: "Admin passcode dalkar controls unlock kare.",
    marathi: "कार्यालयीन नियंत्रण मिळवण्यासाठी अधिकृत प्रशासकीय पासवर्ड प्रविष्ट करा.",
    hindi: "कार्यालयीन नियंत्रण प्राप्त करने के लिए आधिकारिक प्रशासनिक पासवर्ड दर्ज करें."
  },
  "pass.teacher_desc": {
    english: "Enter the official teacher authorization passcode to unlock classroom privileges.",
    hinglish: "Teacher security code dalkar login kare.",
    marathi: "अध्यापन व शैक्षणिक नियंत्रणासाठी अधिकृत शिक्षक पासवर्ड प्रविष्ट करा.",
    hindi: "शिक्षण और शैक्षणिक नियंत्रण के लिए आधिकारिक शिक्षक पासवर्ड दर्ज करें."
  },
  "pass.placeholder": {
    english: "Enter 5-digit passcode...",
    hinglish: "5-digit passcode dale...",
    marathi: "५-अंकी पासवर्ड प्रविष्ट करा...",
    hindi: "५-अंकीय पासवर्ड दर्ज करें..."
  }
};

export const getTranslation = (key: string, lang: Language): string => {
  const dictionary = TRANSLATIONS[key];
  if (!dictionary) return key;
  return dictionary[lang] || dictionary["english"] || key;
};
