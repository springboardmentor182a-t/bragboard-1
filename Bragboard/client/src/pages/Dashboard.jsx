import "./Dashboard.css";
import { useState, useEffect } from "react";
import { useMemo } from "react";
import Alert from "../components/Alert";
import { exportElementAsPDF } from "../utils/exportPdf";
import KPIcard from "../components/KPIcard";
import TimeFilter from "../components/TimeFilter";
import ContributorsTable from "../components/ContributorsTable";
import AnalyticsChart from "../components/AnalyticsChart";
import DepartmentAnalytics from "../components/DepartmentAnalytics";
function Dashboard() {
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");

    const [filter, setFilter] = useState("weekly");

    const [showDept, setShowDept] = useState(true);
    const [showContributors, setShowContributors] = useState(true);

  const contributors = useMemo(() => [
    { name: "Divya", dept: "IT", tags: 40 },
    { name: "Indhu", dept: "Admin", tags: 32 },
    { name: "Gayathri", dept: "HR", tags: 28 }
], []);

    useEffect(() => {
        if (contributors[0].tags < 10) {
            setAlertType("warn");
            setAlertMessage("Contributor activity is low this week.");
            setShowAlert(true);
        }
    }, [contributors]);

    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => setShowAlert(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    const handleFilterChange = (value) => {
        setFilter(value);

        setAlertType("info");
        setAlertMessage(`Showing ${value} analytics`);
        setShowAlert(true);
    };

    const exportDashboardAsPDF = () => {
        exportElementAsPDF("dashboard-root", "admin-dashboard-report.pdf");
        setAlertType("success");
        setAlertMessage("Report exported successfully!");
        setShowAlert(true);
    };

    return (
        <div id="dashboard-root">

            {/* Header */}
            <div className="header">Admin Dashboard Analytics</div>

            {/* Sidebar */}
            <div className="sidebar">
                <h3>Menu</h3>
                <p>Dashboard</p>
                <p>Analytics</p>
                <p>Users</p>
                <p>Reports</p>
                <p>Settings</p>
            </div>

            {/* Main Content */}
            <div className="content">

                {/* Alerts */}
                {showAlert && (
                    <Alert type={alertType} text={alertMessage} />
                )}

                {/* KPI Cards */}
                <div className="row">
                    <KPIcard title="Total Users" value="150" />
                    <KPIcard title="Revenue" value="₹75,000" />
                    <KPIcard title="Retention" value="72%" />
                    <KPIcard title="Orders" value="320 Orders" />
                    <KPIcard title="Engagement" value="68%" />
                </div>


                {/* Time Filter */}
                <TimeFilter onChange={handleFilterChange} />

                {/* Widget Control Buttons */}
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    <button onClick={() => setShowDept((s) => !s)}>
                        {showDept ? "Hide" : "Show"} Department Analytics
                    </button>

                    <button onClick={() => setShowContributors((s) => !s)}>
                        {showContributors ? "Hide" : "Show"} Contributors Table
                    </button>

                    <button onClick={exportDashboardAsPDF}>
                        Export PDF
                    </button>
                </div>

                {/* Analytics Chart */}
                <AnalyticsChart filter={filter} />

                {/* Department Analytics Chart */}
                {showDept && <DepartmentAnalytics filter={filter} />}

                {/* Contributors Table */}
                <h3>Top Contributors</h3>
                {showContributors && <ContributorsTable contributors={contributors} />}
                <KPIcard title="Total Items" value="100" />
            </div>

        </div>
    );
}

export default Dashboard;
