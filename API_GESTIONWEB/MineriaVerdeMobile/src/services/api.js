
const API_BASE_URL = "http://localhost:51941/api";

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `Error HTTP ${response.status}: ${message}`
    );
  }

  return response.json();
}

export async function obtenerEmpleados() {
  return apiRequest("/empleados");
}
