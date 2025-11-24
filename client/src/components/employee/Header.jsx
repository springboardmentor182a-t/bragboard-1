import "./Header.css";
function Header() {
  return (
    <header className="header">
      <input type="text" placeholder="Search..." />
      <div className="profile">
        <span>User Name</span>
      </div>
    </header>
  );
}
export default Header;
