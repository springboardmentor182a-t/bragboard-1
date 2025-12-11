import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../pages/auth.css";
import { requestOtp } from "../services/authService";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    const validate = () => {
        const e = {};
        if (!email) e.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setErrors({});
        setMessage("");

        try {
            await requestOtp(email);
            setMessage("OTP sent to your email (check console in dev mode).");
        } catch (err) {
            setErrors({ general: err?.message || "Failed to send OTP" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bb-auth-page">
            <div className="bb-auth-card">
                <div className="bb-brand" style={{ textAlign: "left" }}>
                    {/* Logo removed */}
                    <h2 className="bb-app-title">Reset your BRAGBOARD password</h2>
                    <p className="bb-app-subtitle">
                        Enter your registered email to receive OTP
                    </p>
                </div>

                <form className="bb-form" onSubmit={handleSubmit} noValidate>
                    {errors.general && (
                        <div className="bb-error" style={{ marginBottom: "0.5rem" }}>
                            {errors.general}
                        </div>
                    )}
                    {message && (
                        <div className="bb-success" style={{ marginBottom: "0.5rem" }}>
                            {message}
                        </div>
                    )}

                    <label className="bb-label">
                        Email
                        <input
                            type="email"
                            className={`bb-input ${errors.email ? "bb-input-error" : ""}`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@company.com"
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? "fp-email-error" : undefined}
                            required
                        />
                        {errors.email && (
                            <div id="fp-email-error" className="bb-error">
                                {errors.email}
                            </div>
                        )}
                    </label>

                    <button type="submit" className="bb-submit" disabled={loading}>
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                </form>

                <p className="bb-foot" style={{ marginTop: "1rem" }}>
                    Remembered? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
