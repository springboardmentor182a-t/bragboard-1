import React from "react";

const DashboardTable = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">Name</th>
            <th className="py-2">Status</th>
            <th className="py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-2">User A</td>
            <td className="py-2 text-green-600">Completed</td>
            <td className="py-2">22 Dec</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DashboardTable;
