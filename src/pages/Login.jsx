import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role) => {
    login(role);
    navigate(role === "admin" ? "/admin" : "/employee");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Login</h2>
        <button onClick={() => handleLogin("employee")}>
          Login as Employee
        </button>
        <button onClick={() => handleLogin("admin")}>Login as Admin</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    minWidth: "300px",
  },
};

export default Login;
