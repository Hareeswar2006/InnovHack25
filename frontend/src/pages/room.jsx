import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchRoom, updateApplicationStatus } from "../api/rooms";
import { requestToJoinRoom } from "../api/rooms";
import "./room.css";

function Room() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const loadRoom = async () => {
    try {
      const res = await fetchRoom(roomId);
      setRoom(res.room || res);
    } catch (err) {
      alert("Failed to load room");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoom();
  }, [roomId]);

  if (loading) return <p className="room-loading">Loading room...</p>;
  if (!room) return <p className="room-error">Room not found</p>;

  const isAdmin = room.admin === currentUser.id;

  const isMember = room.members.some(
    (m) => m.user._id === currentUser.id
  );

  const myApplication = room.applications.find(
    (app) => app.user._id === currentUser.id
  );

  const isApplicant = !!myApplication;

  if (!isAdmin && !isMember && !isApplicant) {
    return (
      <div className="room-container">
        <h2>Access Restricted</h2>
        <p>You don't have access to this room.</p>

        <button
          className="btn btn-primary"
          onClick={async () => {
            setActionLoading(true);
            await requestToJoinRoom(room.roomId, "");
            setActionLoading(false);
            loadRoom();
          }}
          disabled={actionLoading}
        >
          {actionLoading ? "Requesting..." : "Request to Join"}
        </button>
      </div>
    );
  }

  return (
    <div className="room-container">
      <div className="room-card">
        <h2>{room.post.title}</h2>
        <p className="room-description">{room.post.description}</p>

        <p className="room-skills">
          <strong>Required Skills:</strong>{" "}
          {room.post.skillsRequired.join(", ")}
        </p>
      </div>

      {/* APPLICANT VIEW */}
      {isApplicant && !isMember && !isAdmin && (
        <div className="room-card">
          <h3>Your Application</h3>
          <p>
            Status:{" "}
            <span className={`status ${myApplication.status}`}>
              {myApplication.status}
            </span>
          </p>
        </div>
      )}

      {/* MEMBER VIEW */}
      {isMember && (
        <div className="room-card">
          <h3>Team Members</h3>

          <div className="member-list">
           {room.members.map((m, index) => (
            <div className="member-item" key={m.user._id}>
              <img src={m.user.profilePic} alt="profile" />
              <span>{m.user.name}</span>
            </div>
          ))}
          </div>
        </div>
      )}

      {/* ADMIN VIEW */}
      {isAdmin && (
        <>
          <div className="room-card">
            <p>
              <strong>Room Code:</strong> {room.roomCode}
            </p>
          </div>

          <div className="room-card">
            <h3>Applications</h3>

            {room.applications.filter(
              (app) => app.status === "pending"
            ).length === 0 && (
              <p>No pending applications</p>
            )}

            {room.applications
              .filter((app) => app.status === "pending")
              .map((app) => (
                <div className="application-item" key={app._id}>
                  <div>
                    <strong>{app.user.name}</strong>
                    <p>{app.message || "No message"}</p>
                  </div>

                  <div className="application-actions">
                    <button
                      className="btn btn-primary"
                      onClick={async () => {
                        await updateApplicationStatus(
                          room.roomId,
                          app._id,
                          "accept"
                        );
                        loadRoom();
                      }}
                    >
                      Accept
                    </button>

                    <button
                      className="btn btn-outline"
                      onClick={async () => {
                        await updateApplicationStatus(
                          room.roomId,
                          app._id,
                          "reject"
                        );
                        loadRoom();
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Room;
