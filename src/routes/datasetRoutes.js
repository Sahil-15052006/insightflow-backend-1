const express = require("express");
const router = express.Router();
const Dataset = require("../models/Dataset");
const auth = require("../middleware/auth");


// ✅ Save dataset
router.post("/", auth, async (req, res) => {
  try {
    const { name, data, schema, stats, insights } = req.body;

    const dataset = await Dataset.create({
      userId: req.user.id,
      name,
      data,
      schema,
      stats,
      insights,
    });

    res.status(201).json(dataset);
  } catch (err) {
    res.status(500).json({ message: "Failed to save dataset" });
  }
});


// ✅ Get all datasets (fast list)
router.get("/", auth, async (req, res) => {
  try {
    const datasets = await Dataset.find({ userId: req.user.id })
      .select("name createdAt stats");

    res.json(datasets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch datasets" });
  }
});


// ✅ Get single dataset
router.get("/:id", auth, async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id);

    if (!dataset) {
      return res.status(404).json({ message: "Dataset not found" });
    }

    res.json(dataset);
  } catch (err) {
    res.status(500).json({ message: "Error fetching dataset" });
  }
});


// ✅ Delete dataset
router.delete("/:id", auth, async (req, res) => {
  try {
    await Dataset.findByIdAndDelete(req.params.id);
    res.json({ message: "Dataset deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;