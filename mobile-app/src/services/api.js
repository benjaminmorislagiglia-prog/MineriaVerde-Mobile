//// URL base de la API ASP.NET. En celular real debe cambiarse por la IP local de la PC.
const API_BASE_URL = "http://localhost:51941/api";

//// Funcion generica para consultar endpoints REST y reutilizar manejo de errores.
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

//// Metodos preparados para consumir datos reales desde la API.
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
