const express = require("express");
const router = express.Router();
const { createLesson, getLessons, getLessonById, deleteLesson } = require("../controllers/lessonController");

router.post("/", createLesson);
router.get("/", getLessons);
router.get("/:id", getLessonById);
router.delete("/:id", deleteLesson);

module.exports = router;