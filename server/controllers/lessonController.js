const Lesson = require("../models/Lesson");

// POST /api/lessons — create a new lesson
const createLesson = async (req, res) => {
  try {
    const { title, course, order, content, hasAnimation } = req.body;

    if (!title || !course || !content) {
      return res.status(400).json({ message: "Title, course, and content are required" });
    }

    const lesson = await Lesson.create({ title, course, order, content, hasAnimation });

    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/lessons — fetch all lessons, optionally filtered by course
const getLessons = async (req, res) => {
  try {
    const filter = {};
    if (req.query.course) {
      filter.course = req.query.course; // e.g. /api/lessons?course=COURSE_ID
    }

    const lessons = await Lesson.find(filter).populate({
      path: "course",
      populate: { path: "category" },
    });
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createLesson, getLessons };

// GET /api/lessons/:id — fetch a single lesson by its ID
const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate({
      path: "course",
      populate: { path: "category" },
    });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/lessons/:id
const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/lessons/:id — update an existing lesson
const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the UPDATED document, not the old one
      runValidators: true, // still enforce schema rules on update
    });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createLesson, getLessons, getLessonById, deleteLesson, updateLesson };
