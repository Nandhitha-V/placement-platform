const Attempt = require("../models/attempt");
const Lesson = require("../models/Lesson");

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Nested populate: Attempt -> Lesson -> Course -> Category
    const attempts = await Attempt.find({ user: userId })
      .populate({
        path: "lesson",
        populate: {
          path: "course",
          populate: { path: "category" },
        },
      })
      .sort("-createdAt");

    const totalLessons = await Lesson.countDocuments();

    // Best attempt per lesson (same as before)
    const bestAttemptsByLesson = {};
    attempts.forEach((attempt) => {
      const lessonId = attempt.lesson._id.toString();
      const existing = bestAttemptsByLesson[lessonId];
      if (!existing || attempt.score > existing.score) {
        bestAttemptsByLesson[lessonId] = attempt;
      }
    });

    const uniqueLessonAttempts = Object.values(bestAttemptsByLesson);

    // Overall stats (same as before)
    let totalCorrect = 0;
    let totalQuestions = 0;
    uniqueLessonAttempts.forEach((a) => {
      totalCorrect += a.score;
      totalQuestions += a.totalQuestions;
    });
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    // NEW: group by category
    const categoryStats = {};
    uniqueLessonAttempts.forEach((a) => {
      // Guard against any lesson whose course/category wasn't set up correctly
      if (!a.lesson.course || !a.lesson.course.category) return;

      const catId = a.lesson.course.category._id.toString();
      const catName = a.lesson.course.category.name;
      const catIcon = a.lesson.course.category.icon;

      if (!categoryStats[catId]) {
        categoryStats[catId] = {
          name: catName,
          icon: catIcon,
          lessonsCompleted: 0,
          correct: 0,
          total: 0,
        };
      }

      categoryStats[catId].lessonsCompleted += 1;
      categoryStats[catId].correct += a.score;
      categoryStats[catId].total += a.totalQuestions;
    });

    // Convert to an array with calculated accuracy per category
    const categoryProgress = Object.values(categoryStats).map((c) => ({
      name: c.name,
      icon: c.icon,
      lessonsCompleted: c.lessonsCompleted,
      accuracy: c.total > 0 ? Math.round((c.correct / c.total) * 100) : 0,
    }));

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
      categoryProgress, // NEW
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getDashboardData };