const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const LecturerController = require('../controllers/LecturerController.js');

// Ensure target folder exists
const lecturerDir = path.join(__dirname, '/lecturers');
if (!fs.existsSync(lecturerDir)) {
  fs.mkdirSync(lecturerDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, lecturerDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage }); 

router.post("/add-lecturer", upload.single("profilePhoto"), LecturerController.addLecturer);
router.get("/view-lecturers", LecturerController.fetchLecturers);
router.get("/view-lecturers/:id",LecturerController.fetchLecturerById);
router.put("/view-lecturers/:id",LecturerController.updateLecturerById);

module.exports = router;

