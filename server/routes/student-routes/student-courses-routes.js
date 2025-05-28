const express = require("express");
const {
  getCoursesByStudentId, addCourseToStudent
} = require("../../controllers/student-controller/student-courses-controller");

const router = express.Router();

router.get("/get/:studentId", getCoursesByStudentId);
router.post("/add-course",addCourseToStudent)

module.exports = router;
