import { getToken } from "../utils/auth";

const API_BASE = "http://localhost:3000";

export const requestToJoinRoom = async (roomId, message = "") => {
    const res = await fetch(`${API_BASE}/rooms/${roomId}/request`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ message })
    });

    return res.json();
};

export const fetchRoom = async (roomId) => {
  const res = await fetch(`${API_BASE}/rooms/${roomId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};

export const updateApplicationStatus = async (
  roomId,
  applicationId,
  action
) => {
  const res = await fetch(
    `${API_BASE}/rooms/${roomId}/applications/${applicationId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ action }),
    }
  );

  return res.json();
};

export const fetchAllRooms = async () => {
  const res = await fetch(`${API_BASE}/rooms`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};

export const fetchMyRooms = async () => {
  const res = await fetch(`${API_BASE}/rooms/my_rooms`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};

export const createRoom = async (postId) => {
  const res = await fetch(`${API_BASE}/rooms/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ postId }),
  });

  return res.json();
};
