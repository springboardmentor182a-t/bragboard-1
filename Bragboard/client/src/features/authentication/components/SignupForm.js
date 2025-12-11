import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../../services/authService";

export default function SignupForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signup(form);
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth:420, margin:"40px auto", padding:20, border:"1px solid #eee", borderRadius:8}}>
      <h2>Create account</h2>
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom:10}}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" required style={{width:"100%", padding:8}} />
        </div>
        <div style={{marginBottom:10}}>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required style={{width:"100%", padding:8}} />
        </div>
        <div style={{marginBottom:10}}>
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required style={{width:"100%", padding:8}} />
        </div>
        {error && <div style={{color:"red", marginBottom:10}}>{error}</div>}
        <button type="submit" disabled={loading} style={{width:"100%", padding:10}}>
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
    </div>
  );
}
