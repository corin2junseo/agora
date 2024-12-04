import React, { useEffect } from "react";
import { MdDashboard } from "react-icons/md";
import "./account.css";
import { IoMdLogOut } from "react-icons/io";
import { UserData } from "../../context/UserContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const { user, setIsAuth, setUser, loading, fetchUser } = UserData(); // UserData에서 user 정보를 가져옴
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      await fetchUser(); // 사용자 정보 가져오기
    };
    
    loadUserData(); // 컴포넌트가 마운트될 때 사용자 정보 가져오기
  }, [fetchUser]);
  useEffect(() => {
    fetchUser(); // Fetch user on initial load
  }, []);
  const logoutHandler = () => {
    localStorage.clear();
    setUser(null); // user 상태를 null로 설정
    setIsAuth(false);
    toast.success("Logged Out");
    navigate("/login");
  };

  if (loading) {
    return <p>Loading...</p>; // 로딩 중일 때 메시지 표시
  }

  return (
    <div>
      {user ? ( // user가 존재할 경우에만 프로필 정보 표시
        <div className="profile">
          <h2>My Profile</h2>
          <div className="profile-info">
            <p>
              <strong>Name - {user.name}</strong>
            </p>

            <p>
              <strong>Email - {user.email}</strong>
            </p>

            <button
              onClick={() => navigate(`/${user._id}/dashboard`)}
              className="common-btn"
            >
              <MdDashboard />
              Dashboard
            </button>

            <br />

            {user.role === "admin" && (
              <button
                onClick={() => navigate(`/admin/dashboard`)}
                className="common-btn"
              >
                <MdDashboard />
                Admin Dashboard
              </button>
            )}

            <br />

            <button
              onClick={logoutHandler}
              className="common-btn"
              style={{ background: "red" }}
            >
              <IoMdLogOut />
              Logout
            </button>
          </div>
        </div>
      ) : (
        <p>Please log in to view your profile.</p> // 로그인하지 않은 경우 메시지 표시
      )}
    </div>
  );
};

export default Account;
