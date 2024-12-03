import React, { useEffect, useState } from "react";
import "./coursedescription.css";
import { useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { UserData } from "../../context/UserContext";
import Loading from "../../components/loading/Loading";

const CourseDescription = ({ user }) => {
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const { fetchUser } = UserData();
  const { fetchCourse, course, fetchCourses, fetchMyCourse } = CourseData();

  useEffect(() => {
    fetchCourse(params.id);
  }, [params.id]);

  const handleAccessCourse = () => {
    if (user && user.subscription.includes(course._id)) {
      navigate(`/course/${course._id}`);
    } else {
      toast.error("이 과정을 구매해야 합니다.");
    }
  };

  const handlePurchaseCourse = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/course/purchase/${course._id}`,
        { courseId: course._id }, // courseId 포함
        {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization 헤더에 JWT 포함
          },
        }
      );
      console.log(data);
      await fetchUser();
      await fetchCourses();
      await fetchMyCourse();
      toast.success(data.message);
    } catch (error) {
      const message = error.response ? error.response.data.message : "문제가 발생했습니다.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  

  // 버튼 텍스트 결정
  const buttonText = user && user.subscription.includes(course._id) ? "학습하기" : "구매하기";

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {course && (
            <div className="course-description">
              <div className="course-header">
                <img
                  src={`${server}/${course.image}`}
                  alt=""
                  className="course-image"
                />
                <div className="course-info">
                  <h2>{course.title}</h2>
                  <p>Instructor: {course.createdBy}</p>
                  <p>Duration: {course.duration} weeks</p>
                </div>
              </div>

              <p>{course.description}</p>

              <p>{course.price}원</p>

              {user && user.subscription.includes(course._id) ? (
                <button onClick={handleAccessCourse} className="common-btn">
                  학습하기
                </button>
              ) : (
                <button onClick={handlePurchaseCourse} className="common-btn">
                  구매하기
                </button>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CourseDescription;
