import { isTokenValid } from './auth.js';

// Protege la página que lo carga: sin un token válido en localStorage, redirige a /login.
if (!isTokenValid()) {
  location.replace('/login');
}
