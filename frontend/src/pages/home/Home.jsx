import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import Testimonials from "../../components/testimonials/Testimonials";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="home">
        <div className="home-content">
          <h1>Agora E-learning Platform</h1>
          <p>Realtime Communication, Learn , Grow up</p>
          <button onClick={() => navigate("/courses")} className="common-btn">
            지금 시작해보세요
          </button>
        </div>
      </div>
      <Testimonials />
    </div>
  );
};

export default Home;
