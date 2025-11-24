export default function Alert({ type = "info", text }) {
  const colors = {
    info: "#2b6cb0",     // blue
    warn: "#d69e2e",     // yellow
    error: "#e53e3e",    // red
    success: "#2f855a",  // green
  };

  return (
    <div style={{
      background: colors[type],
      color: "white",
      padding: 10,
      borderRadius: 6,
      marginBottom: 10,
      fontWeight: "bold"
    }}>
      {text}
    </div>
  );
}
