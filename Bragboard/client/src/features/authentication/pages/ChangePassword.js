// client/src/features/authentication/pages/ChangePassword.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BrandHeader from "../../../components/BrandHeader"; // <-- CORRECT PATH
import "./auth.css";

export default function ChangePassword() {
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // call API or handle change password here
        // then navigate to login or show success
        navigate("/login");
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <BrandHeader title="Change your password" />

                <form onSubmit={handleSubmit}>
                    <label style={{ display: "block", marginBottom: 8 }}>New password</label>
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: "100%", padding: "10px", marginBottom: 16, borderRadius: 6 }}
                        required
                    />

                    <button type="submit" className="primary-btn" style={{ width: "100%" }}>
                        Save new password
                    </button>
                </form>

                <div style={{ marginTop: 12, textAlign: "center" }}>
                    <a href="/login">Back to Sign in</a>
                </div>
            </div>
        </div>
    );
}
