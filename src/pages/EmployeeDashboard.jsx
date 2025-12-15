import ChartCard from "../components/ChartCard";

const EmployeeDashboard = () => {
  return (
    <>
      <h2>Employee Dashboard</h2>
      <div style={styles.grid}>
        <ChartCard title="Tasks Completed" value="24" />
        <ChartCard title="Pending Tasks" value="6" />
        <ChartCard title="Attendance %" value="92%" />
      </div>
    </>
  );
};

const styles = {
  grid: {
    marginTop: "20px",
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },
};

export default EmployeeDashboard;
