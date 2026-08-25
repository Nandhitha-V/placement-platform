const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    score: {
      type: Number, // number of correct answers
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    answers: [
      {
        question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
        selectedIndex: Number,
        isCorrect: Boolean,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attempt", attemptSchema);