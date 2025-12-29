import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { requestOtp } from "../services/authService";
import "./auth.css";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await requestOtp(email);
            navigate("/verify-otp", { state: { email } });
        } catch (err) {
            setError(err.message || "Failed to send OTP");
        }
    };

    return (
        <div className="bb-auth-page">
            <div className="bb-auth-card">
                <div className="bb-brand">
                    <h2 className="bb-app-title">Reset your BragBoard password</h2>
                    <p className="bb-app-subtitle">
                        Enter your registered email to receive OTP
                    </p>
                </div>

                <form className="bb-form" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        className="bb-input"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {error && <div className="bb-error">{error}</div>}

                    <button className="bb-submit">Send OTP</button>
                </form>

                <p className="bb-foot">
                    Remembered? <Link to="/login" className="bb-link">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
