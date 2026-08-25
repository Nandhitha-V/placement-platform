const express = require("express");
const router = express.Router();
const { createQuestion, getQuestionsByLesson, submitAnswers } = require("../controllers/questionController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", createQuestion);
router.get("/lesson/:lessonId", getQuestionsByLesson);
router.post("/submit", protect, submitAnswers); // must be logged in

module.exports = router;