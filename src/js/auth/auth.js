import { apiPost } from '../mock-api.js';
import { MOCK_USERS } from './mock-users.js';
import { MOCK_SIGNATURE, decodeToken } from './token.js';

export const TOKEN_KEY = 'auth_token';

// POST /api/login. Si va bien, guarda el token en localStorage y devuelve { token, name };
// si no, lanza el ApiError de la petición.
export async function login(email, password) {
  const res = await apiPost('/api/login', { email, password });
  localStorage.setItem(TOKEN_KEY, res.token);
  return res;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

// Válido si tiene la firma de demo, no ha caducado y es de un usuario de demo.
export function isTokenValid(token = getToken()) {
  if (!token) return false;
  const decoded = decodeToken(token);
  if (!decoded || decoded.signature !== MOCK_SIGNATURE) return false;
  const { sub, exp } = decoded.payload;
  if (typeof exp !== 'number' || exp <= Math.floor(Date.now() / 1000)) return false;
  return MOCK_USERS.some((u) => u.email === sub);
}
