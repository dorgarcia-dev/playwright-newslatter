import { login } from './auth/auth.js';
import { MOCK_USERS } from './auth/mock-users.js';

// Login de demostración: llama a login() de auth.js (POST /api/login, simulado por mock-api.js).
// Si va bien muestra con quién has iniciado sesión y se queda en la página;
// si las credenciales no son válidas muestra un error. Cada envío limpia los mensajes.

const form = document.querySelector('#login-form');
const emailInput = document.querySelector('[data-testid="login-email"]');
const passwordInput = document.querySelector('[data-testid="login-password"]');
const demoUsersList = document.querySelector('.demo-users ul');
let message = null;

// Usuarios de demo que se enseñan en la pista de la página.
for (const user of MOCK_USERS) {
  const li = document.createElement('li');
  const email = document.createElement('code');
  email.textContent = user.email;
  const password = document.createElement('code');
  password.textContent = user.password;
  li.append(email, ' / ', password);
  demoUsersList.append(li);
}

// Muestra un único aviso (éxito o error) justo debajo del formulario.
function showMessage({ className, role, testId, text }) {
  message = document.createElement('p');
  message.className = `alert ${className}`;
  message.setAttribute('role', role);
  message.dataset.testid = testId;
  message.textContent = text;
  form.after(message);
}

function clearMessage() {
  message?.remove();
  message = null;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearMessage();

  try {
    const res = await login(emailInput.value.trim(), passwordInput.value);
    showMessage({
      className: 'alert-success',
      role: 'status',
      testId: 'login-message',
      text: `Has iniciado sesión como ${res.name}.`,
    });
  } catch {
    showMessage({
      className: 'alert-error',
      role: 'alert',
      testId: 'login-error',
      text: 'Email o contraseña incorrectos.',
    });
  }
});
