const Question = require("../models/Question");
const Attempt = require("../models/attempt");

// POST /api/questions — create a new question
const createQuestion = async (req, res) => {
  try {
    const { lesson, questionText, options, correctAnswerIndex, explanation, order } = req.body;

    if (!lesson || !questionText || !options || correctAnswerIndex === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const question = await Question.create({
      lesson,
      questionText,
      options,
      correctAnswerIndex,
      explanation,
      order,
    });

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/questions/lesson/:lessonId — fetch questions for a lesson, WITHOUT the answer
const getQuestionsByLesson = async (req, res) => {
  try {
    const questions = await Question.find({ lesson: req.params.lessonId })
      .select("-correctAnswerIndex -explanation") // exclude these fields from the response
      .sort("order");

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/questions/submit — grade answers and save an attempt
const submitAnswers = async (req, res) => {
  try {
    const { lessonId, answers } = req.body;
    // answers = [{ questionId, selectedIndex }, ...]

    if (!lessonId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "lessonId and answers array are required" });
    }

    let score = 0;
    const gradedAnswers = [];
    const resultsWithExplanations = [];

    for (const answer of answers) {
      // Fetch the REAL question (with correctAnswerIndex) — server-side only
      const question = await Question.findById(answer.questionId);

      if (!question) continue; // skip if somehow invalid

      const isCorrect = question.correctAnswerIndex === answer.selectedIndex;
      if (isCorrect) score++;

      gradedAnswers.push({
        question: question._id,
        selectedIndex: answer.selectedIndex,
        isCorrect,
      });

      // This is what we send back to the frontend — safe to reveal now, after grading
      resultsWithExplanations.push({
        questionId: question._id,
        questionText: question.questionText,
        selectedIndex: answer.selectedIndex,
        correctAnswerIndex: question.correctAnswerIndex,
        isCorrect,
        explanation: question.explanation,
      });
    }

    // Save the attempt, linked to the logged-in user (from our auth middleware)
    const attempt = await Attempt.create({
      user: req.user._id,
      lesson: lessonId,
      score,
      totalQuestions: answers.length,
      answers: gradedAnswers,
    });

    res.status(201).json({
      score,
      totalQuestions: answers.length,
      results: resultsWithExplanations,
      attemptId: attempt._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createQuestion, getQuestionsByLesson, submitAnswers };



