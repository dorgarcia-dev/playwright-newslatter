/**
 * @typedef {object} MockUser
 * @property {string} email
 * @property {string} password
 * @property {string} name
 */

// Usuarios de demostración: no hay backend, mock-api.js valida contra esta lista.
/** @type {readonly MockUser[]} */
export const MOCK_USERS = [
  { email: 'ana@orvium.io', password: 'playwright123', name: 'Ana García' },
  { email: 'luis@orvium.io', password: 'testing456', name: 'Luis Martín' },
];

/** @returns {MockUser | undefined} */
export function findMockUser(email, password) {
  return MOCK_USERS.find((u) => u.email === email && u.password === password);
}
