import "./EmpHeader.css";
function EmpHeader() {
  return (
    <div className="text-black">
      <header className="header">
        <input type="text" placeholder="Search..." />
        <div className="profile">
          <span>User Name</span>
        </div>
      </header>
    </div>
  );
}
export default EmpHeader;
