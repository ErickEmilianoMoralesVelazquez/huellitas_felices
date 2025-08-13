// Utilidades para roles y JWT

// Decodifica JWT sin validar firma (solo para leer claims en el cliente)
export function decodeJwt(token) {
    try {
      const [, payload] = token.split(".");
      const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
      return JSON.parse(decodeURIComponent(escape(json)));
    } catch {
      return null;
    }
  }
  
  // Intenta extraer UN rol estandarizado: "adoptador" | "admin" | "empleado"
  export function extractRole({ data, token }) {
    // 1) Backend retorna user con rol/roles
    const direct =
      data?.user?.rol || data?.user?.role || data?.role ||
      (Array.isArray(data?.roles) ? data.roles[0] : null) ||
      (Array.isArray(data?.user?.roles) ? data.user.roles[0] : null);
  
    // 2) Si no, lo intentamos desde el JWT
    let jwtRole = null;
    if (token) {
      const claims = decodeJwt(token) || {};
      jwtRole =
        claims.role ||
        (Array.isArray(claims.roles) ? claims.roles[0] : null) ||
        (Array.isArray(claims.authorities) ? claims.authorities[0] : null) ||
        claims.authority ||
        claims.rol;
    }
  
    const raw = (direct || jwtRole || "").toString().toLowerCase();
  
    // Normaliza números / alias comunes del backend
    // Ajusta si tu backend usa otros códigos
    const mapNumeric = { "1": "adoptador", "2": "empleado", "3": "admin" };
    if (mapNumeric[raw]) return mapNumeric[raw];
  
    // Limpia prefijos típicos (e.g., "ROLE_ADMIN")
    const cleaned = raw.replace(/^role[_-]?/i, "");
  
    // Normaliza valores
    if (/(admin)/.test(cleaned)) return "admin";
    if (/(empleado|staff|worker)/.test(cleaned)) return "empleado";
    if (/(adoptador|adopter)/.test(cleaned)) return "adoptador";
  
    // Fallback
    return "adoptador";
  }
  
  // Redirige según el rol
  export function redirectByRole(navigate, role) {
    const r = (role || "").toLowerCase();
    if (r === "admin") return navigate("/admin", { replace: true });
    if (r === "empleado") return navigate("/empleado", { replace: true });
    return navigate("/adoptador", { replace: true }); // default
  }
  