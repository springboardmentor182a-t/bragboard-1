function ReportsPanel({ loading }) {
    if (loading) {
      return (
        <div className="animate-pulse bg-white p-4 rounded shadow h-24 w-full"></div>
      );
    }
    return (
      <div className="bg-white p-4 rounded shadow">
        <div className="font-bold mb-2">Download Reports</div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded mr-2">Export PDF</button>
        <button className="bg-green-600 text-white px-4 py-2 rounded">Export CSV</button>
      </div>
    );
  }
  export default ReportsPanel;
  