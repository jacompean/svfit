import { getToken, clearSession } from "./auth";

const BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:3001";

async function request(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    clearSession();
  }
  if (!res.ok) {
    const msg = data?.error || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export const api = {
  health: () => request("/api/health"),
  login: (email, password) => request("/api/auth/login", { method: "POST", body: { email, password } }),
  register: (payload) => request("/api/auth/register", { method: "POST", body: payload }),
  me: () => request("/api/me"),

  dashboard: () => request("/api/dashboard/summary"),

  members: (q = "") => request(`/api/members${q ? `?q=${encodeURIComponent(q)}` : ""}`),
  createMember: (payload) => request("/api/members", { method: "POST", body: payload }),
  getMember: (id) => request(`/api/members/${id}`),
  updateMember: (id, payload) => request(`/api/members/${id}`, { method: "PUT", body: payload }),
  deleteMember: (id) => request(`/api/members/${id}`, { method: "DELETE" }),

  attendance: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/attendance${qs ? `?${qs}` : ""}`);
  },
  checkin: (member_id, method = "manual") => request("/api/attendance/checkin", { method: "POST", body: { member_id, method } }),

  payments: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/payments${qs ? `?${qs}` : ""}`);
  },
  createPayment: (payload) => request("/api/payments", { method: "POST", body: payload }),

  classes: () => request("/api/classes"),
  createClass: (payload) => request("/api/classes", { method: "POST", body: payload }),
  enroll: (classId, member_id) => request(`/api/classes/${classId}/enroll`, { method: "POST", body: { member_id } })
};
