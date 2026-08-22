const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    order: {
      type: Number,
      default: 0, // e.g., Arrays = 1, Stacks = 2 within the same course
    },
    content: {
      type: String, // for now, plain text/HTML explanation — keep it simple
      required: true,
    },
    // Placeholder for future animation reference (Section 4 in your doc)
    // We won't build this yet — just leaving the field ready
    hasAnimation: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lesson", lessonSchema);