import React from "react";

export default function ShoutoutCard({ data, onEdit, onDelete }) {
  return (
    <div className="card shoutout-card mb-3 shadow-sm" style={{ borderRadius: "12px" }}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="card-title shoutout-title">{data.title}</h5>
            <p className="card-text shoutout-message">{data.message}</p>
            <p className="text-muted small">
              From <strong>{data.sender_id}</strong> → <strong>{data.receiver_id}</strong>
            </p>
          </div>

          <div className="d-flex flex-column gap-2">
            {/* EDIT BUTTON */}
            <button
              className="btn btn-warning btn-sm"
              onClick={() => onEdit(data)}
            >
              Edit
            </button>

            {/* DELETE BUTTON */}
            <button
              className="btn btn-danger btn-sm"
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this shoutout?")) {
                  onDelete(data.id);
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>

        <div className="mt-2 text-end small text-muted">
          {data.created_at ? new Date(data.created_at).toLocaleString() : ""}
        </div>
      </div>
    </div>
  );
}
