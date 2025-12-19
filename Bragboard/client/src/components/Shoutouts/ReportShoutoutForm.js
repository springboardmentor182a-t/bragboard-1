import React from "react";

const ReportShoutoutForm = ({ newShoutout, setNewShoutout, onSubmit }) => {
  return (
    <div className="bg-white p-6 rounded shadow mb-6">
      <h2 className="font-semibold mb-4">Report a Shoutout</h2>

      <input
        type="text"
        placeholder="Recipient name or team"
        value={newShoutout.recipient}
        onChange={(e) =>
          setNewShoutout({ ...newShoutout, recipient: e.target.value })
        }
        className="border p-2 w-full mb-3 rounded"
      />

      <textarea
        placeholder="Your message"
        value={newShoutout.message}
        onChange={(e) =>
          setNewShoutout({ ...newShoutout, message: e.target.value })
        }
        className="border p-2 w-full mb-3 rounded"
      />

      <button
        onClick={onSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </div>
  );
};

export default ReportShoutoutForm;
