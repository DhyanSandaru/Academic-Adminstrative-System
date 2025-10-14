const express = require("express");
const router = express.Router();
const { syncToFirestore, restoreFromFirestore } = require("../sync/syncService");

router.get("/sync-now", async (req, res) => {
  try {
    await syncToFirestore();
    res.json({ message: "Sync complete" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sync failed" });
  }
});

router.get("/restore-now", async (req, res) => {
  try {
    await restoreFromFirestore();
    res.json({ message: "Restore complete" });
  } catch (err) {
    res.status(500).json({ message: "Restore failed" });
  }
});

module.exports = router;
