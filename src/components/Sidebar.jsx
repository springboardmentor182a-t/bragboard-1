import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <div style={styles.sidebar}>
      <h3>Dashboard</h3>
      {user?.role === "employee" && (
        <Link to="/employee">Employee Home</Link>
      )}
      {user?.role === "admin" && <Link to="/admin">Admin Home</Link>}
    </div>
  );
};

const styles = {
  sidebar: {
    width: "220px",
    background: "#1f2933",
    color: "#fff",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
};

export default Sidebar;
