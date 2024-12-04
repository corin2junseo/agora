import React, { useEffect, useState } from "react";
import "./coursedescription.css";
import { useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { UserData } from "../../context/UserContext";
import Loading from "../../components/loading/Loading";

const CourseDescription = () => {
  const { user, fetchUser } = UserData(); // UserData에서 user 정보를 가져옴
  const { fetchCourse, course, fetchCourses, fetchMyCourse } = CourseData();
  const params = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);

  // 사용자 정보 및 강의 정보를 가져오는 useEffect
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchUser(); // 사용자 정보 가져오기
        await fetchCourse(params.id); // 강의 정보 가져오기
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // 모든 데이터 로드가 끝나면 로딩 상태를 false로 설정
      }
    };

    loadData(); // 데이터 로드
  }, [fetchUser, fetchCourse, params.id]);

  const handleAccessCourse = () => {
    // user와 user.subscription가 올바르게 정의되어 있는지 확인
    if (user && Array.isArray(user.subscription) && user.subscription.includes(course._id)) {
      navigate(`/course/study/${course._id}`);
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
  const buttonText = user && user.subscription && user.subscription.includes(course._id) ? "학습하기" : "구매하기";

  if (loading) {
    return <Loading />; // 로딩 중일 때 로딩 컴포넌트 표시
  }

  if (!course) {
    return <p>강의 정보를 찾을 수 없습니다.</p>; // 강의 정보가 없을 경우 메시지 표시
  }

  return (
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

      {user && Array.isArray(user.subscription) && user.subscription.includes(course._id) ? (
        <button onClick={handleAccessCourse} className="common-btn">
          학습하기
        </button>
      ) : (
        <button onClick={handlePurchaseCourse} className="common-btn">
          구매하기
        </button>
      )}
    </div>
  );
};

export default CourseDescription;
