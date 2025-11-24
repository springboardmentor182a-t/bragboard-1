import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../Common/Input";
import "../../styles/auth.css";
import { postJson } from "../../lib/api";  
function extractMessage(data, fallback) {
  // FastAPI 422-style errors: { detail: [ { msg, ... }, ... ] }
  if (Array.isArray(data?.detail) && data.detail.length > 0) {
    return data.detail.map((item) => item.msg).join(", ");
  }
  if (typeof data?.detail === "string") {
    return data.detail;
  }
  if (typeof data?.message === "string") {
    return data.message;
  }
  return fallback;
}


export default function OTPVerify() {
  const loc = useLocation();
  const navigate = useNavigate();
  // if we navigated from register, the email may be in location.state
  const preEmail = (loc.state && loc.state.email) || "";

  const [email, setEmail] = useState(preEmail);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (preEmail) setEmail(preEmail);
  }, [preEmail]);

  async function handleVerify(e) {
  e.preventDefault();
  setError("");
  setMsg("");

  if (!email || !otp) {
    setError("Email and OTP are required.");
    return;
  }

  setLoading(true);
  try {
    const qs = new URLSearchParams({
  email,
  otp,   // or 'code': otp if backend expects "code"
}).toString();

const { status, data } = await postJson(`/auth/verify-otp/?${qs}`, {});


    if (status === 200) {
      setMsg("Email verified — redirecting to login...");
      setTimeout(() => navigate("/login", { replace: true }), 900);
    } else {
      // turn FastAPI’s detail array into a readable string
      let message = "Invalid or expired code.";
      if (Array.isArray(data?.detail) && data.detail.length > 0) {
        message = data.detail.map((d) => d.msg).join(", ");
      } else if (typeof data?.detail === "string") {
        message = data.detail;
      } else if (data?.message) {
        message = data.message;
      }
      setError(message);
    }
  } catch (err) {
    console.error(err);
    setError("Network error — please try again.");
  } finally {
    setLoading(false);
  }
}



  async function handleResend(e) {
  e && e.preventDefault();
  setError("");
  setMsg("");

  if (!email) {
    setError("Please enter your email before resending.");
    return;
  }

  setLoading(true);
  try {
    const { status, data } = await postJson("/auth/verify-otp/", { email }); 
    // 👆 adjust path to match Swagger if it's different

    if (status === 200) {
      const message = extractMessage(
        data,
        "A new OTP was sent to your email (check backend log in dev)."
      );
      setMsg(message);
    } else {
      const message = extractMessage(
        data,
        "Failed to resend OTP. Try again later."
      );
      setError(message);
    }
  } catch (err) {
    console.error(err);
    setError("Failed to resend OTP. Try again later.");
  } finally {
    setLoading(false);
  }
}


  return (
    <div className="auth-page">
      <div className="auth-hero">
        <h1 className="big-title">Verify your email</h1>
        <div className="hero-cta">Almost there — enter the code</div>
      </div>

      <div className="auth-card" style={{ minHeight: 540 }}>
        <h2 className="auth-title">Verify your email</h2>
        <p className="auth-sub">Enter the verification code sent to your email</p>

        <form className="auth-form" onSubmit={handleVerify} style={{ alignItems: "stretch" }}>
          <Input
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            name="otp"
            type="text"
            placeholder="Enter OTP (e.g. 123456)"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          {error && <div className="error" role="alert">{String(error)}</div>}
{msg && (
  <div className="success" role="status" style={{ color: "#d1ffd6" }}>
    {String(msg)}
  </div>
)}


          {msg && (
            <div className="success" role="status" style={{ color: "#d1ffd6" }}>
              {msg}
            </div>
          )}

          <button
            className="btn primary"
            type="submit"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? "Verifying…" : "Verify"}
          </button>

          <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              className="btn"
              type="button"
              onClick={handleResend}
              disabled={loading}
              style={{
                background: "transparent",
                color: "var(--muted)",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Resend code
            </button>

            <a href="/login" style={{ color: "var(--muted)" }}>
              Back to login
            </a>
          </div>

          <div style={{ flex: 1 }}></div>

          <div className="auth-footer" style={{ marginTop: 28 }}>
            <div>
              Don't have an account ? <a href="/register">Signup</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
