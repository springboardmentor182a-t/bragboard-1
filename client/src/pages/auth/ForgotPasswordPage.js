import React from "react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Forgot Password</h2>
      <input style={styles.input} type="email" placeholder="Enter your email" />
      <button style={styles.button}>Send OTP</button>
      <div style={styles.links}>
        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "80px auto",
    padding: "20px",
    borderRadius: "10px",
    background: "#fff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: { marginBottom: "20px" },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#FF9800",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
  links: { marginTop: "15px", fontSize: "14px" },
};

export default ForgotPasswordPage;
