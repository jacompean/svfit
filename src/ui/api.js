const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://svfit-backend.vercel.app";
export function getToken(){ return localStorage.getItem("svfit_token") || ""; }
export function setToken(t){ localStorage.setItem("svfit_token", t); }
export function clearToken(){ localStorage.removeItem("svfit_token"); }

async function request(path, { method="GET", body, auth=true } = {}){
  const headers = { "Content-Type": "application/json" };
  if (auth){
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  const txt = await res.text();
  let data = {};
  try { data = txt ? JSON.parse(txt) : {}; } catch { data = { ok:false, error: txt || "Bad JSON" }; }
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  tenant: () => request("/api/tenant", { auth:false }),
  login: (identifier, password) => request("/api/auth/login", { method:"POST", body:{ identifier, password }, auth:false }),
  me: async () => {
    try { return await request("/api/me"); }
    catch (e) {
      // Some deployments expose /api/auth/me instead
      if ((e.message || "").toLowerCase().includes("not found") || (e.message || "").includes("404")) {
        return await request("/api/auth/me");
      }
      throw e;
    }
  },
  plans: () => request("/api/plans"),
  members: (q="") => request(`/api/members${q?`?q=${encodeURIComponent(q)}`:""}`),
  preregister: (payload) => request("/api/members/preregister", { method:"POST", body: payload }),
  activate: (id, payload) => request(`/api/members/${id}/activate`, { method:"POST", body: payload }),
  products: () => request("/api/products"),
  addProduct: (payload) => request("/api/products", { method:"POST", body: payload }),
  cashCurrent: () => request("/api/cash/current"),
  cashOpen: (opening_cash) => request("/api/cash/open", { method:"POST", body:{ opening_cash } }),
  cashClose: (closing_cash) => request("/api/cash/close", { method:"POST", body:{ closing_cash } }),
  createSale: (payload) => request("/api/sales", { method:"POST", body: payload }),
  salesToday: () => request("/api/sales/today"),
  forgot: (identifier) => request("/api/auth/forgot", { method:"POST", body:{ identifier }, auth:false }),
  changePassword: (oldPassword, newPassword) => request("/api/auth/change-password", { method:"POST", body:{ oldPassword, newPassword } }),
  resetRequests: () => request("/api/admin/reset-requests"),
  resetPassword: (id_code, newPassword="") => request("/api/admin/reset-password", { method:"POST", body:{ id_code, newPassword } }),
};
