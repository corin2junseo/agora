import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { server } from "../main";
import toast, { Toaster } from "react-hot-toast";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const loginUser = async (email, password, navigate, fetchMyCourse) => {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/login`, {
        email,
        password,
      });

      toast.success(data.message);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuth(true);
      await fetchMyCourse(); // Fetch courses after login
      navigate("/"); // Redirect to home or courses page
    } catch (error) {
      setIsAuth(false);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuth(false);
    toast.success("Logged out successfully");
  };

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(data.user);
      setIsAuth(true);
    } catch (error) {
      console.log(error);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }, []); // 의존성 배열을 빈 배열로 설정하여 최초 마운트 시에만 호출하게 함

  const registerUser = async (name, email, password, navigate) => {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/register`, {
        name,
        email,
        password,
      });

      toast.success(data.message);
      localStorage.setItem("activationToken", data.activationToken);
      setBtnLoading(false);
      navigate("/verify");
    } catch (error) {
      setBtnLoading(false);
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  useEffect(() => {
    fetchUser(); // Fetch user on initial load
  }, [fetchUser]); // fetchUser를 의존성 배열에 추가

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        setIsAuth,
        isAuth,
        loginUser,
        logoutUser,
        btnLoading,
        loading,
        registerUser,
        fetchUser,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("UserData must be used within a UserContextProvider");
  }
  return context;
};
// fetchUser 함수의 의존성 관리: fetchUser 함수가 매번 새로운 참조를 가지지 않도록 useCallback을 사용하여 메모이제이션합니다.

// req 변수를 제거: console.log(req.user.role);는 정의되지 않은 변수 req를 참조하고 있습니다. 이를 제거하거나 적절히 수정해야 합니다.

// 비동기 함수 관리: fetchUser를 useEffect 안에서 호출할 때 비동기 처리를 적절히 관리합니다.