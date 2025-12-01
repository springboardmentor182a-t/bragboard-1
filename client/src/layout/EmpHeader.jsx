import "./EmpHeader.css";
function EmpHeader() {
  return (
    <header className="header">
      <input type="text" placeholder="Search..." />
      <div className="profile">
        <span>User Name</span>
      </div>
    </header>
  );
}
export default EmpHeader;
