const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use('/students', express.static(path.join(__dirname, 'public/students')));

const loginRoute = require('./routes/LoginRoute.js');
const studentsRoute = require('./routes/StudentsRoutes.js');

app.use('/', loginRoute);
app.use('/', studentsRoute);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


// const mysql = require('mysql2');
// const express = require('express');
// const cors = require('cors');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// const app = express();
// const port = 8000;

// app.use(cors());
// app.use(express.json());

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '1234',
//     database: 'test_db'
// })

// db.connect(err => {
//     if (err) {
//         console.error('Database connection failed:', err);
//         return;
//     }
//     console.log('Connected to MySQL database');
// });

// app.post('/login', (req, res) => {
//     const {
//         username,
//         password
//     } = req.body;

//     //checking if username and password are provided
//      if (!username || !password) {
//         return res.status(400).json({ message: 'Username and password are required' });
//     }

//     // Check for length, or allow only alphanumeric usernames
//     const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
//     if (!usernameRegex.test(username)) {
//         return res.status(400).json({ message: 'Invalid username format' });
//     }

//     const values = [username, password];
//     const sql = 'SELECT * FROM admin_accounts WHERE username = ? AND password = ?;'

//     db.query(sql, values, (err, result) => {
//          if (err) {
//             console.error('Query error:', err);
//             return res.status(500).json({ message: 'Internal server error' });
//         }

//         if (result.length > 0) {
//             return res.json({ message: 'Login successful', user: result[0] });
//         } else {
//             return res.status(401).json({ message: 'Invalid username or password' });
//         }
// })
    
// });

// // Ensure target folder exists
// const studentDir = path.join(__dirname, 'public/students');
// if (!fs.existsSync(studentDir)) {
//   fs.mkdirSync(studentDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, studentDir),
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
//     cb(null, uniqueName);
//   }
// });

// const upload = multer({ storage });
// app.use('/students', express.static(path.join(__dirname, 'public/students')));

// app.post("/add-student", upload.single("profilePhoto"), async (req, res) => {
//   try {
//     const {
//       studentName,
//       gender,
//       examYear,
//       email,
//       nic,
//       mobile,
//       address
//     } = req.body;

//      // Parse courseModules (which should be sent as a JSON string)
//     const courseModules = JSON.parse(req.body.courseModules || "[]");

//     // Get relative path of uploaded image
//     const profilePhoto = req.file ? `/students/${req.file.filename}` : null;

//     // 1. Insert into students
//     const [studentResult] = await db.execute(
//       `INSERT INTO students (student_name, profile_photo, gender, exam_year, email, nic, mobile, address)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//       [studentName, profilePhoto, gender, examYear, email, nic, mobile, address]
//     );

//     const studentId = studentResult.insertId;

//     // 2. Insert each course module
//     for (const moduleName of courseModules) {
//       await db.execute(
//         `INSERT INTO student_modules (student_id, module_name) VALUES (?, ?)`,
//         [studentId, moduleName]
//       );
//     }

//     res.status(200).json({ message: "Student added successfully!" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to insert data." });
//   }
// });

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });