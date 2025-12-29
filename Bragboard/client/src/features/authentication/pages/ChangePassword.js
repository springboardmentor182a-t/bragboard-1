import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BrandHeader from "../../../components/BrandHeader";
import "./auth.css";
import { changePassword } from "../services/authService";

export default function ChangePassword() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!password) {
            setError("Password is required");
            return;
        }

        try {
            await changePassword(email, password);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <BrandHeader title="Change your password" />

                <form onSubmit={handleSubmit}>
                    <label>New password</label>
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && <p className="bb-error">{error}</p>}

                    <button type="submit" className="primary-btn">
                        Save new password
                    </button>
                </form>

                <div className="bb-foot">
                    <a href="/login">Back to Sign in</a>
                </div>
            </div>
        </div>
    );
}
