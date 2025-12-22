
import React from "react";
import { Link } from "react-router-dom";
import "../pages/auth.css";
import LoginForm from "../components/LoginForm";

export default function Login() {
  return (
    <div className="bb-auth-page">
      <div className="bb-auth-card" role="region" aria-label="Login form">
        <div className="bb-brand">
          <h1 className="bb-app-title">BragBoard</h1>
          <p className="bb-app-subtitle">Sign in to your account</p>
        </div>

        <LoginForm />

        <p className="bb-foot">
          Don't have an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}
