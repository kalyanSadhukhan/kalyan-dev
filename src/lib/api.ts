// Adjust BASE_URL if your Spring Boot backend runs on a specific port and isn't proxied yet
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const getAuthToken = () => localStorage.getItem("admin_jwt");
export const setAuthToken = (token: string) => localStorage.setItem("admin_jwt", token);
export const removeAuthToken = () => localStorage.removeItem("admin_jwt");

async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = getAuthToken();
    const headers = new Headers(options.headers);

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    // Set default content type
    if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(`${BASE_URL}${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        if (response.status === 401) {
            // Handle unauthorized (e.g., token expired)
            removeAuthToken();
            window.dispatchEvent(new Event("auth-unauthorized"));
        }
        const errorBody = await response.text();
        throw new Error(errorBody || "An error occurred");
    }

    // Handle empty responses
    if (response.status === 204) return null;
    return response.json();
}

export const api = {
    get: (url: string) => fetchWithAuth(url),
    post: (url: string, data: unknown) => fetchWithAuth(url, { method: "POST", body: JSON.stringify(data) }),
    put: (url: string, data: unknown) => fetchWithAuth(url, { method: "PUT", body: JSON.stringify(data) }),
    delete: (url: string) => fetchWithAuth(url, { method: "DELETE" }),
    // For file uploads if needed in the future
    postFormData: (url: string, formData: FormData) => fetchWithAuth(url, { method: "POST", body: formData }),
    putFormData: (url: string, formData: FormData) => fetchWithAuth(url, { method: "PUT", body: formData })
};
