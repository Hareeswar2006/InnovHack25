import { getToken } from "../utils/auth";

const API_BASE = "http://localhost:3000";

export const fetchAnnouncements = async () => {
  const res = await fetch(`${API_BASE}/posts/announcements`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.json();
};
