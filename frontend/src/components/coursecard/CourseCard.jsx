import React from "react";
import "./courseCard.css";
import { server } from "../../main";
import { UserData } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { CourseData } from "../../context/CourseContext";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const { user, isAuth } = UserData();
  const { fetchCourses } = CourseData();

  const deleteHandler = async (id) => {
    if (confirm("Are you sure you want to delete this course?")) {
      try {
        const { data } = await axios.delete(`${server}/api/course/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        toast.success(data.message);
        fetchCourses();
      } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting course");
      }
    }
  };

  // 사용자의 구독 상태 확인
  const isSubscribed = user && user.subscription ? user.subscription.includes(course._id) : false;

  return (
    <div className="course-card">
      <img src={`${server}/${course.image}`} alt="" className="course-image" />
      <h3>{course.title}</h3>
      <p>강사- {course.createdBy}</p>
      <p>기간- {course.duration}주차</p>
      <p>가격- {course.price}원</p>

      {isAuth ? (
        <>
          {user && user.role !== "admin" ? (
            <>
              {isSubscribed ? (
                <button
                  onClick={() => navigate(`/course/study/${course._id}`)}
                  className="common-btn"
                >
                  학습하기
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/course/${course._id}`)}
                  className="common-btn"
                >
                  수강신청
                </button>
              )}
            </>
          ) : (
            <button
              onClick={() => navigate(`/course/${course._id}`)}
              className="common-btn"
            >
              수강신청
            </button>
          )}
        </>
      ) : (
        <button onClick={() => navigate("/login")} className="common-btn">
          Get Started
        </button>
      )}

      <br />

      {user && user.role === "admin" && (
        <button
          onClick={() => deleteHandler(course._id)}
          className="common-btn"
          style={{ background: "red" }}
        >
          강좌 삭제
        </button>
      )}
    </div>
  );
};

export default CourseCard;
