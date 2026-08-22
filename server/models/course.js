const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      // This is the "reference" — we store the Category's ObjectId, not its full data
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // tells Mongoose which model this ID points to
      required: true,
    },
    order: {
      type: Number, // controls display order, e.g. "DSA Fundamentals" before "Advanced DSA"
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);