const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const studentController = require('../controllers/StudentController.js');

// Ensure target folder exists
const studentDir = path.join(__dirname, '/temp-students');
if (!fs.existsSync(studentDir)) {
  fs.mkdirSync(studentDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, studentDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.post("/add-student", upload.single("profilePhoto"), studentController.addStudent);
router.get("/view-students",studentController.fetchStudents);


module.exports = router;