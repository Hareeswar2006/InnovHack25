import { Link } from "react-router-dom";
import "./navbar.css";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <span className="logo">SkillSync</span>
            </div>

            <div className="navbar-right">
                <Link to="/announcements">Announcements</Link>{"  "}
                <Link to="/rooms">Rooms</Link>{"  "}
                <Link to="/profile">Profile</Link>
            </div>
        </nav>
    );
}

export default Navbar;