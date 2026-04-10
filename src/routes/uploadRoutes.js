const express = require("express");
const router = express.Router();
const multer = require("multer");
const csv = require("csv-parser");
const xlsx = require("xlsx");
const { Readable } =  require('stream')
const {cleanJSONData} = require('../utils/dataCleaner')
const SchemaDetector = require('../utils/SchemaDetector')
const fs = require('fs')

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single('file'), (req, res) => {
  try{

    const file = req.file;

    if (!file) return res.json({ message: "file not uploaded" });

    if (file.mimetype === "text/csv" || file.originalname.endsWith('.csv')) {

      const results = [];
      const stream = fs.createReadStream(file.path);

      stream
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => {
          const schema = SchemaDetector(results)
          res.json({ cleanedData });
        });

    } else {

      const workbook = xlsx.readFile(file.path);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(sheet);

      const cleanedData = cleanJSONData(data, {
        forceStringFields: ["phone"],
        forceNumberFields: ["age", "price"],
        requiredFields: ["name", "email"],
        removeEmptyRows: true
      });

      res.json({ cleanedData });

    }

  }catch(err){

    res.status(500).json({
      message:"failed to upload file",
      error:err.message,
    })

  }
  
});

module.exports=router