// src/lib/api.js
const BASE_URL = import.meta.env.VITE_SERVER_IP?.replace(/\/+$/, "") || "";

async function api(path, { method = "GET", body, headers } = {}) {
  const res = await fetch(`${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json().catch(() => ({})) : await res.text();

  if (!res.ok) {
    // intenta leer mensaje/errores de validación
    const serverMsg =
      (isJson && (data?.message || data?.error || data?.mensaje)) ||
      (typeof data === "string" && data) ||
      res.statusText;

    const err = new Error(serverMsg || `Error ${res.status}`);
    err.status = res.status;
    err.details = isJson ? (data?.errors || data?.detalle || data) : undefined;
    throw err;
  }
  return isJson ? data : { raw: data };
}

export const registerAdopter = (payload) =>
  api("/auth/register/adopter", { method: "POST", body: payload });

export const login = (payload) =>
  api("/auth/login", { method: "POST", body: payload });
