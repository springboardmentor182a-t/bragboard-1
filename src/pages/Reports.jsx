export default function Reports() {
  const API = "http://localhost:5000/api/shoutouts";

  const downloadCSV = () => {
    window.open(`${API}/export/csv`, "_blank");
  };

  const downloadPDF = () => {
    window.open(`${API}/export/pdf`, "_blank");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">
        Shoutouts Reporting
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md border w-full max-w-lg">
        <p className="text-gray-600 mb-4">
          Admin can export shoutouts into CSV or PDF reports.
        </p>

        <div className="flex gap-4">
          <button
            onClick={downloadCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Export CSV
          </button>

          <button
            onClick={downloadPDF}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}
