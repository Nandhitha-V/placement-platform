const express = require("express");
const router = express.Router();
const { createLesson, getLessons, getLessonById } = require("../controllers/lessonController");

router.post("/", createLesson);
router.get("/", getLessons);
router.get("/:id", getLessonById);

module.exports = router;