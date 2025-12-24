import { getToken } from "../utils/auth";

const API_BASE = "http://localhost:3000";

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await fetch(`${API_BASE}/profile/upload-resume`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  return res.json();
};
