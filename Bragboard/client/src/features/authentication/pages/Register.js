

import React from "react";
import { Link } from "react-router-dom";
import "../pages/auth.css";
import SignupForm from "../components/SignupForm";

export default function Register() {
    return (
        <div className="bb-auth-page">
            <div className="bb-auth-card">
                <div className="bb-brand">
                    {/* Logo removed here too */}
                    <h1 className="bb-app-title">Create your BRAGBOARD account</h1>
                    <p className="bb-app-subtitle">
                        Create an employee shout-out account
                    </p>
                </div>

                <SignupForm />

                <p className="bb-foot" style={{ marginTop: "1rem" }}>
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
