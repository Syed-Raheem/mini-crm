const express = require("express");
const Lead = require("../models/Lead");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public contact form API
router.post("/", async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: "Failed to create lead" });
  }
});

// Protected: Get all leads
router.get("/", authMiddleware, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leads" });
  }
});

// Protected: Update status
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: "Failed to update status" });
  }
});

// Protected: Add note
router.put("/:id/notes", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          notes: { text },
        },
      },
      { new: true }
    );

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: "Failed to add note" });
  }
});

module.exports = router;