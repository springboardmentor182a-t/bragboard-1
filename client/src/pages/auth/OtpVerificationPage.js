import React from "react";
import { Link } from "react-router-dom";

const OtpVerificationPage = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>OTP Verification</h2>
      <input style={styles.input} type="text" placeholder="Enter OTP" />
      <button style={styles.button}>Verify OTP</button>
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
    backgroundColor: "#9C27B0",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
  links: { marginTop: "15px", fontSize: "14px" },
};

export default OtpVerificationPage;
