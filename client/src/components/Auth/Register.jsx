import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../Common/Input";
import "../../styles/auth.css";
import { postJson } from "../../lib/api";   

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErr("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setOk("");

    // basic validation
    if (!form.username || !form.email || !form.password || !form.confirm) {
      setErr("Please fill all fields.");
      return;
    }
    if (form.password !== form.confirm) {
      setErr("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setErr("Password should be at least 8 characters.");
      return;
    }
    if (form.password.length > 50) {
      setErr("Password must be at most 50 characters.");
      return;
    }

    setLoading(true);
    try {
      
      const { status, data } = await postJson("/register/", {
        email: form.email,
        password: form.password,
        name: form.username,
      });

      console.log("Register response:", status, data);

      if (status === 200 || status === 201) {
        setOk("Account created — please check email for verification code.");
        
        navigate("/verify-otp", { state: { email: form.email } });
      } else if (status === 409) {
        
        setErr(data?.detail || "An account with this email already exists.");
      }  else {
  // FastAPI 422: detail is usually an array of error objects
  let message = "Failed to send OTP.";

  if (Array.isArray(data?.detail) && data.detail.length > 0) {
    message = data.detail[0]?.msg || message;
  } else if (typeof data?.detail === "string") {
    message = data.detail;
  } else if (data?.message) {
    message = data.message;
  }

  setErr(message);
}
    } catch (e) {
      console.error(e);
      setErr("Network/server error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <h1 className="big-title">Roll the Carpet .!</h1>
      </div>

      <div className="auth-card">
        <h2 className="auth-title">Signup</h2>
        <p className="auth-sub">Just some details to get you in.!</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <Input
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={onChange}
            required
          />

          <Input
            name="email"
            type="email"
            placeholder="Email / Phone"
            value={form.email}
            onChange={onChange}
            required
          />

          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            required
          />

          <Input
            name="confirm"
            type="password"
            placeholder="Confirm Password"
            value={form.confirm}
            onChange={onChange}
            required
          />

          {err && (
  <div className="error" role="alert">
    {String(err)}
  </div>
)}

          {ok && <div className="success" role="status">{ok}</div>}

          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? "Creating…" : "Signup"}
          </button>

          <div style={{ height: 18 }}></div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }}></div>
            <div style={{ color: "var(--muted)" }}>Or</div>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }}></div>
          </div>

          <div className="auth-footer" style={{ marginTop: 18 }}>
            <div>Already have an account ? <a href="/login">login</a></div>
          </div>
        </form>
      </div>
    </div>
  );
}
