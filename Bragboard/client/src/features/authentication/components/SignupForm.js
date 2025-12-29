import React, { useState } from "react";
import { signup } from "../services/authService";

export default function SignupForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await signup({ name, email, password });
            window.location.href = "/login";
        } catch (err) {
            setError(err.message || "Signup failed");
        }
    };

    return (
        <form className="bb-form" onSubmit={handleSubmit}>
            <input
                className="bb-input"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                className="bb-input"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                className="bb-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {error && <div className="bb-error">{error}</div>}

            <button className="bb-submit">Sign up</button>
        </form>
    );
}
