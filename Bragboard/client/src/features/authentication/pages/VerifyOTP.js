import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "./auth.css";

export default function VerifyOTP() {
    const location = useLocation();
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");

    const email = (location.state && location.state.email) || "";

    function handleSubmit(evt) {
        evt.preventDefault();
        if (!otp) {
            setError("Enter the verification code");
            return;
        }
        // Simulate OTP check
        if (otp.trim() === "123456") {
            navigate("/change-password", { state: { email }, replace: true });
        } else {
            setError("Incorrect code (try 123456)");
        }
    }

    return (
        <div className="bb-auth-page">
            <div className="bb-auth-card" role="region" aria-label="Verify OTP form">
                <div className="bb-brand">
                    <img src="/logo.png" alt="BragBoard Logo" className="bb-logo" />
                    <div><h1>BragBoard</h1></div>
                </div>

                <form className="bb-form" onSubmit={handleSubmit} noValidate>
                    <p className="bb-small">We sent a code to <strong>{email || "your email"}</strong>. Use <code>123456</code> for demo.</p>

                    <label className="bb-label">
                        Verification code
                        <input
                            type="text"
                            className={`bb-input ${error ? "bb-input-error" : ""}`}
                            value={otp}
                            onChange={(e) => { setOtp(e.target.value); setError(""); }}
                            placeholder="Enter 6-digit code"
                        />
                        {error && <div className="bb-error">{error}</div>}
                    </label>

                    <button type="submit" className="bb-submit">Verify code</button>

                    <p className="bb-foot">
                        <Link to="/forgot-password">Did not receive code?</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

