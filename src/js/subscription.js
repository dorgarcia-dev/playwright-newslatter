import { apiPost } from './mock-api.js';

// Validación de email. Esta lógica es correcta y la cubren los tests unitarios.
export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// POST /api/subscribe. Resuelve con { status: 'ok' } o lanza un ApiError
// (por ejemplo, 409 { status: 'already_subscribed' }).
export function subscribeEmail(email) {
  return apiPost('/api/subscribe', { email });
}
