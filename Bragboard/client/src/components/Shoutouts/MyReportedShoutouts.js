import React from "react";

const MyReportedShoutouts = ({ shoutouts }) => {
  if (shoutouts.length === 0) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <p>No shoutouts found.</p>
      </div>
    );
  }

  return (
    <>
      {shoutouts.map((s) => (
        <div key={s.id} className="bg-white p-4 rounded shadow mb-4">
          <p className="font-semibold">
            To: {s.recipient}
            <span className="ml-3 text-sm text-gray-500">({s.status})</span>
          </p>
          <p className="italic text-gray-700 mt-2">"{s.message}"</p>
          <p className="text-sm text-gray-500 mt-1">{s.timestamp}</p>
        </div>
      ))}
    </>
  );
};

export default MyReportedShoutouts;
