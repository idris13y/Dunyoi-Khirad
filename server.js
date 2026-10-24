const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_FILE = '/app/data.json';

const DEFAULT_DATA = {
  groups: {
    "Upper-intermediate": {
      password: "upper123",
      teacher: "Sarah Jenkins",
      students: [
        { id: "s1", name: "Alexander Miller", lessons: ["92", "88", "95", "90", "85", "94", "91", "89", "96", "90", "92", "94", "98"], tests: ["90", "92", "94", "91", "95"], exams: ["94", "92", "95", "91", "96"] },
        { id: "s2", name: "Sophia Rakhimova", lessons: ["85", "87", "88", "92", "90", "89", "93", "85", "90", "88", "86", "92", "94"], tests: ["88", "86", "90", "89", "92"], exams: ["88", "90", "89", "92", "94"] },
        { id: "s3", name: "Daniel Kim", lessons: ["78", "82", "80", "85", "84", "88", "82", "80", "85", "87", "89", "90", "91"], tests: ["80", "84", "85", "88", "89"], exams: ["82", "85", "84", "88", "89"] }
      ]
    },
    "beginner": {
      password: "password",
      teacher: "Teacher F. Boymurodov",
      students: [
        { id: "s_b1", name: "Sardor Aliev", lessons: ["95", "90", "88", "92", "94", "89", "90", "88", "92", "91", "90", "95", "96"], tests: ["92", "90", "94", "88", "95"], exams: ["92", "90", "94", "88", "95"] },
        { id: "s_b2", name: "Idris Yorov", lessons: ["95", "92", "90", "94", "96", "98", "95", "92", "94", "90", "95", "96", "98"], tests: ["96", "94", "98", "95", "99"], exams: ["96", "95", "98", "94", "99"] }
      ]
    }
  },
  teachers: {
    "boymurodov": {
      username: "boymurodov",
      password: "password",
      name: "Teacher F. Boymurodov",
      assignedGroups: ["beginner", "Upper-intermediate"],
      canPublishNews: true
    },
    "sarahj": {
      username: "sarahj",
      password: "upper123",
      name: "Sarah Jenkins",
      assignedGroups: ["Upper-intermediate"],
      canPublishNews: false
    }
  },
  news: [
    {
      id: "news_1",
      title: "Autumn Speaking Competition Winners!",
      date: "October 16, 2026",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
      content: "Congratulations to our students who took top spots in the Regional English Debate Forum. Certificates and prizes were awarded today in the main hall of Dunyoi Khirad."
    },
    {
      id: "news_2",
      title: "Mid-Term Examination Schedule Released",
      date: "October 10, 2026",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80",
      content: "All Dunyoi Khirad groups are requested to review their upcoming test timelines. Preparation sessions will be held on Saturdays."
    }
  ],
  library: [
    {
      id: "lib_1",
      title: "English Grammar in Use (5th Edition)",
      type: "pdf",
      category: "Grammar & Reference",
      author: "Raymond Murphy",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      size: "14.2 MB",
      description: "Essential grammar reference and practice guide for intermediate students with exercises and answer keys."
    },
    {
      id: "lib_2",
      title: "Cambridge IELTS 18 Academic Practice Tests",
      type: "pdf",
      category: "Exam Preparation",
      author: "Cambridge English",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      size: "9.5 MB",
      description: "Official practice examination papers with detailed explanations and model essay responses."
    },
    {
      id: "lib_3",
      title: "Listening Comprehension Track 01 - Campus Life",
      type: "audio",
      category: "Listening Practice",
      author: "Dunyoi Khirad Audio Lab",
      fileUrl: "https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg",
      duration: "03:45",
      description: "Authentic conversational listening dialogue for Upper-intermediate comprehension tasks."
    },
    {
      id: "lib_4",
      title: "Pronunciation & Connected Speech Audio Track 02",
      type: "audio",
      category: "Phonetics & Speaking",
      author: "Dunyoi Khirad Audio Lab",
      fileUrl: "https://actions.google.com/sounds/v1/ambiences/office_room.ogg",
      duration: "04:15",
      description: "Intonation, rhythm, and clear accent coaching audio lesson with pause-and-repeat drills."
    }
  ],
  about: {
    llcName: "Dunyoi Khirad LLC (ҶДММ \"Дунёи Хирад\")",
    licenseNumber: "ED-2023-TJ-94812",
    foundedYear: "2020",
    photoUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80",
    photoCaption: "Main Educational Campus & Administrative Headquarters of Dunyoi Khirad LLC",
    tagline: "Nurturing Intellectual Excellence, Multilingual Mastery, and Global Academic Foundations",
    overview: "Dunyoi Khirad LLC is a premier certified educational center in Tajikistan, dedicated to empowering students with advanced linguistic fluency, STEM competency, and competitive exam mastery through disciplined pedagogy and modern digital tools.",
    mission: "To cultivate analytical minds, fluent global communicators, and morally upright leaders by providing world-class educational programs, innovative technologies, and personalized academic mentorship.",
    vision: "To stand as the benchmark educational institution recognized for transformative learning outcomes, exceptional university admissions, and community-driven educational excellence.",
    phone: "+992 (44) 600-13-13 / +992 (90) 131-30-00",
    email: "info@dnyoikhirad.tj",
    address: "14 Rudaki Avenue, 3rd Floor, Dunyoi Khirad Education Center",
    workingHours: "Monday - Saturday: 08:00 AM - 08:00 PM (Sunday: Intensive Seminars & Clubs)",
    director: "Academic Council & Administration"
  }
};

function normalizeData(data) {
  if (!data) return DEFAULT_DATA;
  if (!data.groups) data.groups = DEFAULT_DATA.groups;
  if (!data.teachers) data.teachers = DEFAULT_DATA.teachers;
  if (!data.news) data.news = DEFAULT_DATA.news;
  if (!data.library) data.library = DEFAULT_DATA.library;
  if (!data.about) data.about = DEFAULT_DATA.about;

  // Ensure every student has exams array
  for (const groupKey in data.groups) {
    const grp = data.groups[groupKey];
    if (grp && Array.isArray(grp.students)) {
      grp.students.forEach(s => {
        if (!s.lessons) s.lessons = Array(13).fill("");
        if (!s.tests) s.tests = Array(5).fill("");
        if (!s.exams) s.exams = Array(5).fill("");
      });
    }
  }

  // Ensure every teacher has assignedGroups as an array
  for (const tKey in data.teachers) {
    const teacher = data.teachers[tKey];
    if (teacher) {
      if (!Array.isArray(teacher.assignedGroups)) {
        teacher.assignedGroups = teacher.assignedGroup ? [teacher.assignedGroup] : [];
      }
    }
  }

  return data;
}

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      return normalizeData(data);
    }
  } catch (err) {
    console.error("Error reading data file:", err);
  }
  return DEFAULT_DATA;
}

function saveData(data) {
  try {
    normalizeData(data);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error("Error saving data file:", err);
  }
}

