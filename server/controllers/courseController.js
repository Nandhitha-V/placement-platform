const Course = require("../models/Course");

// POST /api/courses — create a new course
const createCourse = async (req, res) => {
  try {
    const { title, description, category, order } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: "Title and category are required" });
    }

    const course = await Course.create({ title, description, category, order });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/courses — fetch all courses, with category data filled in
const getCourses = async (req, res) => {
  try {
    // .populate("category") replaces the category ObjectId with the actual Category document
    const courses = await Course.find().populate("category");
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createCourse, getCourses };