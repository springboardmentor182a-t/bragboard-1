import React, { useState } from "react";

function Attendance() {
  // State for clock-in simulation
  const [clockedIn, setClockedIn] = useState(false);
  const [attendanceLog, setAttendanceLog] = useState([
    { date: "2025-11-22", status: "Present", time: "09:01" },
    { date: "2025-11-21", status: "Leave", time: "--" },
    { date: "2025-11-20", status: "Present", time: "09:08" },
    { date: "2025-11-19", status: "Absent", time: "--" },
  ]);

  // State for leave request form
  const [leaveType, setLeaveType] = useState("Annual");
  const [leaveDays, setLeaveDays] = useState(1);
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveRequests, setLeaveRequests] = useState([
    { date: "2025-11-21", type: "Annual", days: 1, status: "Approved" },
  ]);

  function handleClockIn() {
    setClockedIn(true);
    setAttendanceLog([
      { date: new Date().toISOString().slice(0, 10), status: "Present", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ...attendanceLog,
    ]);
  }

  function handleClockOut() {
    setClockedIn(false);
  }

  function handleSubmitLeave(e) {
    e.preventDefault();
    setLeaveRequests([
      { date: new Date().toISOString().slice(0, 10), type: leaveType, days: leaveDays, status: "Pending", reason: leaveReason },
      ...leaveRequests
    ]);
    setLeaveType("Annual"); setLeaveDays(1); setLeaveReason("");
  }

  return (
    <div>
      <h3>Attendance & Leave Management</h3>
      <button
        style={clockInBtn}
        disabled={clockedIn}
        onClick={handleClockIn}
      >Clock-In</button>
      <button
        style={clockOutBtn}
        disabled={!clockedIn}
        onClick={handleClockOut}
      >Clock-Out</button>

      <div style={{ marginTop: "25px", marginBottom: "22px", display: "flex", gap: "36px" }}>
        <div style={{ background: "#f3f3fa", padding: "18px 22px", borderRadius: "10px", minWidth: 180 }}>
          <strong>Leave Balance:</strong>
          <div>Annual: 8 days</div>
          <div>Sick: 3 days</div>
          <div>Casual: 2 days</div>
        </div>
        <div style={{ background: "#f3f6f9", padding: "18px 22px", borderRadius: "10px", minWidth: 180 }}>
          <strong>Recent Attendance:</strong>
          <ul style={{ paddingLeft: 18 }}>
            {attendanceLog.slice(0, 4).map((log, i) =>
              <li key={i} style={{ marginBottom: 4 }}>
                <span style={{ color: log.status === "Absent" ? "#c00" : "#397" }}>{log.status}</span> - {log.date} {log.time !== "--" && <span>({log.time})</span>}
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Leave request section */}
      <div style={{ marginTop: "30px", maxWidth: 430, background: "#f8f3fa", borderRadius: 12, padding: "18px 18px 22px" }}>
        <strong>Request Leave:</strong>
        <form onSubmit={handleSubmitLeave} style={{ marginTop: 10 }}>
          <label>
            Type:
            <select value={leaveType} onChange={e => setLeaveType(e.target.value)} style={{ marginLeft: "10px", marginBottom: "10px" }}>
              <option value="Annual">Annual</option>
              <option value="Sick">Sick</option>
              <option value="Casual">Casual</option>
            </select>
          </label>
          <br />
          <label>
            Days:
            <input type="number" value={leaveDays} min={1} max={8} onChange={e => setLeaveDays(+e.target.value)} style={{ width: "50px", marginLeft: "10px", marginBottom: "10px" }} />
          </label>
          <br />
          <label>
            Reason:
            <input type="text" value={leaveReason} onChange={e => setLeaveReason(e.target.value)} style={{ marginLeft: "10px", width: "70%" }} placeholder="Optional" />
          </label>
          <br />
          <button type="submit" style={{ marginTop: "10px", background: "#800080", color: "#fff", border: "none", padding: "7px 18px", borderRadius: "6px", cursor: "pointer" }}>
            Submit Leave Request
          </button>
        </form>
      </div>

      {/* Display leave requests */}
      <div style={{ marginTop: "36px", maxWidth: 480, background: "#f3f3fa", borderRadius: 10, padding: "18px" }}>
        <strong>Recent Leave Requests:</strong>
        <table style={{ width: "100%", marginTop: "10px", background: "#f8f8fe", borderRadius: "8px" }}>
          <thead>
            <tr style={{ color: "#800080" }}>
              <th>Date</th>
              <th>Type</th>
              <th>Days</th>
              <th>Status</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.slice(0, 5).map((req, idx) => (
              <tr key={idx}>
                <td>{req.date}</td>
                <td>{req.type}</td>
                <td>{req.days}</td>
                <td style={{ color: req.status === "Approved" ? "#0e9b44" : "#efb300" }}>{req.status}</td>
                <td>{req.reason || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: "25px" }}>
        More attendance visualization (calendar, charts) and admin features coming soon.
      </p>
    </div>
  );
}

const clockInBtn = {
  margin: "10px",
  background: "#800080",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer"
};
const clockOutBtn = {
  margin: "10px",
  background: "#222",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer"
};

export default Attendance;
