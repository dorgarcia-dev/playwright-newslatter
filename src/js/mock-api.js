import { findMockUser } from './auth/mock-users.js';
import { createToken } from './auth/token.js';

// Error de la API: lleva el código HTTP y el cuerpo de la respuesta.
export class ApiError extends Error {
  constructor(status, data) {
    super(`HTTP ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Simula la API: no hay backend, así que un 404 se convierte en la respuesta simulada.
//  - /api/subscribe: 200 { status: 'ok' } (suscripción correcta).
//  - /api/login: si el email y la contraseña son de un usuario de demo (auth/mock-users.js),
//    200 { token, name }; si no, error 401 { status: 'invalid_credentials' }.
// Cualquier otra respuesta que no sea 404 pasa tal cual. La petición sigue saliendo a la
// red, de modo que los tests e2e pueden interceptarla con page.route y devolver otra cosa.
function simulate(url, body) {
  if (url.endsWith('/api/subscribe')) {
    return { status: 200, data: { status: 'ok' } };
  }
  if (url.endsWith('/api/login')) {
    const user = findMockUser(body.email, body.password);
    return user
      ? { status: 200, data: { token: createToken(user.email, user.name), name: user.name } }
      : { status: 401, data: { status: 'invalid_credentials' } };
  }
  return null;
}

// POST con cuerpo JSON. Devuelve el cuerpo de la respuesta si es 2xx;
// si no, lanza un ApiError con el código y el cuerpo.
export async function apiPost(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const simulated = res.status === 404 ? simulate(url, body) : null;
  const status = simulated ? simulated.status : res.status;
  const data = simulated ? simulated.data : await res.json().catch(() => null);

  if (status < 200 || status >= 300) throw new ApiError(status, data);
  return data;
}
