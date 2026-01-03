const Placeholder = ({ title }) => {
  return (
    <div style={styles.box}>
      <h3>{title}</h3>
      <p>Content coming soon...</p>
    </div>
  );
};

const styles = {
  box: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
};

export default Placeholder;
