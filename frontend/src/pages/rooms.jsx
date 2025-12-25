import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./rooms.css";

function Rooms() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <h2>Rooms</h2>
      <button
        className="fab"
        onClick={() => navigate("/rooms/create")}
      >
        +
      </button>
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
