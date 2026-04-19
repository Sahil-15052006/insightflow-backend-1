const mongoose = require("mongoose");

const DatasetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  data: {
    type: Array,
    default: [],
  },

  schema: {
    type: Object,
    default: {},
  },

  stats: {
    type: Object,
    default: {},
  },

  insights: {
    type: Array,
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

DatasetSchema.index({ userId: 1 });

module.exports = mongoose.model("Dataset", DatasetSchema);