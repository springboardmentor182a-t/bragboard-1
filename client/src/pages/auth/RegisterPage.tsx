import React, { useState, ChangeEvent, FormEvent } from "react";
import { api } from "../../api"; // Correct path for your project
import { useNavigate } from "react-router-dom";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  department: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    department: "",
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Correctly type the event
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", form);
      setSuccess("Registration successful! Please login.");
      setError("");
      setTimeout(() => navigate("/auth/login"), 1500);
    } catch (err: any) {
      // Type-safe access to error response
      setError(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>
      </form>

      <p
        onClick={() => navigate("/auth/login")}
        className="cursor-pointer text-blue-500 mt-4"
      >
        Already have an account? Login
      </p>
    </div>
  );
}
