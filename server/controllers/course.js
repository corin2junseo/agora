//import { instance } from "../index.js";//결제 활성화 x 
import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { User } from "../models/User.js";
import crypto from "crypto";
import { Payment } from "../models/Payment.js";
import { Progress } from "../models/Progress.js";

export const getAllCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find();
  res.json({
    courses,
  });
});

export const getSingleCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  res.json({
    course,
  });
});

export const fetchLectures = TryCatch(async (req, res) => {
  const lectures = await Lecture.find({ course: req.params.id });

  const user = await User.findById(req.user._id);

  if (user.role === "admin") {
    return res.json({ lectures });
  }

  if (!user.subscription.includes(req.params.id))
    return res.status(400).json({
      message: "You have not subscribed to this course",
    });

  res.json({ lectures });
});

export const fetchLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  const user = await User.findById(req.user._id);

  if (user.role === "admin") {
    return res.json({ lecture });
  }

  if (!user.subscription.includes(lecture.course))
    return res.status(400).json({
      message: "You have not subscribed to this course",
    });

  res.json({ lecture });
});

export const getMyCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find({ _id: req.user.subscription });

  res.json({
    courses,
  });
});

export const checkout = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  const course = await Courses.findById(req.params.id);

  if (user.subscription.includes(course._id)) {
    return res.status(400).json({
      message: "이미 수강한 강좌입니다",
    });
  }

  const options = {
    amount: Number(course.price),
    currency: "INR",
  };

  const order = await instance.orders.create(options);
  //해결못함

  res.status(201).json({
    order,
    course,
  });
});

export const paymentVerification = TryCatch(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.Razorpay_Secret)
    .update(body)
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    const user = await User.findById(req.user._id);

    const course = await Courses.findById(req.params.id);

    user.subscription.push(course._id);

    await Progress.create({
      course: course._id,
      completedLectures: [],
      user: req.user._id,
    });

    await user.save();

    res.status(200).json({
      message: "Course Purchased Successfully",
    });
  } else {
    return res.status(400).json({
      message: "Payment Failed",
    });
  }
});

export const addProgress = TryCatch(async (req, res) => {
  const progress = await Progress.findOne({
    user: req.user._id,
    course: req.query.course,
  });

  const { lectureId } = req.query;

  if (progress.completedLectures.includes(lectureId)) {
    return res.json({
      message: "Progress recorded",
    });
  }

  progress.completedLectures.push(lectureId);

  await progress.save();

  res.status(201).json({
    message: "new Progress added",
  });
});

export const getYourProgress = TryCatch(async (req, res) => {
  const progress = await Progress.find({
    user: req.user._id,
    course: req.query.course,
  });

  if (!progress) return res.status(404).json({ message: "null" });

  const allLectures = (await Lecture.find({ course: req.query.course })).length;

  const completedLectures = progress[0].completedLectures.length;

  const courseProgressPercentage = (completedLectures * 100) / allLectures;

  res.json({
    courseProgressPercentage,
    completedLectures,
    allLectures,
    progress,
  });
});

export const kakaoPayment = TryCatch(async (req,res) =>{
  const token = req.headers.token;
  const course = Courses.findOne()
  
  //추가
});

export const enrollCourse = TryCatch(async (req, res) => {
  const token = req.headers.token;  
  const course = Courses.findOne()

  if (course == null) {
    res.json({
      message:"정보 없음"
    })
  }

  res.json({
    message:"수강신청 완료"
  })
});

export const purchaseCourse = TryCatch(async (req, res) => {
  // 요청 본문에서 userId와 courseId를 가져옵니다.
  const { courseId } = req.body; // userId는 req.user._id로 가져옵니다.
  //const userId = req.user._id; // 인증된 사용자 ID

  try {
    // 사용자 정보를 데이터베이스에서 가져옵니다.
    const user = await User.findById('674efe255b79057754aadeb6');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 코스 정보를 데이터베이스에서 가져옵니다.
    const course = await Courses.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 사용자의 구독 목록에 코스가 포함되어 있는지 확인합니다.
    if (user.subscription.includes(course._id)) {
      return res.status(400).json({ message: "You already purchased this course" });
    }

    // 코스를 구매하는 로직을 여기에 추가합니다.
    // 예를 들어, 사용자의 구독 목록에 코스를 추가합니다.
    user.subscription.push(course._id);
    await user.save();

    return res.status(200).json({ message: "Course purchased successfully", courseId });
  } catch (error) {
    console.error("Error purchasing course:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});



export const purchaseCourse2 = TryCatch(async (req, res) => {
  const { userId, courseId } = req.body; // 요청 본문에서 userId와 courseId 가져오기
  userId.subscription.includes(courseId);

  // const user = await User.findById(req.user._id);
  
  // const course = await Courses.findById(req.params.id);
  // user.subscription.includes(course._id)
});
  // const { courseId } = req.params;
  // const userId = req.user._id; // JWT에서 사용자 ID 가져오기

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
//     }

//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ message: "강좌를 찾을 수 없습니다." });
//     }

//     if (user.subscription.includes(courseId)) {
//       return res.status(400).json({ message: "이미 이 강좌를 구독하고 있습니다." });
//     }

//     user.subscription.push(courseId);
//     await user.save();

//     return res.status(200).json({ message: "구독이 완료되었습니다." });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "서버 오류가 발생했습니다." });
//   }
// });