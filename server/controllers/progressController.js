const Attempt = require("../models/attempt");
const Lesson = require("../models/Lesson");

// GET /api/progress/dashboard — aggregate stats for the logged-in user
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all of this user's attempts, with lesson info populated
    const attempts = await Attempt.find({ user: userId })
      .populate("lesson")
      .sort("-createdAt"); // most recent first

    // Get total lessons available in the platform (for "X of Y completed")
    const totalLessons = await Lesson.countDocuments();

    // Since a user might attempt the same lesson multiple times,
    // we only want their BEST attempt per lesson for accuracy stats
    const bestAttemptsByLesson = {};
    attempts.forEach((attempt) => {
      const lessonId = attempt.lesson._id.toString();
      const existing = bestAttemptsByLesson[lessonId];

      if (!existing || attempt.score > existing.score) {
        bestAttemptsByLesson[lessonId] = attempt;
      }
    });

    const uniqueLessonAttempts = Object.values(bestAttemptsByLesson);

    // Calculate overall accuracy across all attempted lessons
    let totalCorrect = 0;
    let totalQuestions = 0;
    uniqueLessonAttempts.forEach((a) => {
      totalCorrect += a.score;
      totalQuestions += a.totalQuestions;
    });

    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    // Build a simple list for the frontend
    const lessonProgress = uniqueLessonAttempts.map((a) => ({
      lessonId: a.lesson._id,
      lessonTitle: a.lesson.title,
      score: a.score,
      totalQuestions: a.totalQuestions,
      attemptedAt: a.createdAt,
    }));

    res.status(200).json({
      lessonsCompleted: uniqueLessonAttempts.length,
      totalLessons,
      accuracy,
      lessonProgress,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getDashboardData };