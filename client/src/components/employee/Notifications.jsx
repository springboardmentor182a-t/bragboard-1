import React, { useState } from "react";

/* Dummy shoutout-related notifications */
const INIT_NOTIFS = [
  {
    id: 1,
    text: "🎉 You received a shoutout from Sarah Johnson!",
    type: "Shoutout",
    read: false
  },
  {
    id: 2,
    text: "🏆 You entered the Top 3 on the weekly leaderboard!",
    type: "Leaderboard",
    read: true
  },
  {
    id: 3,
    text: "👏 Engineering department received 50 shoutouts this week!",
    type: "Department",
    read: false
  }
];

/* Notification categories */
const TYPES = ["All", "Shoutout", "Leaderboard", "Department"];

function Notifications() {
  const [notifications, setNotifications] = useState(INIT_NOTIFS);
  const [selectedType, setSelectedType] = useState("All");

  /* Filter notifications */
  const filteredNotifications =
    selectedType === "All"
      ? notifications
      : notifications.filter(n => n.type === selectedType);

  /* Toggle read/unread */
  const toggleRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: !n.read } : n
    ));
  };

  /* Remove notification */
  const dismiss = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div>
      <h3 style={{ color: "#7c3aed", fontSize: "24px", fontWeight: 700 }}>
        🔔 Notifications
      </h3>

      {/* Filter buttons */}
      <div style={{ margin: "16px 0" }}>
        <strong>Filter:</strong>
        {TYPES.map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            style={{
              marginLeft: "8px",
              padding: "6px 14px",
              background: selectedType === type ? "#7c3aed" : "#f3f4f6",
              color: selectedType === type ? "#fff" : "#7c3aed",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredNotifications.map(n => (
          <li
            key={n.id}
            style={{
              marginBottom: "14px",
              padding: "14px",
              background: n.read ? "#faf5ff" : "#ede9fe",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <span>
              <strong style={{ color: "#7c3aed", marginRight: "6px" }}>
                [{n.type}]
              </strong>
              {n.text}
            </span>

            <span>
              <button
                onClick={() => toggleRead(n.id)}
                style={{
                  marginRight: "6px",
                  padding: "5px 10px",
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                {n.read ? "Unread" : "Read"}
              </button>

              <button
                onClick={() => dismiss(n.id)}
                style={{
                  padding: "5px 10px",
                  background: "#fee2e2",
                  color: "#991b1b",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Dismiss
              </button>
            </span>
          </li>
        ))}

        {filteredNotifications.length === 0 && (
          <li style={{ color: "#9ca3af", marginTop: "20px" }}>
            No notifications available.
          </li>
        )}
      </ul>

      <p style={{ marginTop: "20px", color: "#6b7280" }}>
        Shoutout and leaderboard alerts appear here.
      </p>
    </div>
  );
}

export default Notifications;
