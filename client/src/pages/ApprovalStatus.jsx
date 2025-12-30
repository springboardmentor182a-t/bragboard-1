function ApprovalStatus() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#a412a2ff",
      }}
    >
      <div
        style={{
          background: "purple",
          padding: "32px",
          borderRadius: "8px",
          maxWidth: "420px",
          textAlign: "center",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ marginBottom: "12px" }}>
          Account Pending Approval
        </h2>

        <p style={{ color: "#eed8d8ff", marginBottom: "20px" }}>
          Your account has been successfully registered and verified,
          but it has <strong>not yet been approved by an administrator</strong>.
        </p>

        <p style={{ color: "#ecdcdcff", fontSize: "14px" }}>
          Once approved, you will be able to log in and access your dashboard.
        </p>

        <p style={{ marginTop: "16px", fontSize: "13px", color: "#f0e6e6ff" }}>
          If this takes too long, please contact your administrator.
        </p>
      </div>
    </div>
  );
}

export default ApprovalStatus;
