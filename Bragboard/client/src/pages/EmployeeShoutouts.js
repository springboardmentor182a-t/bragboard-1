import React from "react";
import DashboardLayout from "../components/Layout/DashboardLayout.jsx";
import ReportShoutoutForm from "../components/Shoutouts/ReportShoutoutForm";
import MyShoutoutsList from "../components/Shoutouts/MyShoutoutsList";

const EmployeeShoutouts = () => {
  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Reporting Shoutouts</h2>

      <div className="space-y-8">
        <ReportShoutoutForm />
        <MyShoutoutsList />
      </div>
    </DashboardLayout>
  );
};

export default EmployeeShoutouts;
