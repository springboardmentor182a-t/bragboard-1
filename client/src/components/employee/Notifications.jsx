<<<<<<< HEAD
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
      <h3 style={{ color: "#7c3aed", fontWeight: 700, fontSize: "24px", marginBottom: "20px" }}>Notifications & Alerts</h3>
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
              background: selectedType === type ? "#7c3aed" : "#f3f4f6",
              color: selectedType === type ? "#fff" : "#7c3aed",
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
              background: n.read ? "#faf5ff" : "#ede9fe",
              borderRadius: "7px",
              padding: "12px 16px",
              color: "#374151",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <span>
              <strong style={{ marginRight: "9px", color: "#7c3aed" }}>
                [{n.type}]
              </strong>
              {n.text}
            </span>
            <span>
              <button
                onClick={() => toggleRead(n.id)}
                style={{
                  background: n.read ? "#d1fae5" : "#fff",
                  color: n.read ? "#065f46" : "#7c3aed",
                  padding: "6px 10px",
                  border: "1px solid #e5e7eb",
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
                  background: "#fee2e2",
                  color: "#991b1b",
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
          <li style={{ color: "#9ca3af", marginTop: "32px" }}>
            No notifications in this category.
          </li>
        )}
      </ul>
      <p style={{ marginTop: "24px", color: "#6b7280" }}>Announcements, HR updates, policies, and security notifications managed here.</p>
    </div>
  );
}

export default Notifications;
=======
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
      <h3 style={{ color: "#7c3aed", fontWeight: 700, fontSize: "24px", marginBottom: "20px" }}>Notifications & Alerts</h3>
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
              background: selectedType === type ? "#7c3aed" : "#f3f4f6",
              color: selectedType === type ? "#fff" : "#7c3aed",
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
              background: n.read ? "#faf5ff" : "#ede9fe",
              borderRadius: "7px",
              padding: "12px 16px",
              color: "#374151",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <span>
              <strong style={{ marginRight: "9px", color: "#7c3aed" }}>
                [{n.type}]
              </strong>
              {n.text}
            </span>
            <span>
              <button
                onClick={() => toggleRead(n.id)}
                style={{
                  background: n.read ? "#d1fae5" : "#fff",
                  color: n.read ? "#065f46" : "#7c3aed",
                  padding: "6px 10px",
                  border: "1px solid #e5e7eb",
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
                  background: "#fee2e2",
                  color: "#991b1b",
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
          <li style={{ color: "#9ca3af", marginTop: "32px" }}>
            No notifications in this category.
          </li>
        )}
      </ul>
      <p style={{ marginTop: "24px", color: "#6b7280" }}>Announcements, HR updates, policies, and security notifications managed here.</p>
    </div>
  );
}

export default Notifications;
>>>>>>> 3e2424c214281832d92a15cbeb86496329d2c772
