import ChartCard from "../components/ChartCard";

const AdminDashboard = () => {
  return (
    <>
      <h2>Admin Dashboard</h2>
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <ChartCard title="Total Employees" value="120" />
        <ChartCard title="Departments" value="8" />
        <ChartCard title="Monthly Revenue" value="₹5.2L" />
      </div>
    </>
  );
};

export default AdminDashboard;
