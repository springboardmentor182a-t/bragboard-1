import React, { useState } from "react";

function Attendance() {
  const [clockedIn, setClockedIn] = useState(false);
  const [attendanceLog, setAttendanceLog] = useState([
    { date: "2025-11-22", status: "Present", time: "09:01" },
    { date: "2025-11-21", status: "Leave", time: "--" },
    { date: "2025-11-20", status: "Present", time: "09:08" },
    { date: "2025-11-19", status: "Absent", time: "--" },
  ]);

  const [leaveType, setLeaveType] = useState("Annual");
  const [leaveDays, setLeaveDays] = useState(1);
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveRequests, setLeaveRequests] = useState([
    { date: "2025-11-21", type: "Annual", days: 1, status: "Approved" },
  ]);

  function handleClockIn() {
    setClockedIn(true);
    setAttendanceLog([
      {
        date: new Date().toISOString().slice(0, 10),
        status: "Present",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      ...attendanceLog,
    ]);
  }

  function handleClockOut() {
    setClockedIn(false);
  }

  function handleSubmitLeave(e) {
    e.preventDefault();
    setLeaveRequests([
      {
        date: new Date().toISOString().slice(0, 10),
        type: leaveType,
        days: leaveDays,
        status: "Pending",
        reason: leaveReason,
      },
      ...leaveRequests,
    ]);
    setLeaveType("Annual");
    setLeaveDays(1);
    setLeaveReason("");
  }

  return (
    <div className="attendance-container">
      <h2 className="page-title">Attendance & Leave Management</h2>

      <div className="btn-row">
        <button className="btn purple" disabled={clockedIn} onClick={handleClockIn}>
          Clock In
        </button>
        <button className="btn dark" disabled={!clockedIn} onClick={handleClockOut}>
          Clock Out
        </button>
      </div>

      <div className="card-row">
        <div className="card">
          <h4>Leave Balance</h4>
          <p>Annual: 8 days</p>
          <p>Sick: 3 days</p>
          <p>Casual: 2 days</p>
        </div>

        <div className="card">
          <h4>Recent Attendance</h4>
          <ul>
            {attendanceLog.slice(0, 4).map((log, i) => (
              <li key={i}>
                <span
                  className={
                    log.status === "Absent"
                      ? "red"
                      : log.status === "Leave"
                      ? "orange"
                      : "green"
                  }
                >
                  {log.status}
                </span>{" "}
                - {log.date} {log.time !== "--" && `(${log.time})`}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="form-card">
        <h4>Request Leave</h4>
        <form onSubmit={handleSubmitLeave}>
          <label>Type:</label>
          <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
            <option value="Annual">Annual</option>
            <option value="Sick">Sick</option>
            <option value="Casual">Casual</option>
          </select>

          <label>Days:</label>
          <input
            type="number"
            value={leaveDays}
            min={1}
            max={8}
            onChange={(e) => setLeaveDays(+e.target.value)}
          />

          <label>Reason:</label>
          <input
            type="text"
            value={leaveReason}
            placeholder="Optional"
            onChange={(e) => setLeaveReason(e.target.value)}
          />

          <button type="submit" className="btn purple full">
            Submit Request
          </button>
        </form>
      </div>

      <div className="table-card">
        <h4>Recent Leave Requests</h4>
        <table>
          <thead>
            <tr>
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
                <td
                  className={
                    req.status === "Approved" ? "green" : req.status === "Rejected" ? "red" : "orange"
                  }
                >
                  {req.status}
                </td>
                <td>{req.reason || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="note">More features coming soon…</p>

      {/* ---------- STYLES BELOW ---------- */}
      <style>{`
        .attendance-container {
          padding: 20px 30px;
          color: #333; 
        }

        .page-title {
          font-size: 26px;
          color: #4a0060;
          margin-bottom: 18px;
          font-weight: 700;
        }

        .btn-row {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .btn {
          padding: 10px 22px;
          border-radius: 6px;
          font-size: 15px;
          border: none;
          cursor: pointer;
          transition: 0.2s;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .purple {
          background: #800080;
          color: #fff;
        }

        .dark {
          background: #222;
          color: #fff;
        }

        .full {
          width: 100%;
        }

        .card-row {
          display: flex;
          gap: 25px;
          margin-bottom: 28px;
        }

        .card {
          background: #faf6ff;
          padding: 18px;
          width: 230px;
          border-radius: 10px;
          box-shadow: 0 3px 8px #00000010;
        }

        .card h4 {
          margin-bottom: 8px;
          color: #5c0075;
        }

        .form-card {
          max-width: 400px;
          background: #fff1ff;
          padding: 18px;
          border-radius: 12px;
          margin-bottom: 28px;
        }

        .form-card form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .form-card input,
        .form-card select {
          padding: 7px;
          border-radius: 6px;
          border: 1px solid #ccc;
        }

        .table-card {
          background: #f3f3fa;
          padding: 18px;
          border-radius: 12px;
          max-width: 600px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          text-align: left;
          padding: 10px;
          color: #800080;
        }

        td {
          padding: 10px;
          border-top: 1px solid #ddd;
        }

        .green {
          color: #0e9b44;
        }
        .red {
          color: #d40000;
        }
        .orange {
          color: #ff8c00;
        }

        .note {
          margin-top: 25px;
          font-style: italic;
          color: #444;
        }
      `}</style>
    </div>
  );
}

export default Attendance;
