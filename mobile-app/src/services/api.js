const API_BASE_URL = "http://localhost:51941/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status} al consultar ${path}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export const api = {
  baseUrl: API_BASE_URL,
  getStock: () => request("/Stock"),
  getTareas: () => request("/tareas"),
  createIncident: (incident) =>
    request("/incidentes", {
      method: "POST",
      body: JSON.stringify(incident),
    }),
};
