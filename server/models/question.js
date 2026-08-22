const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String], // an array of strings, e.g. ["4", "5", "6", "7"]
      required: true,
      validate: {
        // Custom validation: must have at least 2 options
        validator: (arr) => arr.length >= 2,
        message: "A question needs at least 2 options",
      },
    },
    correctAnswerIndex: {
      type: Number, // e.g. 2 means options[2] is the correct answer
      required: true,
    },
    explanation: {
      type: String, // shown after answering, explains why the answer is correct
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);