import { useEffect, useState } from "react";
import { fetchMyRooms } from "../api/rooms";
import { useNavigate } from "react-router-dom";
import "./myrooms.css";

function MyRooms() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMyRooms = async () => {
      const res = await fetchMyRooms();

      const allRooms = [
        ...(res.owned || []).map((r) => ({
          ...r,
          myRole: "Admin",
        })),
        ...(res.active || []).map((r) => ({
          ...r,
          myRole: "Member",
        })),
        ...(res.requested || []).map((r) => ({
          ...r,
          myRole: "Applicant",
        })),
      ];

      setRooms(allRooms);
    };

    loadMyRooms();
  }, []);

  const handleRoomClick = (room) => {
    if (room.myRole === "Admin" || room.myRole === "Member") {
      navigate(`/rooms/${room.roomId}`);
    }
    else {
      navigate(`/announcements#post-${room.post._id}`);
    }
  };

  return (
    <div className="rooms-list">
      {rooms.length === 0 && (
        <p className="rooms-empty">
          You are not part of any rooms yet.
        </p>
      )}

      {rooms.map((room) => (
        <div
          key={room.roomId}
          className="room-card"
          onClick={() => handleRoomClick(room)}
        >
          <h3>{room.post?.title || "Untitled Post"}</h3>
          <p>{room.post?.description || ""}</p>

          <div className="room-meta">
            <span>
              <strong>Role:</strong>{" "}
              <span
                className={`role-badge ${room.myRole.toLowerCase()}`}
              >
                {room.myRole}
              </span>
            </span>

            {(room.myRole === "Admin" || room.myRole === "Member") && (
              <span>
                <strong>Status:</strong>{" "}
                <span
                  className={`status-badge ${room.status}`}
                >
                  {room.status}
                </span>
              </span>
            )}

            {room.myRole === "Applicant" && (
              <span>
                <strong>Application:</strong>{" "}
                <span className="status-badge pending">
                  Pending
                </span>
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyRooms;
