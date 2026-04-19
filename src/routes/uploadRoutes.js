const express = require("express");
const router = express.Router();
const multer = require("multer");
const csv = require("csv-parser");
const xlsx = require("xlsx");
const fs = require("fs");

const DataCleaner = require('../utils/DataCleaner');
const SchemaDetector = require('../utils/SchemaDetector');
const DataTypeConverter = require('../utils/DataTypeConverter');
const DataValidator = require('../utils/DataValidater');
const { generateInsights } = require("../utils/InsightGenerator");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single('file'), (req, res) => {

  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "file not uploaded" });
    }

    if (file.mimetype === "text/csv" || file.originalname.endsWith('.csv')) {

      const results = [];
      const stream = fs.createReadStream(file.path);

      stream
        .pipe(csv())
        .on("data", (row) => results.push(row))
        .on("end", () => {
          processData(results, res);
        });

    } else {

      const workbook = xlsx.readFile(file.path);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(sheet);

      processData(data, res);
    }

  } catch (err) {
    res.status(500).json({
      message: "failed to upload file",
      error: err.message,
    });
  }
});

function processData(data, res) {

  const schema = SchemaDetector(data);
  const convertedData = data.map((row) => {
    return DataTypeConverter(row, schema);
  });
  const cleanedData = DataCleaner(convertedData, schema);
  const validation = DataValidator(cleanedData, schema);
  const insights = generateInsights(cleanedData,schema)

  res.json({
    success: true,
    schema: schema,
    data: cleanedData,
    validation: validation,
    insights:insights
  });
}

module.exports = router;