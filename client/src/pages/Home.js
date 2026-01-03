import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";   // ⭐ Make sure to create this file!

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-card">
        <h1 className="home-title">Welcome to BragBoard 🎉</h1>
        <p className="home-subtitle">
          Celebrate achievements. Share shoutouts. Lift each other up!
        </p>

        <Link to="/leaderboard" className="home-btn">
          View Leaderboard →
        </Link>
      </div>
    </div>
  );
};

export default Home;
