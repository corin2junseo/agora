import express from "express";
import {
  getAllCourses,
  getSingleCourse,
  fetchLectures,
  fetchLecture,
  getMyCourses,
  checkout,
  paymentVerification,
  enrollCourse,
  purchaseCourse,  
} from "../controllers/course.js";
import { isAuth } from "../middlewares/isAuth.js";


const router = express.Router();

router.get("/course/all", getAllCourses);
router.get("/course/:id", getSingleCourse);
router.get("/lectures/:id", isAuth, fetchLectures);
router.get("/lecture/:id", isAuth, fetchLecture);
router.get("/mycourse", isAuth, getMyCourses);
router.post("/course/checkout/:id", isAuth, checkout);
router.post("/verification/:id", isAuth, paymentVerification);
//추가
router.post('/course/enroll/:id', enrollCourse); // enrollCourse 사용
router.post('/course/purchase/:id', isAuth,purchaseCourse); // enrollCourse 사용


export default router;
