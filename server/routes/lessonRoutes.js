const express = require("express");
const router = express.Router();
const { createLesson, getLessons, getLessonById, deleteLesson, updateLesson } = require("../controllers/lessonController");

router.post("/", createLesson);
router.get("/", getLessons);
router.get("/:id", getLessonById);
router.delete("/:id", deleteLesson);
router.put("/:id", updateLesson);

module.exports = router;