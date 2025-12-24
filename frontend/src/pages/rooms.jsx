import { NavLink, Outlet } from "react-router-dom";
import "./rooms.css";

function Rooms() {
  return (
    <div className="page-container">
      <h2>Rooms</h2>

      <div className="rooms-tabs">
        <NavLink to="discover" className="tab">
          Discover Rooms
        </NavLink>
        <NavLink to="my-rooms" className="tab">
          My Rooms
        </NavLink>
      </div>

      <Outlet />
    </div>
  );
}

export default Rooms;
