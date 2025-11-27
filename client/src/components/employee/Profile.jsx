import React, { useState } from "react";

function Profile() {
  // Editable fields (demo only)
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: "User Name",
    email: "user@company.com",
    position: "Software Engineer",
    department: "IT",
    phone: "+91-9876543210",
    address: "Bangalore, India",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSave() {
    setEditMode(false); // Logic for actual save goes here!
  }

  return (
    <div>
      <h3>Personal Profile & Documents</h3>
      <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
        <img
          src="https://i.pravatar.cc/80?img=14"
          alt="Profile"
          style={{ borderRadius: "50%", width: "80px", height: "80px", border: "2px solid #800080" }}
        />
        <div>
          {editMode ? (
            <>
              <div><strong>Name:</strong> <input name="name" value={form.name} onChange={handleChange} /></div>
              <div><strong>Email:</strong> <input name="email" value={form.email} onChange={handleChange} /></div>
              <div><strong>Position:</strong> <input name="position" value={form.position} onChange={handleChange} /></div>
              <div><strong>Department:</strong> <input name="department" value={form.department} onChange={handleChange} /></div>
              <div><strong>Phone:</strong> <input name="phone" value={form.phone} onChange={handleChange} /></div>
              <div><strong>Address:</strong> <input name="address" value={form.address} onChange={handleChange} /></div>
            </>
          ) : (
            <>
              <div><strong>Name:</strong> {form.name}</div>
              <div><strong>Email:</strong> {form.email}</div>
              <div><strong>Position:</strong> {form.position}</div>
              <div><strong>Department:</strong> {form.department}</div>
              <div><strong>Phone:</strong> {form.phone}</div>
              <div><strong>Address:</strong> {form.address}</div>
            </>
          )}
          <div style={{ marginTop: "12px" }}>
            {editMode ? (
              <button style={editBtn} onClick={handleSave}>Save</button>
            ) : (
              <button style={editBtn} onClick={() => setEditMode(true)}>Edit Profile</button>
            )}
          </div>
        </div>
      </div>
      {/* Document download section */}
      <div style={{ marginTop: "28px" }}>
        <button style={docBtn}>Download Payslip</button>
        <button style={docBtn}>Download ID Card</button>
        <button style={docBtn}>Download Offer Letter</button>
      </div>
      {/* Document upload (simulated) */}
      <div style={{ marginTop: "18px", maxWidth: "380px", background: "#f5f2fa", padding: "12px", borderRadius: "7px" }}>
        <strong>Upload New Document:</strong>
        <input type="file" style={{ margin: "12px 0" }} />
        <button style={docBtn}>Upload</button>
      </div>
      <p style={{ marginTop: "20px" }}>Update personal info, download/upload HR documents, and keep your employee record up to date.</p>
    </div>
  );
}

const editBtn = {
  background: "#800080",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: "5px",
  fontWeight: 500,
  marginRight: "8px"
};

const docBtn = {
  background: "#800080",
  color: "#fff",
  border: "none",
  padding: "10px 15px",
  borderRadius: "5px",
  marginRight: "10px",
  fontWeight: 500
};

export default Profile;
