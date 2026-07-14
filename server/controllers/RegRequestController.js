const db = require('../DBconfig.js');
const path = require('path');
const fs = require('fs');

//  Add new remote request to temp DB
exports.AddRequest = async (req, res) => {
  try {
    const {
      studentName,
      gender,
      dob,
      ethnicity,
      email,
      nic,
      mobile,
      address,
      guardianName,
      guardianMobile,
      guardianRelation,
      previousEducation,
      grade,
      curriculum
    } = req.body;

    const courseModules = JSON.parse(req.body.courseModules || "[]");
    const profilePhoto = req.file ? `/public/temp-students/${req.file.filename}` : null;

    await db.query(
      `INSERT INTO pending_requests 
        (studentName, profile_photo, gender, dob, ethnicity, email, nic, mobile, address, guardianName, guardianMobile, guardianRelation, previousEducation, grade, courseModules, curriculum)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        studentName,
        profilePhoto,
        gender,
        dob,
        ethnicity,
        email,
        nic,
        mobile,
        address,
        guardianName,
        guardianMobile,
        guardianRelation,
        previousEducation,
        grade,
        JSON.stringify(courseModules),
        curriculum
      ]
    );

    res.status(200).json({ message: "Registration submitted for approval." });
  } catch (err) {
    console.error("Error saving pending student:", err);
    res.status(500).json({ error: "Failed to save request." });
  }
};

// 📤 Fetch all current pending registrations
exports.fetchRequests = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM pending_requests ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ error: "Failed to fetch requests." });
  }
};

// Approve request → moves to students table
exports.approveRequest = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await db.query("SELECT * FROM pending_requests WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Request not found" });

    const data = rows[0];
    const filename = path.basename(data.profile_photo); // just the image name

    // Move photo from temp → public/students
    const oldPath = path.join(__dirname, '../public/temp-students', filename);
    const newPath = path.join(__dirname, '../public/students', filename);
    try {
      fs.renameSync(oldPath, newPath); // move image file
    } catch (err) {
      console.warn(`⚠️ Failed to move image ${filename}:`, err.message);
    }

    // Simulate request to addStudent
    req.body = {
      studentName: data.studentName,
      gender: data.gender,
      dob: data.dob,
      ethnicity: data.ethnicity,
      email: data.email,
      nic: data.nic,
      mobile: data.mobile,
      address: data.address,
      guardianName: data.guardianName,
      guardianMobile: data.guardianMobile,
      guardianRelation: data.guardianRelation,
      previousEducation: data.previousEducation,
      grade: data.grade,
      courseModules: data.courseModules,
      curriculum: data.curriculum
    };
    req.file = { filename }; 

    // Call your existing controller
    const studentController = require('./StudentController.js');
    await studentController.addStudent(req, res);

    // Delete the pending row
    await db.query("DELETE FROM pending_requests WHERE id = ?", [id]);
  } catch (err) {
    console.error("Error approving request:", err);
    res.status(500).json({ message: "Failed to approve request" });
  }
};

// Reject request → delete from table only
exports.rejectRequest = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await db.query("SELECT profile_photo FROM pending_requests WHERE id = ?", [id]);

    if (rows.length > 0 && rows[0].profile_photo) {
      const filename = path.basename(rows[0].profile_photo);
      const filePath = path.join(__dirname, '../temp-students', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await db.query("DELETE FROM pending_requests WHERE id = ?", [id]);
    res.json({ message: "Request rejected and removed." });
  } catch (err) {
    console.error("Error rejecting request:", err);
    res.status(500).json({ error: "Failed to reject request." });
  }
};
