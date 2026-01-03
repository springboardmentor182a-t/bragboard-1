const ChartCard = ({ title, value }) => {
  return (
    <div style={styles.card}>
      <h4>{title}</h4>
      <h1>{value}</h1>
    </div>
  );
};

const styles = {
  card: {
    background: "linear-gradient(135deg,#667eea,#764ba2)",
    color: "#fff",
    padding: "25px",
    borderRadius: "16px",
    minWidth: "200px",
    boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
  },
};

export default ChartCard;
