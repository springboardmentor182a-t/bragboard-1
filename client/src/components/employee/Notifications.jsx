import React, { useState } from "react";

const INIT_NOTIFS = [
  { id: 1, text: "Company meeting scheduled for Monday 10 AM", type: "Announcement", read: false },
  { id: 2, text: "Performance review period starts next week", type: "HR", read: false },
  { id: 3, text: "HR policy updated: work-from-home guidelines", type: "Policy", read: true },
  { id: 4, text: "Security update: change your passwords this month", type: "Security", read: false }
];

// Unique notification types for filtering
const TYPES = ["All", "Announcement", "HR", "Policy", "Security"];

function Notifications() {
  const [selectedType, setSelectedType] = useState("All");
  const [notifications, setNotifications] = useState(INIT_NOTIFS);

  // Filtering by type
  const filteredNotifications =
    selectedType === "All"
      ? notifications
      : notifications.filter(n => n.type === selectedType);

  // Mark as read toggle
  function toggleRead(id) {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: !n.read } : n
    ));
  }

  // Dismiss notification
  function dismiss(id) {
    setNotifications(notifications.filter(n => n.id !== id));
  }

  return (
    <div>
      <h3>Notifications & Alerts</h3>
      <div style={{ marginBottom: "20px" }}>
        {/* Filter controls */}
        <strong>Filter: </strong>
        {TYPES.map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            style={{
              margin: "0 7px",
              padding: "5px 14px",
              background: selectedType === type ? "#800080" : "#eee",
              color: selectedType === type ? "#fff" : "#800080",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 500
            }}
          >{type}</button>
        ))}
      </div>
      {/* List notifications */}
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {filteredNotifications.map(n => (
          <li
            key={n.id}
            style={{
              marginBottom: "16px",
              background: n.read ? "#f5f1fa" : "#80008010",
              borderRadius: "7px",
              padding: "12px 16px",
              color: "#800080",
              boxShadow: "0 2px 6px #0001",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <span>
              <strong style={{ marginRight: "9px" }}>
                [{n.type}]
              </strong>
              {n.text}
            </span>
            <span>
              <button
                onClick={() => toggleRead(n.id)}
                style={{
                  background: n.read ? "#dfb" : "#fff",
                  color: n.read ? "#222" : "#800080",
                  padding: "6px 10px",
                  border: "1px solid #80008060",
                  borderRadius: "4px",
                  marginRight: "8px",
                  cursor: "pointer"
                }}
              >
                {n.read ? "Mark Unread" : "Mark Read"}
              </button>
              <button
                onClick={() => dismiss(n.id)}
                style={{
                  background: "#fdeded",
                  color: "#900",
                  padding: "6px 10px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >Dismiss</button>
            </span>
          </li>
        ))}
        {filteredNotifications.length === 0 && (
          <li style={{ color: "#999", marginTop: "32px" }}>
            No notifications in this category.
          </li>
        )}
      </ul>
      <p style={{ marginTop: "24px" }}>Announcements, HR updates, policies, and security notifications managed here.</p>
    </div>
  );
}

export default Notifications;
