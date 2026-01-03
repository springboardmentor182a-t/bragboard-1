import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div style={styles.nav}>
      <h2>🏢 Employee Portal</h2>
      {user && (
        <div style={styles.user}>
          <span>{user.role.toUpperCase()}</span>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
};

const styles = {
  nav: {
    height: "60px",
    background: "#111827",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
  },
  user: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
};

export default Navbar;
