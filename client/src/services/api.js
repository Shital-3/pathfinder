const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export async function apiRequest(path, options = {}) {
	const headers = new Headers(options.headers || {});
	if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");


	const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers, credentials: "include" });
	const payload = await response.json().catch(() => ({}));

	if (response.status === 401 && path !== "/auth/login" && path !== "/auth/register") {
		window.dispatchEvent(new Event("pathfinder:auth-expired"));
	}

	if (!response.ok) throw new Error(payload.message || "Request failed");
	return payload.data;
}

export const authApi = {
	register: (name, email, password) => apiRequest("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) }),
	login: (email, password) => apiRequest("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
	me: () => apiRequest("/auth/me"),
	logout: () => apiRequest("/auth/logout", { method: "POST" }),
};

export const adminApi = {
  pending: () => apiRequest("/admin/experiences/pending"),
  approve: (id, note = "") => apiRequest(`/admin/experiences/${id}/approve`, { method: "PATCH", body: JSON.stringify({ note }) }),
  reject: (id, note) => apiRequest(`/admin/experiences/${id}/reject`, { method: "PATCH", body: JSON.stringify({ note }) }),
};

export const aiApi = {
  advisor: (payload) => apiRequest("/ai/advisor", { method: "POST", body: JSON.stringify(payload) }),
  analyzeExperience: (payload) => apiRequest("/ai/analyze-experience", { method: "POST", body: JSON.stringify(payload) }),
  similar: (id) => apiRequest(`/ai/similar/${id}`),
};
