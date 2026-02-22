export type FetchOperation =
  | "login"
  | "register"
  | "createRestaurant"
  | "fetchRestaurant"
  | "fetchTables"
  | "createTables"
  | "fetchBranches"
  | "fetchRequests"
  | "markAttended"
  | "createBillRequest";

const SERVERS_DOWN =
  "En este momento los servidores no están disponibles. Por favor, reintentá más tarde.";

const SESSION_EXPIRED =
  "Tu sesión expiró. Por favor, iniciá sesión nuevamente.";

const SERVER_ERROR =
  "Ocurrió un error en nuestros servidores. Por favor, reintentá en unos minutos.";

function isNetworkError(error: unknown): boolean {
  return (
    error instanceof TypeError &&
    error.message.toLowerCase().includes("failed to fetch")
  );
}

function extractHttpStatus(error: Error): number | null {
  // Patrón "HTTP error 401" que lanza el http-client
  const match = error.message.match(/HTTP error (\d{3})/);
  if (match) return parseInt(match[1], 10);

  // Algunos backends incluyen el status en el body JSON
  try {
    const parsed = JSON.parse(error.message);
    if (typeof parsed.statusCode === "number") return parsed.statusCode;
    if (typeof parsed.status === "number") return parsed.status;
  } catch {
    // no es JSON
  }

  return null;
}

const byStatus: Record<FetchOperation, Partial<Record<number, string>>> = {
  login: {
    401: "El correo o la contraseña son incorrectos.",
    403: "Tu cuenta fue desactivada. Contactá al soporte para más información.",
  },
  register: {
    400: "Los datos ingresados no son válidos. Revisalos e intentá de nuevo.",
    409: "Ya existe una cuenta registrada con ese correo electrónico.",
  },
  createRestaurant: {
    400: "Los datos del restaurante no son válidos. Revisalos e intentá de nuevo.",
    401: SESSION_EXPIRED,
    409: "Ya existe un restaurante registrado con ese nombre.",
  },
  fetchRestaurant: {
    401: SESSION_EXPIRED,
    404: "No encontramos tu restaurante. Contactá al soporte si el problema persiste.",
  },
  fetchTables: {
    401: SESSION_EXPIRED,
    404: "No encontramos las mesas de esta sucursal.",
  },
  createTables: {
    400: "Los datos de las mesas no son válidos. Revisalos e intentá de nuevo.",
    401: SESSION_EXPIRED,
  },
  fetchBranches: {
    401: SESSION_EXPIRED,
    404: "No encontramos sucursales para tu restaurante.",
  },
  fetchRequests: {
    401: SESSION_EXPIRED,
    403: "No tenés permisos para ver las solicitudes.",
  },
  markAttended: {
    401: SESSION_EXPIRED,
    404: "La solicitud ya no existe o fue procesada anteriormente.",
  },
  createBillRequest: {
    400: "Los datos de la solicitud no son válidos.",
    409: "Ya existe una solicitud activa para esta mesa.",
  },
};

const defaultMessages: Record<FetchOperation, string> = {
  login: "No pudimos iniciar sesión. Por favor, reintentá más tarde.",
  register: "No pudimos crear tu cuenta. Por favor, reintentá más tarde.",
  createRestaurant:
    "No pudimos crear el restaurante. Por favor, reintentá más tarde.",
  fetchRestaurant:
    "No pudimos cargar la información del restaurante. Por favor, reintentá más tarde.",
  fetchTables: "No pudimos cargar las mesas. Por favor, reintentá más tarde.",
  createTables: "No pudimos crear las mesas. Por favor, reintentá más tarde.",
  fetchBranches:
    "No pudimos cargar las sucursales. Por favor, reintentá más tarde.",
  fetchRequests:
    "No pudimos cargar las solicitudes. Por favor, reintentá más tarde.",
  markAttended:
    "No pudimos marcar la solicitud como atendida. Por favor, reintentá más tarde.",
  createBillRequest:
    "No pudimos enviar tu solicitud. Por favor, reintentá más tarde.",
};

/**
 * Devuelve un mensaje de error amigable según el tipo de error y la operación.
 *
 * - Error de red (sin conexión / servidor caído): mensaje genérico de servidores no disponibles.
 * - Error HTTP con status conocido: mensaje específico por operación y código.
 * - Error HTTP 5xx: mensaje genérico de error en servidores.
 * - Cualquier otro caso: mensaje por defecto de la operación.
 */
export function getErrorMessage(
  error: unknown,
  operation: FetchOperation,
): string {
  if (isNetworkError(error)) {
    return SERVERS_DOWN;
  }

  if (error instanceof Error) {
    const status = extractHttpStatus(error);
    if (status !== null) {
      const statusMessage = byStatus[operation][status];
      if (statusMessage) return statusMessage;
      if (status >= 500) return SERVER_ERROR;
    }
  }

  return defaultMessages[operation];
}