if (!fs.existsSync(DATA_FILE)) {
  saveData(DEFAULT_DATA);
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', name: 'Dunyoi Khirad', time: new Date().toISOString() }));
    return;
  }

  // API endpoints
  if (req.url === '/api/data' && req.method === 'GET') {
    const data = loadData();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
    return;
  }

  if (req.url === '/api/save' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        const currentData = loadData();
        if (parsed.groups) currentData.groups = parsed.groups;
        if (parsed.teachers) currentData.teachers = parsed.teachers;
        if (parsed.news) currentData.news = parsed.news;
        if (parsed.library) currentData.library = parsed.library;
        if (parsed.about) currentData.about = parsed.about;
        saveData(currentData);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // Serve Main Web Application HTML
  const initialData = loadData();
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dunyoi Khirad | Academic Portal</title>
  <meta name="description" content="Academic portal for Dunyoi Khirad Educational Center featuring 13-lesson gradebooks, official exam marks, digital library, and multi-class teacher management.">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .mark-input:focus { outline: 2px solid #4f46e5; background-color: #eef2ff; }
    @media print {
      body { background: white !important; color: black !important; }
      header, #mobileNav, #unauthorizedNotice, .no-print { display: none !important; }
      main { max-width: 100% !important; padding: 0 !important; }
      .print-page { display: block !important; }
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen flex flex-col antialiased">

  <!-- ================= TOP NAVIGATION BAR ================= -->
  <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      
      <!-- Logo & Title -->
      <div class="flex items-center space-x-3 cursor-pointer select-none" onclick="switchTab('news')">
        <div class="h-11 w-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-100">
          🎓
        </div>
        <div>
          <span class="text-xl font-bold tracking-tight text-slate-900 block leading-tight">Dunyoi Khirad</span>
          <span class="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Educational Center</span>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="hidden lg:flex items-center space-x-1" id="navLinks">
        <button onclick="switchTab('news')" id="tab-news" class="px-3.5 py-2 rounded-lg font-semibold text-sm transition text-indigo-600 bg-indigo-50">
          📰 News
        </button>
        <button onclick="switchTab('lessons')" id="tab-lessons" class="px-3.5 py-2 rounded-lg font-semibold text-sm transition text-slate-600 hover:text-indigo-600 hover:bg-slate-50">
          📝 Lesson Marks (1-13)
        </button>
        <button onclick="switchTab('tests')" id="tab-tests" class="px-3.5 py-2 rounded-lg font-semibold text-sm transition text-slate-600 hover:text-indigo-600 hover:bg-slate-50">
          📊 Test Marks
        </button>
        <button onclick="switchTab('exams')" id="tab-exams" class="px-3.5 py-2 rounded-lg font-semibold text-sm transition text-slate-600 hover:text-indigo-600 hover:bg-slate-50">
          🏆 Exam Marks
        </button>
        <button onclick="switchTab('library')" id="tab-library" class="px-3.5 py-2 rounded-lg font-semibold text-sm transition text-slate-600 hover:text-indigo-600 hover:bg-slate-50">
          📚 Library & Audio
        </button>
        <button onclick="switchTab('about')" id="tab-about" class="px-3.5 py-2 rounded-lg font-semibold text-sm transition text-slate-600 hover:text-indigo-600 hover:bg-slate-50">
          🏛️ About us
        </button>
        <button onclick="switchTab('admin')" id="tab-admin" class="hidden px-3.5 py-2 rounded-lg font-semibold text-sm transition text-slate-600 hover:text-indigo-600 hover:bg-slate-50">
          ⚙️ Manage
        </button>
      </nav>

      <!-- Auth & Save Status Pill -->
      <div class="flex items-center space-x-3">
        <!-- Live Instant Auto-Save Indicator -->
        <div id="realtimeSavePill" class="hidden sm:flex items-center space-x-1 text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span id="saveStatusText">Saved</span>
        </div>

        <div id="userBadge" class="hidden text-right">
          <div class="text-[11px] font-semibold text-slate-400">Account:</div>
          <div id="userDisplayRole" class="text-xs font-bold text-indigo-700 max-w-[130px] truncate">Admin</div>
        </div>
        
        <button id="loginBtn" onclick="openLoginModal()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition shadow-sm shadow-indigo-100">
          Sign In
        </button>
        <button id="logoutBtn" onclick="logout()" class="hidden px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 font-semibold text-xs transition">
          Log Out
        </button>
      </div>
    </div>

    <!-- Mobile Subnav Bar -->
    <div id="mobileNav" class="lg:hidden flex overflow-x-auto border-t border-slate-100 px-3 py-2 space-x-1.5 bg-white scrollbar-none">
      <button onclick="switchTab('news')" id="mob-tab-news" class="whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 bg-indigo-50">📰 News</button>
      <button onclick="switchTab('lessons')" id="mob-tab-lessons" class="whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600">📝 Lessons</button>
      <button onclick="switchTab('tests')" id="mob-tab-tests" class="whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600">📊 Tests</button>
      <button onclick="switchTab('exams')" id="mob-tab-exams" class="whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600">🏆 Exams</button>
      <button onclick="switchTab('library')" id="mob-tab-library" class="whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600">📚 Library</button>
      <button onclick="switchTab('about')" id="mob-tab-about" class="whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600">🏛️ About us</button>
      <button onclick="switchTab('admin')" id="mob-tab-admin" class="hidden whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600">⚙️ Manage</button>
    </div>
  </header>

  <!-- ================= NOTIFICATION TOAST ================= -->
  <div id="toast" class="fixed bottom-6 right-6 z-50 transform translate-y-20 opacity-0 transition-all duration-300 pointer-events-none bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-2.5 text-sm font-medium">
    <span id="toastIcon">✅</span>
    <span id="toastMsg">Saved successfully</span>
  </div>

  <!-- ================= DELETE CONFIRMATION MODAL ================= -->
  <div id="deleteConfirmModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 hidden flex items-center justify-center p-4">
    <div class="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 text-center">
      <div class="h-12 w-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-2xl font-bold mb-3">🗑️</div>
      <h4 class="text-base font-bold text-slate-900 mb-1">Remove Student?</h4>
      <p id="deleteConfirmStudentName" class="text-xs text-slate-500 mb-5">Are you sure you want to delete this student?</p>
      <div class="flex items-center space-x-2">
        <button onclick="closeDeleteConfirmModal()" class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50">Cancel</button>
        <button id="btnConfirmDeleteStudent" class="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm">Delete</button>
      </div>
    </div>
  </div>

  <!-- ================= EDIT TEACHER CLASSES MODAL ================= -->
  <div id="editTeacherModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 hidden flex items-center justify-center p-4">
    <div class="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
      <div class="flex justify-between items-center mb-4">
        <div>
          <h3 class="text-base font-bold text-slate-900">Manage Assigned Classes</h3>
          <p id="editTeacherSubtitle" class="text-xs text-slate-500 mt-0.5">Select multiple classes for this teacher</p>
        </div>
        <button onclick="closeEditTeacherModal()" class="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
      </div>

      <input type="hidden" id="editTeacherUsername" value="">

      <div class="mb-4">
        <label class="block text-xs font-bold text-slate-600 mb-2">Assigned Classes (Select 1, 2, or more classes):</label>
        <div id="editTeacherClassCheckboxes" class="space-y-2 max-h-48 overflow-y-auto p-3 bg-slate-50 border border-slate-200 rounded-xl"></div>
      </div>

      <div class="flex items-center space-x-2">
        <button onclick="closeEditTeacherModal()" class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50">Cancel</button>
        <button onclick="saveTeacherAssignedClasses()" class="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm">Save Classes</button>
      </div>
    </div>
  </div>

  <!-- ================= MAIN CONTENT AREA ================= -->
  <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

    <!-- 1. NEWS PAGE (Visible to all, editable ONLY by Admin & Teacher Boymurodov) -->
    <section id="view-news" class="space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div class="flex items-center space-x-2">
            <span class="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wide">Bulletin</span>
            <span class="text-xs text-slate-400">Dunyoi Khirad Official Announcements</span>
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 mt-1">Dunyoi Khirad Announcements & News</h1>
          <p class="text-xs text-slate-500 mt-0.5">Stay informed with latest notices, exams, and competitions.</p>
        </div>
        
        <!-- Post button visible only to Admin and Teacher Boymurodov -->
        <button id="btnCreateNews" onclick="openNewsModal()" class="hidden px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center space-x-1.5">
          <span>➕</span>
          <span>Publish Announcement</span>
        </button>
      </div>

      <div id="newsFeed" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
    </section>

    <!-- 2. LESSON MARKS PAGE (Real-time auto-saving) -->
    <section id="view-lessons" class="hidden space-y-6">
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center space-x-2">
            <span class="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wide">13 Lessons Register</span>
            <span id="currentGroupBadge" class="text-xs font-bold text-slate-600">Group: Upper-intermediate</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">Student Attendance & Lesson Marks</h2>
          <p class="text-xs text-slate-500 mt-0.5">
            <span class="font-semibold text-emerald-600">⚡ Live Instant Save:</span> Type marks (1-100). Average calculates and saves immediately.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Multi-class selector for Admin and Teachers -->
          <div id="groupSelectorContainer" class="flex items-center space-x-2">
            <label class="text-xs font-bold text-slate-500">Class:</label>
            <select id="headTeacherGroupSelect" onchange="changeActiveGroup(this.value)" class="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-slate-50 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none">
            </select>
          </div>

          <button onclick="addStudentRow('lesson')" class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition">
            + Add Student
          </button>
          <button onclick="manualSaveMarks('lesson')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center space-x-1.5">
            <span>💾</span>
            <span>Save Marks</span>
          </button>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                <th class="p-3 w-10 text-center">#</th>
                <th class="p-3 min-w-[190px]">Student Full Name</th>
                <th class="p-2 text-center w-11">L1</th>
                <th class="p-2 text-center w-11">L2</th>
                <th class="p-2 text-center w-11">L3</th>
                <th class="p-2 text-center w-11">L4</th>
                <th class="p-2 text-center w-11">L5</th>
                <th class="p-2 text-center w-11">L6</th>
                <th class="p-2 text-center w-11">L7</th>
                <th class="p-2 text-center w-11">L8</th>
                <th class="p-2 text-center w-11">L9</th>
                <th class="p-2 text-center w-11">L10</th>
                <th class="p-2 text-center w-11">L11</th>
                <th class="p-2 text-center w-11">L12</th>
                <th class="p-2 text-center w-11">L13</th>
                <th class="p-3 text-center min-w-[70px]">Avg</th>
                <th class="p-3 text-center w-12">Del</th>
              </tr>
            </thead>
            <tbody id="lessonMarksTableBody" class="divide-y divide-slate-100 font-medium"></tbody>
          </table>
        </div>
      </div>
      <div class="flex justify-between items-center text-xs text-slate-500 px-2">
        <span>* Maximum 20 students per group class register. Marks save on input.</span>
        <span id="studentCountBadge" class="font-bold text-slate-700">0 / 20 Students</span>
      </div>
    </section>

    <!-- 3. TEST MARKS PAGE (Real-time auto-saving) -->
    <section id="view-tests" class="hidden space-y-6">
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center space-x-2">
            <span class="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wide">Examinations</span>
            <span id="currentTestGroupBadge" class="text-xs font-bold text-slate-600">Group: Upper-intermediate</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">Official Test & Quiz Marks</h2>
          <p class="text-xs text-slate-500 mt-0.5">Quiz 1, Test 1, Midterm Exam, Test 2, and Final Exam grading.</p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Class selector for Tests -->
          <div id="testGroupSelectorContainer" class="flex items-center space-x-2">
            <label class="text-xs font-bold text-slate-500">Class:</label>
            <select id="testHeadTeacherGroupSelect" onchange="changeActiveGroup(this.value)" class="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-slate-50 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none">
            </select>
          </div>

          <button onclick="addStudentRow('test')" class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition">
            + Add Student
          </button>
          <button onclick="manualSaveMarks('test')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center space-x-1.5">
            <span>💾</span>
            <span>Save Test Marks</span>
          </button>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                <th class="p-3 w-10 text-center">#</th>
                <th class="p-3 min-w-[210px]">Student Full Name</th>
                <th class="p-2 text-center min-w-[90px]">Quiz 1</th>
                <th class="p-2 text-center min-w-[90px]">Test 1</th>
                <th class="p-2 text-center min-w-[90px]">Midterm Exam</th>
                <th class="p-2 text-center min-w-[90px]">Test 2</th>
                <th class="p-2 text-center min-w-[90px]">Final Exam</th>
                <th class="p-3 text-center min-w-[90px]">Total Score</th>
                <th class="p-3 text-center w-12">Del</th>
              </tr>
            </thead>
            <tbody id="testMarksTableBody" class="divide-y divide-slate-100 font-medium"></tbody>
          </table>
        </div>
      </div>
      <div class="flex justify-between items-center text-xs text-slate-500 px-2">
        <span>* Test marks save automatically upon input.</span>
        <span id="testStudentCountBadge" class="font-bold text-slate-700">0 / 20 Students</span>
      </div>
    </section>

    <!-- 4. EXAM MARKS PAGE (Identical interactive table & live saving like other mark pages!) -->
    <section id="view-exams" class="hidden space-y-6">
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center space-x-2">
            <span class="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wide">Dunyoi Khirad Examinations</span>
            <span id="currentExamGroupBadge" class="text-xs font-bold text-slate-600">Group: Upper-intermediate</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">Official Exam Marks Register</h2>
          <p class="text-xs text-slate-500 mt-0.5">
            <span class="font-semibold text-emerald-600">⚡ Live Instant Save:</span> Enter exam marks (0-100). Grades, averages, and rankings save immediately.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Class selector for Exams -->
          <div id="examGroupSelectorContainer" class="flex items-center space-x-2">
            <label class="text-xs font-bold text-slate-500">Class:</label>
            <select id="examHeadTeacherGroupSelect" onchange="changeActiveGroup(this.value)" class="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-slate-50 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none">
            </select>
          </div>

          <button onclick="addStudentRow('exam')" class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition">
            + Add Student
          </button>
          <button onclick="manualSaveMarks('exam')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center space-x-1.5">
            <span>💾</span>
            <span>Save Exam Marks</span>
          </button>
          <button onclick="window.print()" class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center space-x-1.5 transition no-print">
            <span>🖨️</span>
            <span>Print Sheet</span>
          </button>
        </div>
      </div>

      <!-- Quick Summary Metric Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Students in Exam</div>
          <div id="statTotalStudents" class="text-2xl font-extrabold text-slate-900 mt-1">0</div>
        </div>
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Class Exam Average</div>
          <div id="statClassAvg" class="text-2xl font-extrabold text-emerald-600 mt-1">-</div>
        </div>
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Top Exam Performer</div>
          <div id="statTopStudent" class="text-base font-extrabold text-indigo-600 mt-1 truncate">-</div>
        </div>
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pass Rate (≥60%)</div>
          <div id="statPassRate" class="text-2xl font-extrabold text-emerald-600 mt-1">-</div>
        </div>
      </div>

      <!-- Interactive Exam Marks Table (Just like lesson & test marks!) -->
      <div class="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                <th class="p-3 w-10 text-center">#</th>
                <th class="p-3 min-w-[200px]">Student Full Name</th>
                <th class="p-2 text-center min-w-[85px]">Exam 1</th>
                <th class="p-2 text-center min-w-[85px]">Exam 2</th>
                <th class="p-2 text-center min-w-[95px]">Midterm Exam</th>
                <th class="p-2 text-center min-w-[85px]">Exam 4</th>
                <th class="p-2 text-center min-w-[95px]">Final Exam</th>
                <th class="p-3 text-center min-w-[90px]">Average</th>
                <th class="p-3 text-center min-w-[120px]">Evaluation</th>
                <th class="p-3 text-center w-12">Del</th>
              </tr>
            </thead>
            <tbody id="examMarksTableBody" class="divide-y divide-slate-100 font-medium"></tbody>
          </table>
        </div>
      </div>
      <div class="flex justify-between items-center text-xs text-slate-500 px-2">
        <span>* Real-time sync: Exam marks (0-100) are saved without refreshing the page.</span>
        <span id="examStudentCountBadge" class="font-bold text-slate-700">0 / 20 Students</span>
      </div>
    </section>

    <!-- 5. DIGITAL LIBRARY PAGE (PDF Books & Audio Lessons) -->
    <section id="view-library" class="space-y-6">
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div class="flex items-center space-x-2">
            <span class="px-2.5 py-0.5 rounded-md bg-violet-100 text-violet-800 text-xs font-bold uppercase tracking-wide">Dunyoi Khirad Hub</span>
            <span class="text-xs text-slate-400">Open Downloads</span>
          </div>
          <h2 class="text-2xl font-extrabold text-slate-900 mt-1">Academic Library & Audio Laboratory</h2>
          <p class="text-xs text-slate-500 mt-0.5">Free access to textbooks, IELTS mock kits, pronunciation guides, and listening tracks.</p>
        </div>

        <!-- Add Material button visible to ADMIN ONLY -->
        <button id="btnCreateLibraryItem" onclick="openLibraryModal()" class="hidden px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center space-x-1.5">
          <span>➕</span>
          <span>Add Book / Audio</span>
        </button>
      </div>

      <!-- Filter bar -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div class="flex items-center space-x-2" id="libraryFilterTabs">
          <button onclick="filterLibrary('all')" id="lib-filter-all" class="px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 bg-indigo-50">All Materials</button>
          <button onclick="filterLibrary('pdf')" id="lib-filter-pdf" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50">📚 PDF Books</button>
          <button onclick="filterLibrary('audio')" id="lib-filter-audio" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50">🎧 Audio Tracks</button>
        </div>
        <input type="text" id="libSearchInput" oninput="renderLibrary()" placeholder="Search title, author, topic..." class="text-xs px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-64">
      </div>

      <div id="libraryFeed" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
    </section>

    <!-- 6. ADMIN PANEL (Manage Groups & Multi-Class Teacher Accounts) -->
    <section id="view-admin" class="hidden space-y-6">
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 class="text-2xl font-extrabold text-slate-900">Administrator Console</h2>
        <p class="text-xs text-slate-500 mt-1">Manage class groups, assign teachers to multiple classes (more than 2 classes), grant news publishing privileges, and monitor all center activity.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Forms Column -->
        <div class="space-y-6">
          <!-- Create Group Form -->
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 class="text-base font-bold text-slate-900 mb-3 flex items-center space-x-2">
              <span>➕</span>
              <span>Register New Class Group</span>
            </h3>
            <form onsubmit="handleCreateGroup(event)" class="space-y-3.5">
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1">Group Name / Class ID</label>
                <input type="text" id="newGroupName" required placeholder="e.g. IELTS-Advanced, Beginners-A" class="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1">Assigned Group Password</label>
                <input type="text" id="newGroupPass" required placeholder="Create password" class="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1">Teacher's Name</label>
                <input type="text" id="newGroupTeacher" required placeholder="e.g. Teacher Boymurodov" class="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none">
              </div>
              <button type="submit" class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition">
                Create Group & Initialize Register
              </button>
            </form>
          </div>

          <!-- Create Teacher Account Form (Supports more than 2 classes!) -->
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 class="text-base font-bold text-slate-900 mb-3 flex items-center space-x-2">
              <span>👨‍🏫</span>
              <span>Create Teacher Account</span>
            </h3>
            <form onsubmit="handleCreateTeacher(event)" class="space-y-3.5">
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1">Teacher Full Name</label>
                <input type="text" id="teacherFullName" required placeholder="e.g. Teacher Boymurodov" class="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1">Login Username</label>
                <input type="text" id="teacherUsername" required placeholder="e.g. boymurodov" class="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1">Password</label>
                <input type="text" id="teacherPassword" required placeholder="Create teacher password" class="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none">
              </div>

              <!-- Multi-class selection (can select 1, 2, 3, or more classes) -->
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="block text-xs font-bold text-slate-600">Assigned Classes (Select 1, 2, or more):</label>
                  <button type="button" onclick="toggleSelectAllTeacherClasses()" class="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold">Select All</button>
                </div>
                <div id="teacherClassCheckboxes" class="space-y-1.5 max-h-36 overflow-y-auto p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <!-- Generated dynamically from all active groups -->
                </div>
                <p class="text-[11px] text-slate-400 mt-1">Teachers can put marks for all checked classes.</p>
              </div>

              <div class="flex items-center space-x-2 pt-1">
                <input type="checkbox" id="teacherCanPublishNews" class="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4">
                <label for="teacherCanPublishNews" class="text-xs font-semibold text-slate-700 select-none cursor-pointer">Allow publishing news & announcements</label>
              </div>
              <button type="submit" class="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-xs transition">
                Create Teacher Account
              </button>
            </form>
          </div>
        </div>

        <!-- Management Lists Column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Active Groups List -->
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 class="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
              <span>Active Classes in Dunyoi Khirad</span>
              <span id="adminTotalGroupsBadge" class="text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">0</span>
            </h3>
            <div id="groupList" class="space-y-3"></div>
          </div>

          <!-- Active Teachers List -->
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 class="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
              <span>Registered Teacher Accounts & Assigned Classes</span>
              <span id="adminTotalTeachersBadge" class="text-xs px-2 py-0.5 rounded bg-violet-50 text-violet-700 font-bold">0</span>
            </h3>
            <div id="teacherList" class="space-y-3"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. ABOUT US PAGE (Visible to all, contains full educational information & LLC Photo showcase) -->
    <section id="view-about" class="hidden space-y-8">
      <!-- Hero Banner -->
      <div class="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-indigo-700/30">
        <div class="relative z-10 max-w-3xl">
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <span class="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-bold border border-white/15 tracking-wide">
              🏛️ Licensed Educational LLC
            </span>
            <span class="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              License № ED-2023-TJ-94812
            </span>
            <span class="px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              Est. 2020
            </span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            ҶДММ "Дунёи Хирад"
            <span class="block text-indigo-300 text-xl sm:text-2xl font-bold mt-1">Dunyoi Khirad Educational Center LLC</span>
          </h1>
          <p class="text-indigo-100 text-sm sm:text-base leading-relaxed">
            Nurturing intellectual mastery, global language proficiency, and disciplined academic foundations. Dunyoi Khirad LLC operates as a premier educational institute committed to excellence, transparent student evaluation, and high-impact university preparation.
          </p>
        </div>
        <!-- Decorative subtle background badge -->
        <div class="absolute -right-8 -bottom-10 opacity-10 text-9xl select-none pointer-events-none font-serif">
          🎓
        </div>
      </div>

      <!-- LLC PHOTO SHOWCASE CONTAINER -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md">Official Photography</span>
              <span class="text-xs text-slate-400">Headquarters & Facility</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">LLC Photo & Campus Facility</h2>
            <p class="text-xs text-slate-500 mt-0.5">Official photo of Dunyoi Khirad LLC educational headquarters and classroom facilities.</p>
          </div>

          <!-- LLC Photo Controls / Upload Button -->
          <div class="flex flex-wrap items-center gap-2">
            <button onclick="toggleLLCPhotoEditor()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition flex items-center space-x-1.5 cursor-pointer">
              <span>📸</span>
              <span>Change / Put LLC Photo</span>
            </button>
            <button onclick="resetDefaultLLCPhoto()" class="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs transition cursor-pointer">
              Reset Photo
            </button>
          </div>
        </div>

        <!-- Interactive Photo Upload & Edit Card (Collapsible) -->
        <div id="llcPhotoEditorCard" class="hidden p-5 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-4">
          <div class="flex justify-between items-center">
            <h4 class="text-sm font-bold text-indigo-950 flex items-center space-x-2">
              <span>🖼️</span>
              <span>Put / Update Center LLC Photo</span>
            </h4>
            <button onclick="toggleLLCPhotoEditor()" class="text-xs text-indigo-700 hover:text-indigo-900 font-bold cursor-pointer">Close Editor &times;</button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Method 1: Upload from Device -->
            <div class="bg-white p-4 rounded-xl border border-indigo-100 shadow-2xs">
              <label class="block text-xs font-bold text-slate-800 mb-1">Option A: Upload File from Computer / Mobile</label>
              <p class="text-[11px] text-slate-500 mb-3">Select your official LLC certificate, campus entrance, or classroom photo (JPG, PNG, WebP).</p>
              <input type="file" id="llcPhotoFileInput" accept="image/*" onchange="handleUploadLLCPhotoFile(event)" class="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 file:cursor-pointer cursor-pointer">
            </div>

            <!-- Method 2: Paste Photo URL -->
            <div class="bg-white p-4 rounded-xl border border-indigo-100 shadow-2xs">
              <label class="block text-xs font-bold text-slate-800 mb-1">Option B: Enter Web Image URL</label>
              <p class="text-[11px] text-slate-500 mb-2">Paste a public web link to the LLC photo or certificate.</p>
              <div class="flex space-x-2">
                <input type="url" id="llcPhotoUrlInput" placeholder="https://..." class="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none">
                <button onclick="handleSaveLLCPhotoUrl()" class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition cursor-pointer">Apply</button>
              </div>
            </div>
          </div>

          <!-- Photo Caption Input -->
          <div class="bg-white p-4 rounded-xl border border-indigo-100 shadow-2xs flex flex-col sm:flex-row gap-3 items-end">
            <div class="flex-1 w-full">
              <label class="block text-xs font-bold text-slate-800 mb-1">Photo Description & Caption</label>
              <input type="text" id="llcPhotoCaptionInput" placeholder="e.g. Main Educational Campus & Administrative Headquarters of Dunyoi Khirad LLC" class="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none">
            </div>
            <button onclick="handleSaveLLCCaption()" class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer">Save Caption</button>
          </div>
        </div>

        <!-- The Displayed LLC Photo Frame -->
        <div class="relative group rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-950 shadow-md">
          <div class="aspect-16/9 sm:aspect-21/9 w-full overflow-hidden bg-slate-900 relative">
            <img id="llcPhotoDisplay" src="https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80" alt="Dunyoi Khirad LLC Photo" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none"></div>
            
            <!-- Verified LLC Badge Overlay -->
            <div class="absolute top-4 left-4 flex items-center space-x-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-white">
              <span class="text-base">🏢</span>
              <div>
                <span class="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider block">Official Location</span>
                <span class="text-xs font-bold text-slate-900">Dunyoi Khirad LLC</span>
              </div>
            </div>

            <!-- Quick Change Overlay Button on Hover -->
            <button onclick="toggleLLCPhotoEditor()" class="absolute top-4 right-4 bg-slate-900/80 hover:bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md transition flex items-center space-x-1.5 border border-white/20 cursor-pointer">
              <span>📷</span>
              <span>Edit / Put Photo</span>
            </button>
          </div>

          <!-- Caption & Verification Bar -->
          <div class="p-4 bg-slate-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <p id="llcPhotoCaptionDisplay" class="text-xs font-medium text-slate-300">
              Main Educational Campus & Administrative Headquarters of Dunyoi Khirad LLC
            </p>
            <div class="flex items-center space-x-2 text-[11px] text-emerald-400 font-semibold">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Verified Institutional Record</span>
            </div>
          </div>
        </div>
      </div>

      <!-- KEY METRICS STATS -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-2xs">
          <div class="text-3xl font-extrabold text-indigo-600">98.4%</div>
          <div class="text-xs font-bold text-slate-700 mt-1">Official Exam Pass Rate</div>
          <div class="text-[11px] text-slate-400 mt-0.5">Rigorous standards</div>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-2xs">
          <div class="text-3xl font-extrabold text-violet-600">1,200+</div>
          <div class="text-xs font-bold text-slate-700 mt-1">Graduated Students</div>
          <div class="text-[11px] text-slate-400 mt-0.5">Since founding 2020</div>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-2xs">
          <div class="text-3xl font-extrabold text-emerald-600">15+</div>
          <div class="text-xs font-bold text-slate-700 mt-1">Certified Instructors</div>
          <div class="text-[11px] text-slate-400 mt-0.5">Top-tier pedagogical staff</div>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-2xs">
          <div class="text-3xl font-extrabold text-amber-600">13 Lessons</div>
          <div class="text-xs font-bold text-slate-700 mt-1">Evaluation Cycle</div>
          <div class="text-[11px] text-slate-400 mt-0.5">Daily & test mark tracking</div>
        </div>
      </div>

      <!-- INSTITUTIONAL INFORMATION SECTIONS -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Mission, Vision & Values (2 Cols) -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Overview Card -->
          <div class="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 class="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span>📖</span>
              <span>About Dunyoi Khirad LLC</span>
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Dunyoi Khirad LLC (ҶДММ "Дунёи Хирад") is a recognized leader in modern educational services, specializing in accelerated language acquisition, STEM foundation building, and competitive academic test preparation. Established with a philosophy of high educational rigor and continuous assessment, our center provides learners with the skills and discipline required to excel in regional Olympiads, international language tests (IELTS/TOEFL), and top university programs.
            </p>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Our center combines traditional teaching excellence with digital evaluation systems—including our proprietary 13-lesson continuous marking system, specialized digital listening laboratory, and comprehensive academic library.
            </p>
          </div>

          <!-- Mission & Vision Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 space-y-2">
              <div class="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs">🎯</div>
              <h4 class="text-sm font-bold text-slate-900">Our Mission</h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                To cultivate analytical minds, fluent global communicators, and morally upright leaders through disciplined pedagogical systems, state-of-the-art curriculum, and personalized guidance for each student.
              </p>
            </div>
            <div class="bg-violet-50/50 p-5 rounded-2xl border border-violet-100 space-y-2">
              <div class="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold text-base shadow-xs">🔭</div>
              <h4 class="text-sm font-bold text-slate-900">Our Vision</h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                To stand as the benchmark educational institution in Central Asia, recognized for transformative learning outcomes, exceptional university admissions, and community-driven educational advancement.
              </p>
            </div>
          </div>

          <!-- Academic Departments & Programs -->
          <div class="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 class="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span>📚</span>
              <span>Core Academic Programs & Departments</span>
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div class="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60">
                <div class="text-xs font-bold text-indigo-700 mb-1">Foreign Languages</div>
                <p class="text-[11px] text-slate-500">General English (Beginner to Upper-intermediate), Academic Russian, Spoken Fluency & Phonetics labs.</p>
              </div>
              <div class="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60">
                <div class="text-xs font-bold text-violet-700 mb-1">Standardized Exam Prep</div>
                <p class="text-[11px] text-slate-500">IELTS Academic (6.5 - 8.5+ target), TOEFL iBT, CEFR certifications, and university entrance exams.</p>
              </div>
              <div class="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60">
                <div class="text-xs font-bold text-emerald-700 mb-1">13-Lesson Evaluation System</div>
                <p class="text-[11px] text-slate-500">Transparent daily scoring, 5 comprehensive unit tests, and culminating final exam tracking.</p>
              </div>
              <div class="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60">
                <div class="text-xs font-bold text-amber-700 mb-1">Digital Library & Audio Lab</div>
                <p class="text-[11px] text-slate-500">Downloadable official Cambridge/Oxford textbooks and curated audio tracks for active listening mastery.</p>
              </div>
            </div>
          </div>

          <!-- Academic Leadership & Faculty -->
          <div class="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 class="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span>👨‍🏫</span>
              <span>Key Academic Faculty & Staff</span>
            </h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">DK</div>
                  <div>
                    <h5 class="text-xs font-bold text-slate-900">Academic Leadership & Admin</h5>
                    <p class="text-[11px] text-slate-500">Executive Director & Academic Council of Dunyoi Khirad LLC</p>
                  </div>
                </div>
                <span class="text-xs px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-semibold">Leadership</span>
              </div>
              <div class="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 rounded-full bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-sm">FB</div>
                  <div>
                    <h5 class="text-xs font-bold text-slate-900">Teacher F. Boymurodov</h5>
                    <p class="text-[11px] text-slate-500">Senior English Lecturer & Head of Examination Assessment</p>
                  </div>
                </div>
                <span class="text-xs px-2.5 py-1 rounded-md bg-violet-50 text-violet-700 font-semibold">Senior Teacher</span>
              </div>
              <div class="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm">SJ</div>
                  <div>
                    <h5 class="text-xs font-bold text-slate-900">Sarah Jenkins</h5>
                    <p class="text-[11px] text-slate-500">Upper-Intermediate & IELTS Speaking Specialist</p>
                  </div>
                </div>
                <span class="text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold">Senior Teacher</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar: Legal & Contact Info (1 Col) -->
        <div class="space-y-6">
          <!-- Legal Entity Credentials Card -->
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
            <h3 class="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <span>⚖️</span>
              <span>Legal Entity & Accreditation</span>
            </h3>
            <div class="space-y-2.5 text-xs text-slate-600">
              <div class="pb-2 border-b border-slate-100">
                <span class="text-slate-400 block text-[10px] font-semibold uppercase">Legal Form</span>
                <span class="font-bold text-slate-800">Limited Liability Company (ҶДММ)</span>
              </div>
              <div class="pb-2 border-b border-slate-100">
                <span class="text-slate-400 block text-[10px] font-semibold uppercase">Registered Entity Name</span>
                <span class="font-bold text-slate-800">ҶДММ "Дунёи Хирад"</span>
              </div>
              <div class="pb-2 border-b border-slate-100">
                <span class="text-slate-400 block text-[10px] font-semibold uppercase">State Educational License</span>
                <span class="font-bold text-indigo-700">№ ED-2023-TJ-94812</span>
              </div>
              <div class="pb-2 border-b border-slate-100">
                <span class="text-slate-400 block text-[10px] font-semibold uppercase">Date of Establishment</span>
                <span class="font-bold text-slate-800">September 2020</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px] font-semibold uppercase">Tax Identification (TIN)</span>
                <span class="font-mono font-bold text-slate-800">030048192-TJ</span>
              </div>
            </div>
          </div>

          <!-- Contact & Location Card -->
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 class="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <span>📍</span>
              <span>Center Campus & Inquiries</span>
            </h3>
            <div class="space-y-3 text-xs">
              <div class="flex items-start space-x-2.5 text-slate-600">
                <span class="text-slate-400 text-sm mt-0.5">🏢</span>
                <div>
                  <span class="font-bold text-slate-800 block">Main Campus Address</span>
                  <span>14 Rudaki Avenue, 3rd Floor, Dunyoi Khirad Education Center</span>
                </div>
              </div>
              <div class="flex items-start space-x-2.5 text-slate-600">
                <span class="text-slate-400 text-sm mt-0.5">📞</span>
                <div>
                  <span class="font-bold text-slate-800 block">Telephone & Admissions</span>
                  <span>+992 (44) 600-13-13</span>
                  <span class="block text-slate-500">+992 (90) 131-30-00</span>
                </div>
              </div>
              <div class="flex items-start space-x-2.5 text-slate-600">
                <span class="text-slate-400 text-sm mt-0.5">✉️</span>
                <div>
                  <span class="font-bold text-slate-800 block">Electronic Mail</span>
                  <span class="text-indigo-600 font-semibold">info@dnyoikhirad.tj</span>
                </div>
              </div>
              <div class="flex items-start space-x-2.5 text-slate-600">
                <span class="text-slate-400 text-sm mt-0.5">⏰</span>
                <div>
                  <span class="font-bold text-slate-800 block">Working Hours</span>
                  <span>Mon - Sat: 08:00 AM - 08:00 PM</span>
                  <span class="block text-slate-400 text-[11px]">Sunday: Speaking clubs & seminars</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Official Stamp Seal Box -->
          <div class="p-4 rounded-2xl bg-gradient-to-tr from-slate-100 to-indigo-50/40 border border-slate-200 text-center space-y-2">
            <div class="w-12 h-12 rounded-full border-2 border-dashed border-indigo-400 text-indigo-700 flex items-center justify-center font-bold text-xs mx-auto">
              SEAL
            </div>
            <div class="text-[11px] font-bold text-slate-700">Official Dunyoi Khirad LLC Portal</div>
            <p class="text-[10px] text-slate-500">All student records, grades, and materials are protected under internal academic regulations.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- NOT SIGNED IN ALERT NOTICE -->
    <div id="unauthorizedNotice" class="hidden text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 my-8">
      <div class="text-5xl mb-3">🔒</div>
      <h3 class="text-xl font-bold text-slate-800">Protected Academic Area</h3>
      <p class="text-xs text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
        Marks and evaluations are private. Please sign in with your Group credentials, Teacher account, or Administrator login to view and evaluate students.
      </p>
      <button onclick="openLoginModal()" class="mt-5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm">
        Sign In Now
      </button>
    </div>

  </main>

  <!-- ================= SIGN IN MODAL ================= -->
  <div id="loginModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 hidden flex items-center justify-center p-4">
    <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-7 animate-in fade-in zoom-in duration-150">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h3 class="text-2xl font-bold text-slate-900">Sign In to Dunyoi Khirad</h3>
          <p class="text-xs text-slate-500 mt-0.5">Admin, Teachers, Students & Parents</p>
        </div>
        <button onclick="closeLoginModal()" class="text-slate-400 hover:text-slate-600 text-2xl font-bold leading-none">&times;</button>
      </div>

      <form onsubmit="handleLogin(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Username / Account ID</label>
          <input type="text" id="loginUser" required placeholder="e.g. admin, boymurodov, or beginner" class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Password</label>
          <input type="password" id="loginPass" required placeholder="••••••••" class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none">
        </div>
        <button type="submit" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition">
          Sign In
        </button>
      </form>

      <div class="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
        <div class="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Quick Accounts to Test:</div>
        
        <div class="flex items-center justify-between p-2 rounded-lg bg-indigo-50/70 cursor-pointer hover:bg-indigo-100/70 transition" onclick="autoFill('admin', '@idrisyorov1313@')">
          <div>
            <div class="font-bold text-slate-900">👑 Administrator</div>
            <code class="text-indigo-600 font-mono text-[11px]">admin / @idrisyorov1313@</code>
          </div>
          <span class="text-indigo-700 font-bold text-[10px] uppercase bg-white px-2 py-0.5 rounded border border-indigo-200">Fill</span>
        </div>

        <div class="flex items-center justify-between p-2 rounded-lg bg-violet-50/70 cursor-pointer hover:bg-violet-100/70 transition" onclick="autoFill('boymurodov', 'password')">
          <div>
            <div class="font-bold text-slate-900">👨‍🏫 Teacher Boymurodov (Teaches Multiple Classes & Posts News)</div>
            <code class="text-violet-700 font-mono text-[11px]">boymurodov / password</code>
          </div>
          <span class="text-violet-700 font-bold text-[10px] uppercase bg-white px-2 py-0.5 rounded border border-violet-200">Fill</span>
        </div>

        <div class="flex items-center justify-between p-2 rounded-lg bg-slate-100 cursor-pointer hover:bg-slate-200/70 transition" onclick="autoFill('Upper-intermediate', 'upper123')">
          <div>
            <div class="font-bold text-slate-900">👨‍👩‍👧 Sample Group</div>
            <code class="text-slate-700 font-mono text-[11px]">Upper-intermediate / upper123</code>
          </div>
          <span class="text-slate-700 font-bold text-[10px] uppercase bg-white px-2 py-0.5 rounded border border-slate-300">Fill</span>
        </div>
      </div>
    </div>
  </div>

  <!-- ================= CREATE NEWS MODAL ================= -->
  <div id="newsModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 hidden flex items-center justify-center p-4">
    <div class="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-7 max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-5">
        <h3 class="text-lg font-bold text-slate-900">Publish News Announcement</h3>
        <button onclick="closeNewsModal()" class="text-slate-400 hover:text-slate-600 text-2xl font-bold leading-none">&times;</button>
      </div>

      <form onsubmit="handlePostNews(event)" class="space-y-3.5">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Announcement Title</label>
          <input type="text" id="newsTitle" required placeholder="e.g. Speaking Contest Results or Exam Schedule" class="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none">
        </div>
        
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Upload Photo (from Device)</label>
          <input type="file" id="newsPhotoFile" accept="image/*" class="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100">
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Or Photo URL (Optional)</label>
          <input type="url" id="newsPhotoUrl" placeholder="https://images.unsplash.com/..." class="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none">
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Announcement Details</label>
          <textarea id="newsContent" rows="4" required placeholder="Write announcement content here..." class="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
        </div>

        <button type="submit" class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition">
          Publish to Dunyoi Khirad Feed
        </button>
      </form>
    </div>
  </div>

  <!-- ================= ADD / EDIT LIBRARY ITEM MODAL (ADMIN ONLY) ================= -->
  <div id="libraryModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 hidden flex items-center justify-center p-4">
    <div class="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-7 max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-5">
        <h3 id="libraryModalHeading" class="text-lg font-bold text-slate-900">Add Academic Material</h3>
        <button onclick="closeLibraryModal()" class="text-slate-400 hover:text-slate-600 text-2xl font-bold leading-none">&times;</button>
      </div>

      <form onsubmit="handleSaveLibraryItem(event)" class="space-y-3.5">
        <input type="hidden" id="libItemId" value="">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Material Title</label>
          <input type="text" id="libTitle" required placeholder="e.g. IELTS Reading Comprehension Guide" class="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none">
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Type</label>
            <select id="libType" class="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
              <option value="pdf">📚 PDF Book / Textbook</option>
              <option value="audio">🎧 Audio Listening Track</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Category</label>
            <input type="text" id="libCategory" required placeholder="e.g. Grammar, Exam Prep, Audio" class="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none">
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Author / Publisher</label>
            <input type="text" id="libAuthor" required placeholder="e.g. Cambridge English" class="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Size or Duration</label>
            <input type="text" id="libSize" required placeholder="e.g. 12.5 MB or 04:30" class="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none">
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">File URL / Download Link</label>
          <input type="url" id="libFileUrl" required placeholder="https://example.com/files/book.pdf" class="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none">
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Description / Summary</label>
          <textarea id="libDescription" rows="3" required placeholder="Short overview of what students will learn from this book or audio..." class="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
        </div>

        <button type="submit" class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition">
          Save to Digital Library
        </button>
      </form>
    </div>
  </div>

  <!-- ================= CORE JAVASCRIPT ================= -->
  <script>
    const STORAGE_KEY_GROUPS = 'dunyoi_khirad_groups';
    const STORAGE_KEY_TEACHERS = 'dunyoi_khirad_teachers';
    const STORAGE_KEY_NEWS = 'dunyoi_khirad_news';
    const STORAGE_KEY_LIBRARY = 'dunyoi_khirad_library';
    const STORAGE_KEY_ABOUT = 'dunyoi_khirad_about';
    const STORAGE_KEY_SESSION = 'dunyoi_khirad_session';

    const ADMIN_CREDENTIALS = {
      username: "admin",
      password: "@idrisyorov1313@",
      role: "admin",
      displayName: "Administrator"
    };

    const serverData = ${JSON.stringify(initialData)};

    // Sync from server data initially or migrate legacy keys
    function initializeData() {
      // Migrate legacy localStorage if present
      if (!localStorage.getItem(STORAGE_KEY_GROUPS)) {
        const legacyGroups = localStorage.getItem('apex_edu_groups');
        localStorage.setItem(STORAGE_KEY_GROUPS, legacyGroups || JSON.stringify(serverData.groups));
      }
      if (!localStorage.getItem(STORAGE_KEY_TEACHERS)) {
        const legacyTeachers = localStorage.getItem('apex_edu_teachers');
        localStorage.setItem(STORAGE_KEY_TEACHERS, legacyTeachers || JSON.stringify(serverData.teachers || {}));
      }
      if (!localStorage.getItem(STORAGE_KEY_NEWS)) {
        const legacyNews = localStorage.getItem('apex_edu_news');
        localStorage.setItem(STORAGE_KEY_NEWS, legacyNews || JSON.stringify(serverData.news || []));
      }
      if (!localStorage.getItem(STORAGE_KEY_LIBRARY)) {
        const legacyLibrary = localStorage.getItem('apex_edu_library');
        localStorage.setItem(STORAGE_KEY_LIBRARY, legacyLibrary || JSON.stringify(serverData.library || []));
      }
      if (!localStorage.getItem(STORAGE_KEY_ABOUT)) {
        localStorage.setItem(STORAGE_KEY_ABOUT, JSON.stringify(serverData.about || {}));
      }

      // Ensure all students in local storage have exams array
      const groups = JSON.parse(localStorage.getItem(STORAGE_KEY_GROUPS)) || {};
      let updatedGroups = false;
      for (const gName in groups) {
        if (groups[gName] && Array.isArray(groups[gName].students)) {
          groups[gName].students.forEach(s => {
            if (!s.lessons) { s.lessons = Array(13).fill(""); updatedGroups = true; }
            if (!s.tests) { s.tests = Array(5).fill(""); updatedGroups = true; }
            if (!s.exams) { s.exams = Array(5).fill(""); updatedGroups = true; }
          });
        }
      }
      if (updatedGroups) {
        localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(groups));
      }

      // Ensure all teachers have assignedGroups array
      const teachers = JSON.parse(localStorage.getItem(STORAGE_KEY_TEACHERS)) || {};
      let updatedTeachers = false;
      for (const tName in teachers) {
        const t = teachers[tName];
        if (t && !Array.isArray(t.assignedGroups)) {
          t.assignedGroups = t.assignedGroup ? [t.assignedGroup] : [];
          updatedTeachers = true;
        }
      }
      if (updatedTeachers) {
        localStorage.setItem(STORAGE_KEY_TEACHERS, JSON.stringify(teachers));
      }
    }

    initializeData();

    let currentUser = JSON.parse(sessionStorage.getItem(STORAGE_KEY_SESSION)) || null;
    let selectedGroup = "Upper-intermediate";

    if (currentUser) {
      if (currentUser.role === 'admin') {
        const grps = JSON.parse(localStorage.getItem(STORAGE_KEY_GROUPS)) || {};
        selectedGroup = Object.keys(grps)[0] || "Upper-intermediate";
      } else if (currentUser.role === 'teacher') {
        const assigned = currentUser.assignedGroups || [];
        selectedGroup = assigned[0] || Object.keys(JSON.parse(localStorage.getItem(STORAGE_KEY_GROUPS)) || {})[0] || "Upper-intermediate";
      } else {
        selectedGroup = currentUser.assignedGroup || currentUser.username || "Upper-intermediate";
      }
    }

    let currentActiveTab = 'news';
    let currentLibraryFilter = 'all';
    let syncDebounceTimer = null;
    let pendingStudentToDeleteIndex = null;

    function autoFill(u, p) {
      document.getElementById('loginUser').value = u;
      document.getElementById('loginPass').value = p;
    }

    // Permission check for news
    function canUserPublishNews() {
      if (!currentUser) return false;
      if (currentUser.role === 'admin' || currentUser.username === 'admin') return true;
      if (currentUser.username === 'boymurodov') return true;
      if (currentUser.canPublishNews === true) return true;
      if (currentUser.displayName && currentUser.displayName.toLowerCase().includes('boymurodov')) return true;
      return false;
    }

    // Navigation Switcher
    function switchTab(tab) {
      currentActiveTab = tab;
      const allTabs = ['news', 'lessons', 'tests', 'exams', 'library', 'about', 'admin'];
      allTabs.forEach(t => {
        const btn = document.getElementById('tab-' + t);
        const mobBtn = document.getElementById('mob-tab-' + t);
        const isTarget = (t === tab);
        if (btn) {
          btn.className = isTarget 
            ? "px-3.5 py-2 rounded-lg font-semibold text-sm transition text-indigo-600 bg-indigo-50" 
            : "px-3.5 py-2 rounded-lg font-semibold text-sm transition text-slate-600 hover:text-indigo-600 hover:bg-slate-50";
        }
        if (mobBtn) {
          mobBtn.className = isTarget 
            ? "whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 bg-indigo-50" 
            : "whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600";
        }
      });

      // Hide all views
      ['view-news', 'view-lessons', 'view-tests', 'view-exams', 'view-library', 'view-about', 'view-admin', 'unauthorizedNotice'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
      });

      if (tab === 'news') {
        document.getElementById('view-news').classList.remove('hidden');
        renderNews();
      } else if (tab === 'library') {
        document.getElementById('view-library').classList.remove('hidden');
        renderLibrary();
      } else if (tab === 'about') {
        document.getElementById('view-about').classList.remove('hidden');
        renderAboutUs();
      } else {
        // Protected views: lessons, tests, exams, admin
        if (!currentUser) {
          document.getElementById('unauthorizedNotice').classList.remove('hidden');
          return;
        }

        if (tab === 'lessons') {
          document.getElementById('view-lessons').classList.remove('hidden');
          renderLessonTable();
        } else if (tab === 'tests') {
          document.getElementById('view-tests').classList.remove('hidden');
          renderTestTable();
        } else if (tab === 'exams') {
          document.getElementById('view-exams').classList.remove('hidden');
          renderExamTable();
        } else if (tab === 'admin') {
          if (currentUser.role === 'admin') {
            document.getElementById('view-admin').classList.remove('hidden');
            renderAdminPanel();
          } else {
            document.getElementById('unauthorizedNotice').classList.remove('hidden');
          }
        }
      }
    }

    // Modal helpers
    function openLoginModal() { document.getElementById('loginModal').classList.remove('hidden'); }
    function closeLoginModal() { document.getElementById('loginModal').classList.add('hidden'); }

    // Login Handler: Supports Admin, Multi-Class Teachers, and Groups
    function handleLogin(e) {
      e.preventDefault();
      const user = document.getElementById('loginUser').value.trim();
      const pass = document.getElementById('loginPass').value.trim();

      // 1. Admin Login
      if (user === ADMIN_CREDENTIALS.username && pass === ADMIN_CREDENTIALS.password) {
        currentUser = { username: "admin", role: "admin", displayName: "Administrator", canPublishNews: true };
        const groups = JSON.parse(localStorage.getItem(STORAGE_KEY_GROUPS)) || {};
        selectedGroup = Object.keys(groups)[0] || "Upper-intermediate";
        onLoginSuccess();
        return;
      }

      // 2. Teacher Login (Can teach more than 2 classes!)
      const teachers = JSON.parse(localStorage.getItem(STORAGE_KEY_TEACHERS)) || {};
      if (teachers[user] && teachers[user].password === pass) {
        const t = teachers[user];
        const assignedGroups = Array.isArray(t.assignedGroups) ? t.assignedGroups : (t.assignedGroup ? [t.assignedGroup] : []);
        currentUser = { 
          username: user, 
          role: "teacher", 
          displayName: t.name || user,
          assignedGroups: assignedGroups,
          canPublishNews: (user === 'boymurodov' || t.canPublishNews === true)
        };
        const allGroups = JSON.parse(localStorage.getItem(STORAGE_KEY_GROUPS)) || {};
        selectedGroup = assignedGroups[0] || Object.keys(allGroups)[0] || "Upper-intermediate";
        onLoginSuccess();
        return;
      }

      // 3. Group Account Login
      const groups = JSON.parse(localStorage.getItem(STORAGE_KEY_GROUPS)) || {};
      if (groups[user] && groups[user].password === pass) {
        currentUser = { username: user, role: "group", displayName: "Group: " + user, assignedGroup: user, canPublishNews: false };
        selectedGroup = user;
        onLoginSuccess();
        return;
      }

      showToast("❌ Invalid username or password", true);
    }

    function onLoginSuccess() {
      sessionStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(currentUser));
      closeLoginModal();
      showToast("👋 Welcome, " + currentUser.displayName + "!");
      updateAuthUI();
      switchTab('lessons');
    }

    function logout() {
      currentUser = null;
      selectedGroup = "Upper-intermediate";
      sessionStorage.removeItem(STORAGE_KEY_SESSION);
      updateAuthUI();
      switchTab('news');
      showToast("Signed out successfully");
    }

    function updateAuthUI() {
      const loginBtn = document.getElementById('loginBtn');
      const logoutBtn = document.getElementById('logoutBtn');
      const userBadge = document.getElementById('userBadge');
      const userDisplayRole = document.getElementById('userDisplayRole');
      const tabAdmin = document.getElementById('tab-admin');
      const mobTabAdmin = document.getElementById('mob-tab-admin');
      const btnCreateNews = document.getElementById('btnCreateNews');
      const btnCreateLibraryItem = document.getElementById('btnCreateLibraryItem');
      const canPublish = canUserPublishNews();

      if (currentUser) {
        loginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        userBadge.classList.remove('hidden');
        userDisplayRole.textContent = currentUser.displayName;

        if (currentUser.role === 'admin') {
          tabAdmin.classList.remove('hidden');
          mobTabAdmin.classList.remove('hidden');
          btnCreateLibraryItem.classList.remove('hidden');
        } else {
          tabAdmin.classList.add('hidden');
          mobTabAdmin.classList.add('hidden');
          btnCreateLibraryItem.classList.add('hidden');
        }

        // Only Admin and Teacher Boymurodov (or authorized teachers) can publish news
        if (canPublish) {
          btnCreateNews.classList.remove('hidden');
        } else {
          btnCreateNews.classList.add('hidden');
        }
      } else {
        loginBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        userBadge.classList.add('hidden');
        tabAdmin.classList.add('hidden');
        mobTabAdmin.classList.add('hidden');
        btnCreateNews.classList.add('hidden');
        btnCreateLibraryItem.classList.add('hidden');
      }
    }

    // --- INSTANT AUTO-SAVE & SERVER SYNC ---
    function triggerRealtimeSync() {
      const pill = document.getElementById('realtimeSavePill');
      const text = document.getElementById('saveStatusText');
      if (pill) pill.classList.remove('hidden');
      if (text) text.textContent = "Saving...";

      clearTimeout(syncDebounceTimer);
      syncDebounceTimer = setTimeout(() => {
        const payload = {
          groups: JSON.parse(localStorage.getItem(STORAGE_KEY_GROUPS)),
          teachers: JSON.parse(localStorage.getItem(STORAGE_KEY_TEACHERS)),
          news: JSON.parse(localStorage.getItem(STORAGE_KEY_NEWS)),
          library: JSON.parse(localStorage.getItem(STORAGE_KEY_LIBRARY)),
          about: JSON.parse(localStorage.getItem(STORAGE_KEY_ABOUT))
        };

        fetch('/api/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(r => r.json()).then(() => {
          if (text) text.textContent = "Saved ✓";
          setTimeout(() => {
            if (text) text.textContent = "Saved";
          }, 1500);
        }).catch(err => {
          console.error("Save error:", err);
          if (text) text.textContent = "Saved locally";
        });
      }, 350);
    }

    function changeActiveGroup(groupName) {
      selectedGroup = groupName;
      renderLessonTable();
      renderTestTable();
      renderExamTable();
    }

    // Synchronize Group Selectors across Lessons, Tests, and Exams
    function syncGroupSelector() {
      const groups = JSON.parse(localStorage.getItem(STORAGE_KEY_GROUPS)) || {};
      const allGroupKeys = Object.keys(groups);

      // Determine selectable groups based on role
      let selectableGroups = allGroupKeys;
      if (currentUser && currentUser.role === 'teacher') {
        const assigned = currentUser.assignedGroups || [];
        selectableGroups = assigned.filter(g => groups[g]);
        if (selectableGroups.length === 0) selectableGroups = allGroupKeys;
      }

      // If active group is not in selectable, switch to first available
      if (!selectableGroups.includes(selectedGroup) && selectableGroups.length > 0) {
        selectedGroup = selectableGroups[0];
      }

      const optionsHtml = selectableGroups.map(g => \`
        <option value="\${g}" \${g === selectedGroup ? 'selected' : ''}>\${g}</option>
      \`).join('');

      // 1. Lessons group selector
      const groupSelectContainer = document.getElementById('groupSelectorContainer');
      const groupSelect = document.getElementById('headTeacherGroupSelect');
      if (groupSelect) groupSelect.innerHTML = optionsHtml;
      if (groupSelectContainer) {
        if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'teacher')) {
          groupSelectContainer.classList.remove('hidden');
        } else {
          groupSelectContainer.classList.add('hidden');
        }
      }

      // 2. Tests group selector
      const testGroupContainer = document.getElementById('testGroupSelectorContainer');
      const testGroupSelect = document.getElementById('testHeadTeacherGroupSelect');
      if (testGroupSelect) testGroupSelect.innerHTML = optionsHtml;
      if (testGroupContainer) {
        if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'teacher')) {
          testGroupContainer.classList.remove('hidden');
        } else {
          testGroupContainer.classList.add('hidden');
        }
      }

      // 3. Exams group selector
      const examGroupContainer = document.getElementById('examGroupSelectorContainer');
      const examGroupSelect = document.getElementById('examHeadTeacherGroupSelect');
      if (examGroupSelect) examGroupSelect.innerHTML = optionsHtml;
      if (examGroupContainer) {
        if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'teacher')) {
          examGroupContainer.classList.remove('hidden');
        } else {
          examGroupContainer.classList.add('hidden');
        }
      }

      // Badges
      const lBadge = document.getElementById('currentGroupBadge');
      if (lBadge) lBadge.textContent = 'Class: ' + selectedGroup;
      const tBadge = document.getElementById('currentTestGroupBadge');
      if (tBadge) tBadge.textContent = 'Class: ' + selectedGroup;
      const eBadge = document.getElementById('currentExamGroupBadge');
      if (eBadge) eBadge.textContent = 'Class: ' + selectedGroup;
    }

    // --- 13 LESSONS GRADEBOOK WITH INSTANT REAL-TIME SAVING ---
    function renderLessonTable() {
      syncGroupSelector();
      const groups = JSON.parse(localStorage.getItem(STORAGE_KEY_GROUPS)) || {};
      const groupData = groups[selectedGroup] || { students: [] };
      const tbody = document.getElementById('lessonMarksTableBody');

      tbody.innerHTML = "";

      groupData.students.forEach((student, index) => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-50 transition border-b border-slate-100";

        const validScores = (student.lessons || []).filter(s => s !== "" && !isNaN(s));
        const avg = validScores.length ? (validScores.reduce((a, b) => Number(a) + Number(b), 0) / validScores.length).toFixed(1) : '-';

        let lessonInputs = "";
        for (let l = 0; l < 13; l++) {
          const val = (student.lessons && student.lessons[l] !== undefined) ? student.lessons[l] : "";
          lessonInputs += \`
            <td class="p-1 text-center">
              <input type="text" maxlength="3" value="\${val}" 
                oninput="onLessonMarkInput(\${index}, \${l}, this.value)"
                class="mark-input w-9 h-8 text-center text-xs font-semibold rounded border border-slate-200 bg-white focus:bg-indigo-50 focus:border-indigo-500 outline-none transition">
            </td>
          \`;
        }

        tr.innerHTML = \`
          <td class="p-3 text-center text-slate-400 font-bold">\${index + 1}</td>
          <td class="p-2">
            <input type="text" value="\${student.name || ''}" placeholder="Student full name..." 
              oninput="onStudentNameInput(\${index}, this.value)"
              class="w-full text-xs font-semibold px-2.5 py-1.5 rounded border border-transparent hover:border-slate-300 focus:border-indigo-500 bg-transparent outline-none transition">
          </td>
          \${lessonInputs}
          <td id="avg-cell-\${index}" class="p-3 text-center font-extrabold text-indigo-700 bg-indigo-50/50">\${avg}</td>
          <td class="p-3 text-center">
            <button onclick="promptDeleteStudent(\${index}, '\${(student.name || 'Student ' + (index + 1)).replace(/'/g, "\\\\'")}')" class="text-slate-300 hover:text-rose-600 font-bold text-sm transition p-1" title="Delete Student">&times;</button>
          </td>
        \`;
        tbody.appendChild(tr);
      });

      document.getElementById('studentCountBadge').textContent = groupData.students.length + " / 20 Students";
    }

    // Instant input handlers: Auto-recalculate & auto-save immediately
    function onLessonMarkInput(studentIndex, lessonIndex, value) {
      const groups = JSON.parse(localStorage.getItem(STORAGE_KEY_GROUPS));
      const groupData = groups[selectedGroup];
      if (!groupData || !groupData.students[studentIndex]) return;

      if (!groupData.students[studentIndex].lessons) {
        groupData.students[studentIndex].lessons = Array(13).fill("");
      }
      groupData.students[studentIndex].lessons[lessonIndex] = value.trim();

      const validScores = groupData.students[studentIndex].lessons.filter(s => s !== "" && !isNaN(s));
      const newAvg = validScores.length ? (validScores.reduce((a, b) => Number(a) + Number(b), 0) / validScores.length).toFixed(1) : '-';

      const avgCell = document.getElementById('avg-cell-' + studentIndex);
      if (avgCell) {
        avgCell.textContent = newAvg;
        avgCell.classList.add('bg-indigo-100');
        setTimeout(() => avgCell.classList.remove('bg-indigo-100'), 300);
      }

      localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(groups));
      triggerRealtimeSync();
    }

    function onStudentNameInput(studentIndex, nameValue) {
      const groups = JSON.parse(localStorage.getItem(STORAGE_KEY_GROUPS));
      const groupData = groups[selectedGroup];
      if (!groupData || !groupData.students[studentIndex]) return;

      groupData.students[studentIndex].name = nameValue.trim();
      localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(groups));
      triggerRealtimeSync();
    }

    function manualSaveMarks(type) {
      triggerRealtimeSync();
      showToast("💾 Marks successfully synchronized to database!");
    }

    // --- TEST MARKS WITH INSTANT SAVING ---
    function renderTestTable() {
      syncGroupSelector();
      const groups = JSON.parse(localStorage.getItem(STORAGE_KEY_GROUPS)) || {};
      const groupData = groups[selectedGroup] || { students: [] };
      const tbody = document.getElementById('testMarksTableBody');

      tbody.innerHTML = "";

      groupData.students.forEach((student, index) => {
        const tests = student.tests || ["", "", "", "", ""];
        const valid = tests.filter(v => v !== "" && !isNaN(v));
        const total = valid.length ? (valid.reduce((a, b) => Number(a) + Number(b), 0) / valid.length).toFixed(1) + "%" : '-';

        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-50 transition border-b border-slate-100";

        let testInputs = "";
        for (let t = 0; t < 5; t++) {
          const val = tests[t] !== undefined ? tests[t] : "";
          testInputs += \`
            <td class="p-1.5 text-center">
              <input type="text" maxlength="3" value="\${val}" 
                oninput="onTestMarkInput(\${index}, \${t}, this.value)"
                placeholder="0-100" class="mark-input w-16 h-8 text-center text-xs font-semibold rounded border border-slate-200 bg-white focus:bg-amber-50 focus:border-amber-500 outline-none transition">
            </td>
          \`;
        }

        tr.innerHTML = \`
          <td class="p-3 text-center text-slate-400 font-bold">\${index + 1}</td>
          <td class="p-2">
            <input type="text" value="\${student.name || ''}" placeholder="Student full name..." 
              oninput="onStudentNameInput(\${index}, this.value)"
              class="w-full text-xs font-semibold px-2.5 py-1.5 rounded border border-transparent hover:border-slate-300 focus:border-indigo-500 bg-transparent outline-none transition">
          </td>
          \${testInputs}
          <td id="total-cell-\${index}" class="p-3 text-center font-extrabold text-amber-700 bg-amber-50/50">\${total}</td>
          <td class="p-3 text-center">
            <button onclick="promptDeleteStudent(\${index}, '\${(student.name || 'Student ' + (index + 1)).replace(/'/g, "\\\\'")}')" class="text-slate-300 hover:text-rose-600 font-bold text-sm transition p-1" title="Delete Student">&times;</button>
          </td>
        \`;
        tbody.appendChild(tr);
      });

      const countBadge = document.getElementById('testStudentCountBadge');
      if (countBadge) countBadge.textContent = groupData.students.length + " / 20 Students";
    }

    function onTestMarkInput(studentIndex, testCol, value) {
      const groups = JSON.parse(localStorage.getItem(STORAGE_KEY_GROUPS));
      const groupData = groups[selectedGroup];
      if (!groupData || !groupData.students[studentIndex]) return;

      if (!groupData.students[studentIndex].tests) {
        groupData.students[studentIndex].tests = Array(5).fill("");
      }
      groupData.students[studentIndex].tests[testCol] = value.trim();

      const valid = groupData.students[studentIndex].tests.filter(v => v !== "" && !isNaN(v));
      const newTotal = valid.length ? (valid.reduce((a, b) => Number(a) + Number(b), 0) / valid.length).toFixed(1) + "%" : '-';

      const cell = document.getElementById('total-cell-' + studentIndex);
      if (cell) {
        cell.textContent = newTotal;
        cell.classList.add('bg-amber-100');
        setTimeout(() => cell.classList.remove('bg-amber-100'), 300);
      }

      localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(groups));
      triggerRealtimeSync();
    }

    // --- 4. EXAM MARKS PAGE (Live interactive editable table just like other mark pages!) ---
    function renderExamTable() {
      syncGroupSelector();
      const groups = JSON.parse(localStorage.getItem(STORAGE_KEY_GROUPS)) || {};
      const groupData = groups[selectedGroup] || { students: [] };
      const tbody = document.getElementById('examMarksTableBody');

      tbody.innerHTML = "";

      let validAverages = [];
      let topStudentName = "-";
      let topStudentScore = -1;

      groupData.students.forEach((student, index) => {
        if (!student.exams) {
          student.exams = ["", "", "", "", ""];
        }
        const exams = student.exams;
        const valid = exams.filter(v => v !== "" && !isNaN(v));
        const avgNum = valid.length ? (valid.reduce((a, b) => Number(a) + Number(b), 0) / valid.length) : null;
        const avgDisplay = avgNum !== null ? avgNum.toFixed(1) + "%" : "-";

        if (avgNum !== null) {
          validAverages.push(avgNum);
          if (avgNum > topStudentScore) {
            topStudentScore = avgNum;
            topStudentName = (student.name || ("Student " + (index + 1))) + " (" + avgNum.toFixed(1) + "%)";
          }
        }

        let tierBadge = '<span class="text-slate-400 text-xs">Pending</span>';
        if (avgNum !== null) {
          if (avgNum >= 90) {
            tierBadge = '<span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">🟢 Distinction</span>';
          } else if (avgNum >= 80) {
            tierBadge = '<span class="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200">🔵 Merit</span>';
          } else if (avgNum >= 60) {
            tierBadge = '<span class="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200">🟡 Pass</span>';
          } else {
            tierBadge = '<span class="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200">🔴 Needs Support</span>';
          }
        }

        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-50 transition border-b border-slate-100";

        let examInputs = "";
        for (let e = 0; e < 5; e++) {
          const val = exams[e] !== undefined ? exams[e] : "";
          examInputs += \`
            <td class="p-1.5 text-center">
              <input type="text" maxlength="3" value="\${val}" 
                oninput="onExamMarkInput(\${index}, \${e}, this.value)"
                placeholder="0-100" class="mark-input w-16 h-8 text-center text-xs font-semibold rounded border border-slate-200 bg-white focus:bg-emerald-50 focus:border-emerald-500 outline-none transition">
            </td>
          \`;
        }

        tr.innerHTML = \`
          <td class="p-3 text-center text-slate-400 font-bold">\${index + 1}</td>
          <td class="p-2">
            <input type="text" value="\${student.name || ''}" placeholder="Student full name..." 
              oninput="onStudentNameInput(\${index}, this.value)"
              class="w-full text-xs font-semibold px-2.5 py-1.5 rounded border border-transparent hover:border-slate-300 focus:border-indigo-500 bg-transparent outline-none transition">
          </td>
          \${examInputs}
          <td id="exam-avg-cell-\${index}" class="p-3 text-center font-extrabold text-emerald-700 bg-emerald-50/50">\${avgDisplay}</td>
          <td id="exam-tier-cell-\${index}" class="p-3 text-center">\${tierBadge}</td>
          <td class="p-3 text-center">
            <button onclick="promptDeleteStudent(\${index}, '\${(student.name || 'Student ' + (index + 1)).replace(/'/g, "\\\\'")}')" class="text-slate-300 hover:text-rose-600 font-bold text-sm transition p-1" title="Delete Student">&times;</button>
          </td>
        \`;
        tbody.appendChild(tr);
      });

      // Update count & summary cards
      const countBadge = document.getElementById('examStudentCountBadge');
      if (countBadge) countBadge.textContent = groupData.students.length + " / 20 Students";

      const statTotal = document.getElementById('statTotalStudents');
      if (statTotal) statTotal.textContent = groupData.students.length;

      const statClassAvg = document.getElementById('statClassAvg');
      const statPassRate = document.getElementById('statPassRate');
      const statTop = document.getElementById('statTopStudent');

      if (validAverages.length > 0) {
        const classAvg = (validAverages.reduce((a, b) => a + b, 0) / validAverages.length).toFixed(1);
        if (statClassAvg) statClassAvg.textContent = classAvg + "%";

        const passed = validAverages.filter(a => a >= 60).length;
        if (statPassRate) statPassRate.textContent = ((passed / validAverages.length) * 100).toFixed(0) + "%";

        if (statTop) statTop.textContent = topStudentName;
      } else {
        if (statClassAvg) statClassAvg.textContent = "-";
        if (statPassRate) statPassRate.textContent = "-";
        if (statTop) statTop.textContent = "-";
      }
    }

    function onExamMarkInput(studentIndex, examCol, value) {
      const groups = JSON.parse(localStorage.getItem(STORAGE_KEY_GROUPS));
      const groupData = groups[selectedGroup];
      if (!groupData || !groupData.students[studentIndex]) return;

      if (!groupData.students[studentIndex].exams) {
        groupData.students[studentIndex].exams = Array(5).fill("");
      }
      groupData.students[studentIndex].exams[examCol] = value.trim();

      const exams = groupData.students[studentIndex].exams;
      const valid = exams.filter(v => v !== "" && !isNaN(v));
      const avgNum = valid.length ? (valid.reduce((a, b) => Number(a) + Number(b), 0) / valid.length) : null;
      const avgDisplay = avgNum !== null ? avgNum.toFixed(1) + "%" : "-";

      const avgCell = document.getElementById('exam-avg-cell-' + studentIndex);
      if (avgCell) {
        avgCell.textContent = avgDisplay;
        avgCell.classList.add('bg-emerald-100');
        setTimeout(() => avgCell.classList.remove('bg-emerald-100'), 300);
      }

      const tierCell = document.getElementById('exam-tier-cell-' + studentIndex);
      if (tierCell) {
        let tierBadge = '<span class="text-slate-400 text-xs">Pending</span>';
        if (avgNum !== null) {
          if (avgNum >= 90) {
            tierBadge = '<span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">🟢 Distinction</span>';
          } else if (avgNum >= 80) {
            tierBadge = '<span class="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200">🔵 Merit</span>';
          } else if (avgNum >= 60) {
            tierBadge = '<span class="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200">🟡 Pass</span>';
          } else {
            tierBadge = '<span class="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200">🔴 Needs Support</span>';
          }
        }
        tierCell.innerHTML = tierBadge;
      }

      // Update statistics
      updateExamSummaryMetrics(groupData.students);

      localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(groups));
      triggerRealtimeSync();
    }

    function updateExamSummaryMetrics(students) {
      let validAverages = [];
      let topStudentName = "-";
      let topStudentScore = -1;

      students.forEach((student, index) => {
        const exams = student.exams || [];
        const valid = exams.filter(v => v !== "" && !isNaN(v));
        if (valid.length) {
          const avg = valid.reduce((a, b) => Number(a) + Number(b), 0) / valid.length;
          validAverages.push(avg);
          if (avg > topStudentScore) {
            topStudentScore = avg;
            topStudentName = (student.name || ("Student " + (index + 1))) + " (" + avg.toFixed(1) + "%)";
          }
        }
      });

      const statClassAvg = document.getElementById('statClassAvg');
      const statPassRate = document.getElementById('statPassRate');
      const statTop = document.getElementById('statTopStudent');

      if (validAverages.length > 0) {
        const classAvg = (validAverages.reduce((a, b) => a + b, 0) / validAverages.length).toFixed(1);
        if (statClassAvg) statClassAvg.textContent = classAvg + "%";

        const passed = validAverages.filter(a => a >= 60).length;
        if (statPassRate) statPassRate.textContent = ((passed / validAverages.length) * 100).toFixed(0) + "%";

        if (statTop) statTop.textContent = topStudentName;
      } else {
        if (statClassAvg) statClassAvg.textContent = "-";
        if (statPassRate) statPassRate.textContent = "-";
        if (statTop) statTop.textContent = "-";
      }
    }

    // --- ENHANCED STUDENT ADD & DELETE ---
    function addStudentRow(type) {
      const groups = JSON.parse(localStorage.getItem(STORAGE_KEY_GROUPS));
      if (!groups[selectedGroup]) return;

      if (groups[selectedGroup].students.length >= 20) {
        showToast("⚠️ Maximum limit of 20 students reached for this group!", true);
        return;
      }

      groups[selectedGroup].students.push({
        id: "s_" + Date.now(),
        name: "",
        lessons: Array(13).fill(""),
        tests: Array(5).fill(""),
        exams: Array(5).fill("")
      });

      localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(groups));
      triggerRealtimeSync();

      if (type === 'lesson') renderLessonTable();
      else if (type === 'test') renderTestTable();
      else if (type === 'exam') renderExamTable();

      showToast("Added new student row");
    }

    function promptDeleteStudent(index, studentName) {
      pendingStudentToDeleteIndex = index;
      document.getElementById('deleteConfirmStudentName').textContent = 'Are you sure you want to remove "' + (studentName || 'this student') + '"? All marks will be permanently cleared.';
      document.getElementById('deleteConfirmModal').classList.remove('hidden');

      document.getElementById('btnConfirmDeleteStudent').onclick = function() {
        executeDeleteStudent();
      };
    }

    function closeDeleteConfirmModal() {
      pendingStudentToDeleteIndex = null;
      document.getElementById('deleteConfirmModal').classList.add('hidden');
    }

    function executeDeleteStudent() {
      if (pendingStudentToDeleteIndex === null) return;
      const groups = JSON.parse(localStorage.getItem(STORAGE_KEY_GROUPS));
      if (!groups[selectedGroup]) return;

      const removed = groups[selectedGroup].students.splice(pendingStudentToDeleteIndex, 1);
      localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(groups));
      triggerRealtimeSync();
      closeDeleteConfirmModal();

      renderLessonTable();
      renderTestTable();
      renderExamTable();

      showToast("Student " + (removed[0]?.name || "") + " removed");
    }

    // --- 5. DIGITAL LIBRARY PAGE (PDF & Audio Downloads, Admin Add/Edit/Delete) ---
    function filterLibrary(type) {
      currentLibraryFilter = type;
      ['all', 'pdf', 'audio'].forEach(t => {
        const btn = document.getElementById('lib-filter-' + t);
        if (btn) {
          btn.className = (t === type) 
            ? "px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 bg-indigo-50" 
            : "px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50";
        }
      });
      renderLibrary();
    }

    function renderLibrary() {
      const feed = document.getElementById('libraryFeed');
      const library = JSON.parse(localStorage.getItem(STORAGE_KEY_LIBRARY)) || [];
      const searchQ = (document.getElementById('libSearchInput')?.value || '').toLowerCase().trim();
      const isAdmin = currentUser && (currentUser.role === 'admin' || currentUser.username === 'admin');

      let filtered = library;
      if (currentLibraryFilter !== 'all') {
        filtered = filtered.filter(item => item.type === currentLibraryFilter);
      }
      if (searchQ) {
        filtered = filtered.filter(item => 
          (item.title && item.title.toLowerCase().includes(searchQ)) ||
          (item.author && item.author.toLowerCase().includes(searchQ)) ||
          (item.category && item.category.toLowerCase().includes(searchQ))
        );
      }

      if (filtered.length === 0) {
        feed.innerHTML = '<div class="col-span-full py-12 text-center text-slate-400 font-medium bg-white rounded-2xl border border-slate-200">No materials found in the library matching your filters.</div>';
        return;
      }

      feed.innerHTML = filtered.map(item => {
        const isPdf = item.type === 'pdf';
        const typeBadge = isPdf 
          ? '<span class="px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">PDF BOOK</span>'
          : '<span class="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">AUDIO TRACK</span>';

        const adminActions = isAdmin ? \`
          <div class="flex items-center space-x-1">
            <button onclick="editLibraryItem('\${item.id}')" class="p-1 text-slate-400 hover:text-indigo-600 font-bold" title="Edit">✏️</button>
            <button onclick="deleteLibraryItem('\${item.id}')" class="p-1 text-slate-400 hover:text-rose-600 font-bold" title="Delete">🗑️</button>
          </div>
        \` : '';

        const player = (!isPdf && item.fileUrl) ? \`
          <div class="mt-3 pt-3 border-t border-slate-100">
            <audio controls class="w-full h-8" preload="none">
              <source src="\${item.fileUrl}" type="audio/ogg">
              <source src="\${item.fileUrl}" type="audio/mpeg">
              Your browser does not support the audio element.
            </audio>
          </div>
        \` : '';

        return \`
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-2">
                  \${typeBadge}
                  <span class="text-xs font-semibold text-slate-500">\${item.category || 'General'}</span>
                </div>
                \${adminActions}
              </div>

              <h3 class="font-bold text-slate-900 text-base mb-1 leading-snug">\${item.title}</h3>
              <p class="text-xs text-slate-500 mb-2">By <b>\${item.author || 'Dunyoi Khirad'}</b> • \${item.size || item.duration || ''}</p>
              <p class="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">\${item.description || ''}</p>
            </div>

            <div>
              \${player}
              <div class="mt-3 flex items-center space-x-2">
                <a href="\${item.fileUrl}" target="_blank" download class="flex-1 text-center py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center space-x-1.5">
                  <span>⬇️</span>
                  <span>Download \${isPdf ? 'PDF' : 'Audio'}</span>
                </a>
                \${isPdf ? \`
                  <a href="\${item.fileUrl}" target="_blank" class="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition">
                    Preview
                  </a>
                \` : ''}
              </div>
            </div>
          </div>
        \`;
      }).join('');
    }

    function openLibraryModal(isEdit = false) {
      document.getElementById('libraryModalHeading').textContent = isEdit ? "Edit Academic Material" : "Add Academic Material";
      document.getElementById('libraryModal').classList.remove('hidden');
    }

    function closeLibraryModal() {
      document.getElementById('libItemId').value = '';
      document.getElementById('libTitle').value = '';
      document.getElementById('libCategory').value = '';
      document.getElementById('libAuthor').value = '';
      document.getElementById('libSize').value = '';
      document.getElementById('libFileUrl').value = '';
      document.getElementById('libDescription').value = '';
      document.getElementById('libraryModal').classList.add('hidden');
    }

    function handleSaveLibraryItem(e) {
      e.preventDefault();
      const id = document.getElementById('libItemId').value.trim() || ("lib_" + Date.now());
      const title = document.getElementById('libTitle').value.trim();
      const type = document.getElementById('libType').value;
      const category = document.getElementById('libCategory').value.trim();
      const author = document.getElementById('libAuthor').value.trim();
      const size = document.getElementById('libSize').value.trim();
      const fileUrl = document.getElementById('libFileUrl').value.trim();
      const description = document.getElementById('libDescription').value.trim();

      const library = JSON.parse(localStorage.getItem(STORAGE_KEY_LIBRARY)) || [];
      const existingIdx = library.findIndex(item => item.id === id);

      const newItem = { id, title, type, category, author, size, fileUrl, description };

      if (existingIdx !== -1) {
        library[existingIdx] = newItem;
      } else {
        library.unshift(newItem);
      }

      localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(library));
      triggerRealtimeSync();
      closeLibraryModal();
      renderLibrary();
      showToast("📚 Material saved to Digital Library!");
    }

    function editLibraryItem(id) {
      const library = JSON.parse(localStorage.getItem(STORAGE_KEY_LIBRARY)) || [];
      const item = library.find(i => i.id === id);
      if (!item) return;

      document.getElementById('libItemId').value = item.id;
      document.getElementById('libTitle').value = item.title;
      document.getElementById('libType').value = item.type;
      document.getElementById('libCategory').value = item.category || '';
      document.getElementById('libAuthor').value = item.author || '';
      document.getElementById('libSize').value = item.size || item.duration || '';
      document.getElementById('libFileUrl').value = item.fileUrl || '';
      document.getElementById('libDescription').value = item.description || '';

      openLibraryModal(true);
    }

    function deleteLibraryItem(id) {
      if (!confirm("Are you sure you want to remove this resource from the library?")) return;
      let library = JSON.parse(localStorage.getItem(STORAGE_KEY_LIBRARY)) || [];
      library = library.filter(i => i.id !== id);
      localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(library));
      triggerRealtimeSync();
      renderLibrary();
      showToast("Resource removed from library");
    }

    // --- 6. NEWS SYSTEM (ONLY Admin & Teacher Boymurodov Can Publish) ---
    function renderNews() {
      const newsFeed = document.getElementById('newsFeed');
      const news = JSON.parse(localStorage.getItem(STORAGE_KEY_NEWS)) || [];
      const canPublish = canUserPublishNews();

      if (news.length === 0) {
        newsFeed.innerHTML = '<div class="col-span-full py-12 text-center text-slate-400 font-medium bg-white rounded-2xl border border-slate-200">No news announcements posted yet.</div>';
        return;
      }

      newsFeed.innerHTML = news.map(item => \`
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col">
          <div class="h-48 w-full bg-slate-100 overflow-hidden relative">
            <img src="\${item.image}" alt="\${item.title}" class="w-full h-full object-cover">
            \${canPublish ? \`
              <button onclick="deleteNewsArticle('\${item.id}')" class="absolute top-3 right-3 h-8 w-8 rounded-lg bg-white/90 hover:bg-white text-rose-600 flex items-center justify-center shadow-xs transition" title="Delete Announcement">
                🗑️
              </button>
            \` : ''}
          </div>
          <div class="p-5 flex flex-col flex-grow">
            <span class="text-xs font-semibold text-indigo-600 mb-1">\${item.date}</span>
            <h3 class="font-bold text-slate-900 text-lg mb-2 leading-snug">\${item.title}</h3>
            <p class="text-xs text-slate-600 leading-relaxed flex-grow">\${item.content}</p>
          </div>
        </div>
      \`).join('');
    }

    function openNewsModal() { document.getElementById('newsModal').classList.remove('hidden'); }
    function closeNewsModal() { document.getElementById('newsModal').classList.add('hidden'); }

    function handlePostNews(e) {
      e.preventDefault();
      if (!canUserPublishNews()) {
        showToast("⚠️ Only Admin and Teacher Boymurodov are authorized to publish news!", true);
        return;
      }

      const title = document.getElementById('newsTitle').value.trim();
      const content = document.getElementById('newsContent').value.trim();
      const photoUrl = document.getElementById('newsPhotoUrl').value.trim();
      const fileInput = document.getElementById('newsPhotoFile');

      if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(event) {
          saveNewsArticle(title, content, event.target.result);
        };
        reader.readAsDataURL(fileInput.files[0]);
      } else {
        const finalImg = photoUrl || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80";
        saveNewsArticle(title, content, finalImg);
      }
    }

    function saveNewsArticle(title, content, image) {
      const news = JSON.parse(localStorage.getItem(STORAGE_KEY_NEWS)) || [];
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const today = new Date().toLocaleDateString('en-US', options);

      news.unshift({
        id: "news_" + Date.now(),
        title,
        content,
        image,
        date: today
      });

      localStorage.setItem(STORAGE_KEY_NEWS, JSON.stringify(news));
      triggerRealtimeSync();
      closeNewsModal();
      renderNews();
      showToast("📢 News announcement posted!");
      document.getElementById('newsTitle').value = '';
      document.getElementById('newsContent').value = '';
      document.getElementById('newsPhotoUrl').value = '';
      document.getElementById('newsPhotoFile').value = '';
    }

    function deleteNewsArticle(id) {
      if (!confirm("Are you sure you want to delete this announcement?")) return;
      let news = JSON.parse(localStorage.getItem(STORAGE_KEY_NEWS)) || [];
      news = news.filter(n => n.id !== id);
      localStorage.setItem(STORAGE_KEY_NEWS, JSON.stringify(news));
      triggerRealtimeSync();
      renderNews();
      showToast("Announcement deleted");
    }

    // --- 7. ADMIN CONSOLE (Groups & Multi-Class Teacher Accounts) ---
    function renderAdminPanel() {
      const groupList = document.getElementById('groupList');
      const teacherList = document.getElementById('teacherList');
      const groups = JSON.parse(localStorage.getItem(STORAGE_KEY_GROUPS)) || {};
      const teachers = JSON.parse(localStorage.getItem(STORAGE_KEY_TEACHERS)) || {};

      document.getElementById('adminTotalGroupsBadge').textContent = Object.keys(groups).length;
      document.getElementById('adminTotalTeachersBadge').textContent = Object.keys(teachers).length;

      // Populate multi-class checkboxes in teacher creation form
      const checkboxContainer = document.getElementById('teacherClassCheckboxes');
      if (checkboxContainer) {
        const groupKeys = Object.keys(groups);
        if (groupKeys.length === 0) {
          checkboxContainer.innerHTML = '<div class="text-xs text-slate-400">No classes registered yet. Create a class above first.</div>';
        } else {
          checkboxContainer.innerHTML = groupKeys.map((g, idx) => \`
            <label class="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer p-1 rounded hover:bg-slate-100">
              <input type="checkbox" name="teacherAssignedClasses" value="\${g}" \${idx === 0 ? 'checked' : ''} class="teacher-class-cb rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4">
              <span>\${g}</span>
            </label>
          \`).join('');
        }
      }

      // Render Active Groups
      groupList.innerHTML = Object.keys(groups).map(groupName => {
        const g = groups[groupName];
        return \`
          <div class="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div>
              <div class="flex items-center space-x-2">
                <span class="font-bold text-slate-900 text-sm">\${groupName}</span>
                <span class="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-medium">Teacher: \${g.teacher}</span>
              </div>
              <div class="text-xs text-slate-500 mt-1">
                Password: <code class="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-indigo-600">\${g.password}</code>
                • Total Students: <b>\${g.students.length}</b>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button onclick="changeActiveGroup('\${groupName}'); switchTab('lessons');" class="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition">
                Gradebook
              </button>
              <button onclick="deleteGroup('\${groupName}')" class="text-xs px-2 py-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition" title="Delete Group">
                🗑️
              </button>
            </div>
          </div>
        \`;
      }).join('');

      // Render Active Teachers with Multi-Class Badges & Quick Manage Button
      teacherList.innerHTML = Object.keys(teachers).map(uname => {
        const t = teachers[uname];
        const assigned = Array.isArray(t.assignedGroups) ? t.assignedGroups : (t.assignedGroup ? [t.assignedGroup] : []);
        const canPublishBadge = (uname === 'boymurodov' || t.canPublishNews) 
          ? '<span class="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">News Author</span>'
          : '<span class="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Standard</span>';

        const classBadges = assigned.length 
          ? assigned.map(c => \`<span class="text-[11px] bg-violet-100 text-violet-800 px-2 py-0.5 rounded-full font-bold">\${c}</span>\`).join(' ')
          : '<span class="text-[11px] text-amber-600 font-semibold">No classes assigned</span>';

        return \`
          <div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50 gap-3">
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-bold text-slate-900 text-sm">\${t.name}</span>
                \${canPublishBadge}
              </div>
              <div class="flex flex-wrap items-center gap-1.5 mt-1.5">
                <span class="text-xs text-slate-500 font-semibold">Classes (\${assigned.length}):</span>
                \${classBadges}
              </div>
              <div class="text-xs text-slate-500 mt-1">
                Username: <code class="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-violet-700">\${uname}</code>
                • Password: <code class="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-slate-600">\${t.password}</code>
              </div>
            </div>
            <div class="flex items-center space-x-2 self-end sm:self-center">
              <button onclick="openEditTeacherModal('\${uname}')" class="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-indigo-700 font-bold transition flex items-center space-x-1" title="Change Assigned Classes">
                <span>✏️</span>
                <span>Classes</span>
              </button>
              <button onclick="deleteTeacher('\${uname}')" class="text-xs px-2 py-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition" title="Delete Teacher">
                🗑️
              </button>
            </div>
          </div>
        \`;
      }).join('');
    }

    function toggleSelectAllTeacherClasses() {
      const cbs = document.querySelectorAll('.teacher-class-cb');
      const allChecked = Array.from(cbs).every(cb => cb.checked);
      cbs.forEach(cb => cb.checked = !allChecked);
    }

    function handleCreateGroup(e) {
      e.preventDefault();
      const groupName = document.getElementById('newGroupName').value.trim();
      const groupPass = document.getElementById('newGroupPass').value.trim();
      const teacher = document.getElementById('newGroupTeacher').value.trim();

      const groups = JSON.parse(localStorage.getItem(STORAGE_KEY_GROUPS)) || {};
      if (groups[groupName]) {
        showToast("⚠️ Group with this name already exists!", true);
        return;
      }

      groups[groupName] = {
        password: groupPass,
        teacher: teacher,
        students: [
          { id: "s_" + Date.now(), name: "", lessons: Array(13).fill(""), tests: Array(5).fill(""), exams: Array(5).fill("") }
        ]
      };

      localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(groups));
      triggerRealtimeSync();
      document.getElementById('newGroupName').value = '';
      document.getElementById('newGroupPass').value = '';
      document.getElementById('newGroupTeacher').value = '';

      renderAdminPanel();
      showToast('🎉 Class "' + groupName + '" created!');
    }

    // Teacher creation supporting MORE THAN 2 CLASSES
    function handleCreateTeacher(e) {
      e.preventDefault();
      const name = document.getElementById('teacherFullName').value.trim();
      const username = document.getElementById('teacherUsername').value.trim().toLowerCase();
      const password = document.getElementById('teacherPassword').value.trim();
      const canPublishNews = document.getElementById('teacherCanPublishNews').checked;

      // Collect all selected classes (can be 1, 2, 3, or more classes!)
      const checkedBoxes = document.querySelectorAll('input[name="teacherAssignedClasses"]:checked');
      const assignedGroups = Array.from(checkedBoxes).map(cb => cb.value);

      if (assignedGroups.length === 0) {
        showToast("⚠️ Please select at least one class for the teacher!", true);
        return;
      }

      const teachers = JSON.parse(localStorage.getItem(STORAGE_KEY_TEACHERS)) || {};
      if (teachers[username]) {
        showToast("⚠️ Username already taken!", true);
        return;
      }

      teachers[username] = {
        username,
        name,
        password,
        assignedGroups,
        canPublishNews
      };

      localStorage.setItem(STORAGE_KEY_TEACHERS, JSON.stringify(teachers));
      triggerRealtimeSync();

      document.getElementById('teacherFullName').value = '';
      document.getElementById('teacherUsername').value = '';
      document.getElementById('teacherPassword').value = '';

      renderAdminPanel();
      showToast('👨‍🏫 Teacher account "' + name + '" created with ' + assignedGroups.length + ' classes!');
    }

    // Modal to edit teacher assigned classes on the fly
    function openEditTeacherModal(username) {
      const teachers = JSON.parse(localStorage.getItem(STORAGE_KEY_TEACHERS)) || {};
      const groups = JSON.parse(localStorage.getItem(STORAGE_KEY_GROUPS)) || {};
      const t = teachers[username];
      if (!t) return;

      document.getElementById('editTeacherUsername').value = username;
      document.getElementById('editTeacherSubtitle').textContent = "Assign classes to " + t.name + " (" + username + ")";

      const assigned = Array.isArray(t.assignedGroups) ? t.assignedGroups : (t.assignedGroup ? [t.assignedGroup] : []);
      const container = document.getElementById('editTeacherClassCheckboxes');
      const groupKeys = Object.keys(groups);

      if (groupKeys.length === 0) {
        container.innerHTML = '<div class="text-xs text-slate-400">No classes found.</div>';
      } else {
        container.innerHTML = groupKeys.map(g => \`
          <label class="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer p-1 rounded hover:bg-slate-100">
            <input type="checkbox" name="editTeacherClassItem" value="\${g}" \${assigned.includes(g) ? 'checked' : ''} class="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4">
            <span>\${g}</span>
          </label>
        \`).join('');
      }

      document.getElementById('editTeacherModal').classList.remove('hidden');
    }

    function closeEditTeacherModal() {
      document.getElementById('editTeacherModal').classList.add('hidden');
    }

    function saveTeacherAssignedClasses() {
      const username = document.getElementById('editTeacherUsername').value;
      const teachers = JSON.parse(localStorage.getItem(STORAGE_KEY_TEACHERS)) || {};
      if (!teachers[username]) return;

      const checked = document.querySelectorAll('input[name="editTeacherClassItem"]:checked');
      const newAssigned = Array.from(checked).map(cb => cb.value);

      if (newAssigned.length === 0) {
        showToast("⚠️ Teacher must be assigned to at least one class", true);
        return;
      }

      teachers[username].assignedGroups = newAssigned;
      localStorage.setItem(STORAGE_KEY_TEACHERS, JSON.stringify(teachers));
      triggerRealtimeSync();

      // If current user is this teacher, update their session too!
      if (currentUser && currentUser.username === username) {
        currentUser.assignedGroups = newAssigned;
        sessionStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(currentUser));
      }

      closeEditTeacherModal();
      renderAdminPanel();
      showToast("Updated classes for " + teachers[username].name);
    }

    function deleteGroup(groupName) {
      if (!confirm("Are you sure you want to delete group '" + groupName + "'?")) return;
      const groups = JSON.parse(localStorage.getItem(STORAGE_KEY_GROUPS)) || {};
      delete groups[groupName];
      localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(groups));
      triggerRealtimeSync();
      if (selectedGroup === groupName) {
        selectedGroup = Object.keys(groups)[0] || "Upper-intermediate";
      }
      renderAdminPanel();
      showToast("Group deleted");
    }

    function deleteTeacher(username) {
      if (!confirm("Are you sure you want to delete teacher account '" + username + "'?")) return;
      const teachers = JSON.parse(localStorage.getItem(STORAGE_KEY_TEACHERS)) || {};
      delete teachers[username];
      localStorage.setItem(STORAGE_KEY_TEACHERS, JSON.stringify(teachers));
      triggerRealtimeSync();
      renderAdminPanel();
      showToast("Teacher account deleted");
    }

    // --- ABOUT US & LLC PHOTO MANAGEMENT ---
    function renderAboutUs() {
      const about = JSON.parse(localStorage.getItem(STORAGE_KEY_ABOUT)) || (serverData.about || {});
      const photoEl = document.getElementById('llcPhotoDisplay');
      const captionEl = document.getElementById('llcPhotoCaptionDisplay');
      const urlInput = document.getElementById('llcPhotoUrlInput');
      const captionInput = document.getElementById('llcPhotoCaptionInput');

      if (photoEl && about.photoUrl) {
        photoEl.src = about.photoUrl;
      }
      if (captionEl && about.photoCaption) {
        captionEl.textContent = about.photoCaption;
      }
      if (urlInput && about.photoUrl) {
        urlInput.value = about.photoUrl;
      }
      if (captionInput && about.photoCaption) {
        captionInput.value = about.photoCaption;
      }
    }

    function toggleLLCPhotoEditor() {
      const card = document.getElementById('llcPhotoEditorCard');
      if (card) {
        card.classList.toggle('hidden');
        if (!card.classList.contains('hidden')) {
          renderAboutUs();
        }
      }
    }

    function handleUploadLLCPhotoFile(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        const dataUrl = e.target.result;
        const about = JSON.parse(localStorage.getItem(STORAGE_KEY_ABOUT)) || (serverData.about || {});
        about.photoUrl = dataUrl;
        localStorage.setItem(STORAGE_KEY_ABOUT, JSON.stringify(about));

        const photoEl = document.getElementById('llcPhotoDisplay');
        if (photoEl) photoEl.src = dataUrl;

        const urlInput = document.getElementById('llcPhotoUrlInput');
        if (urlInput) urlInput.value = "";

        triggerRealtimeSync();
        showToast("✅ LLC Photo uploaded and saved!");
      };
      reader.readAsDataURL(file);
    }

    function handleSaveLLCPhotoUrl() {
      const urlInput = document.getElementById('llcPhotoUrlInput');
      const newUrl = urlInput ? urlInput.value.trim() : "";
      if (!newUrl) {
        showToast("⚠️ Please enter a valid photo URL", true);
        return;
      }

      const about = JSON.parse(localStorage.getItem(STORAGE_KEY_ABOUT)) || (serverData.about || {});
      about.photoUrl = newUrl;
      localStorage.setItem(STORAGE_KEY_ABOUT, JSON.stringify(about));

      const photoEl = document.getElementById('llcPhotoDisplay');
      if (photoEl) photoEl.src = newUrl;

      triggerRealtimeSync();
      showToast("✅ LLC Photo URL updated successfully!");
    }

    function handleSaveLLCCaption() {
      const capInput = document.getElementById('llcPhotoCaptionInput');
      const caption = capInput ? capInput.value.trim() : "";
      const about = JSON.parse(localStorage.getItem(STORAGE_KEY_ABOUT)) || (serverData.about || {});
      about.photoCaption = caption;
      localStorage.setItem(STORAGE_KEY_ABOUT, JSON.stringify(about));

      const capEl = document.getElementById('llcPhotoCaptionDisplay');
      if (capEl) capEl.textContent = caption;

      triggerRealtimeSync();
      showToast("✅ LLC Photo caption saved!");
    }

    function resetDefaultLLCPhoto() {
      const defaultPhoto = "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80";
      const defaultCaption = "Main Educational Campus & Administrative Headquarters of Dunyoi Khirad LLC";
      const about = JSON.parse(localStorage.getItem(STORAGE_KEY_ABOUT)) || (serverData.about || {});
      about.photoUrl = defaultPhoto;
      about.photoCaption = defaultCaption;
      localStorage.setItem(STORAGE_KEY_ABOUT, JSON.stringify(about));

      renderAboutUs();
      triggerRealtimeSync();
      showToast("Photo restored to default");
    }

    // --- TOAST FEEDBACK ---
    function showToast(message, isError = false) {
      const toast = document.getElementById('toast');
      const toastMsg = document.getElementById('toastMsg');
      const toastIcon = document.getElementById('toastIcon');

      toastMsg.textContent = message;
      toastIcon.textContent = isError ? '⚠️' : '✅';
      
      toast.classList.remove('translate-y-20', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');

      setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-20', 'opacity-0');
      }, 3000);
    }

    // Initialize UI on page load
    updateAuthUI();
    switchTab('news');
  </script>
</body>
</html>`;

  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Length': Buffer.byteLength(html)
  });
  res.end(html);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Dunyoi Khirad Academic Portal Server running on http://0.0.0.0:${PORT}`);
});
