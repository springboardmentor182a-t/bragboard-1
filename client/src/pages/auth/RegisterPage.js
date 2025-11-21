import React from "react";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Register</h2>
      <input style={styles.input} type="text" placeholder="Name" />
      <input style={styles.input} type="email" placeholder="Email" />
      <input style={styles.input} type="password" placeholder="Password" />
      <button style={styles.button}>Register</button>
      <div style={styles.links}>
        <Link to="/login">Already have an account? Login</Link>
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
    backgroundColor: "#4CAF50",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
  links: { marginTop: "15px", fontSize: "14px" },
};

export default RegisterPage;
