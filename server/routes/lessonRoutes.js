const express = require("express");
const router = express.Router();
const { createLesson, getLessons } = require("../controllers/lessonController");

router.post("/", createLesson);
router.get("/", getLessons);

module.exports = router;