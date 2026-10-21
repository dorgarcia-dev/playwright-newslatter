// Token falso con forma de JWT: header.payload.signature.
// header y payload son JSON en base64url; la firma es el literal MOCK_SIGNATURE.
// No es seguro: solo sirve para que la demo tenga un token que guardar y comprobar.
export const MOCK_SIGNATURE = 'mock-signature';

/**
 * @typedef {object} TokenPayload
 * @property {string} sub
 * @property {string} name
 * @property {number} exp Caducidad en segundos desde epoch.
 */

function toBase64Url(value) {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(part) {
  const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '='));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

// Crea un token para el usuario que caduca en una hora.
export function createToken(email, name, now = Date.now()) {
  const header = toBase64Url({ alg: 'none', typ: 'JWT' });
  const payload = toBase64Url({ sub: email, name, exp: Math.floor(now / 1000) + 3600 });
  return `${header}.${payload}.${MOCK_SIGNATURE}`;
}

// Devuelve la firma y el payload del token, o null si no tiene el formato esperado.
/** @returns {{ payload: TokenPayload, signature: string } | null} */
export function decodeToken(token) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    return { payload: fromBase64Url(parts[1]), signature: parts[2] };
  } catch {
    return null;
  }
}
