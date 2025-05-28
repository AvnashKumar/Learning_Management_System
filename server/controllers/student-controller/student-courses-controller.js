const StudentCourses = require("../../models/StudentCourses");
const Courses =require("../../models/Course")
const getCoursesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const studentBoughtCourses = await StudentCourses.findOne({
      userId: studentId,
    });

    res.status(200).json({
      success: true,
      data: studentBoughtCourses.courses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const addCourseToStudent = async (req, res) => {
  try {
    const { userId, userName, userEmail, courseId } = req.body;
    console.log(userId)

    let course = await Courses.findById(courseId);
    console.log("Course",course)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course cannot be found",
      });
    }

    const studentCourses = await StudentCourses.findOne({ userId: userId });

    const courseData = {
      courseId: course._id,
      title: course.title,
      instructorId: course.instructorId,
      instructorName: course.instructorName,
      dateOfPurchase: new Date(),
      courseImage: course.image,
    };

    if (studentCourses) {
      studentCourses.courses.push(courseData);
      await studentCourses.save();
    } else {
      const newStudentCourses = new StudentCourses({
        userId: userId,
        courses: [courseData],
      });
      await newStudentCourses.save();
    }

    await Courses.findByIdAndUpdate(courseId, {
      $addToSet: {
        students: {
          studentId: userId,
          studentName: userName,
          studentEmail: userEmail,
          paidAmount: 0,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Course Added Successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = { getCoursesByStudentId , addCourseToStudent};
