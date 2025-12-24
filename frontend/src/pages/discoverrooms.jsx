import { useEffect, useState } from "react";
import { fetchAllRooms } from "../api/rooms";
import { useNavigate } from "react-router-dom";
import "./discoverrooms.css";

function DiscoverRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const res = await fetchAllRooms();
        setRooms(res.rooms || []);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  if (loading) return <p>Loading rooms...</p>;

  const localData = JSON.parse(localStorage.getItem("user"));

  const currentUser = localData?.user || localData;
  const currentUserId = currentUser?._id || currentUser?.id || currentUser?.userId;

  if (!currentUserId) {
      console.error("❌ Could not find User ID in localStorage:", localData);
      return <p>Error: User ID missing. Please log out and log in again.</p>;
  }

  const filteredRooms = rooms.filter((room) => {
    
    const adminId = room.admin?._id || room.admin || room.createdBy;
    const isAdmin = String(adminId) === String(currentUserId);

    const members = room.members || [];
    const isMember = members.some((m) => {
        const memberId = m.user?._id || m.user;
        return String(memberId) === String(currentUserId);
    });

    const applications = room.applications || [];
    const isApplicant = applications.some((app) => {
        const applicantId = app.user?._id || app.user;
        return String(applicantId) === String(currentUserId);
    });

    return !isAdmin && !isMember && !isApplicant;
  });

  return (
    <div className="rooms-list">
        {filteredRooms.length === 0 && (
          <p className="rooms-empty">No active rooms found.</p>
        )}

        {filteredRooms.map((room) => (
          <div
            key={room.roomId}  
            className="room-card"
            onClick={() => navigate(`/announcements#post-${room.post._id}`)}
          >
            <h3>{room.post?.title || "Untitled Room"}</h3>
            <p>{room.post?.description || "No description available."}</p>

            <div className="room-meta">
              <span>
                <strong>Skills:</strong>{" "}
                {room.post?.skillsRequired?.join(", ") || "None"}
              </span>
              <span>
                <strong>Status:</strong> {room.status}
              </span>
            </div>
          </div>
        ))}
    </div>
  );
}

export default DiscoverRooms;