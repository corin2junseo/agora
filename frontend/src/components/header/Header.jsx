import React from "react";
import "./header.css";
import { Link } from "react-router-dom";

const Header = ({ isAuth }) => {
  return (
    <header>
      <div className="logo">Agora E-Learning</div>

      <div className="link">
        <Link to={"/"}>메인</Link>
        <Link to={"/courses"}>강의</Link>
        <Link to={"/about"}>소개</Link>
        {isAuth ? (
          <>
            <Link to={"/account"}>내 계정</Link>
            <Link to={"/logout"}>로그아웃</Link>
          </>
        ) : (
          <Link to={"/login"}>로그인</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
