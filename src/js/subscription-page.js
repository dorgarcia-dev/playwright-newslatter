import { isValidEmail, subscribeEmail } from './subscription.js';

const form = document.querySelector('#subscribe-form');
const input = document.querySelector('[data-testid="email"]');
let successMessage = null;

// Muestra el aviso de éxito justo debajo del formulario.
function showSuccess(text) {
  successMessage = document.createElement('p');
  successMessage.className = 'alert alert-success';
  successMessage.setAttribute('role', 'status');
  successMessage.textContent = text;
  form.after(successMessage);
}

function clearSuccess() {
  successMessage?.remove();
  successMessage = null;
}

// Estado actual (ver diapositiva 9):
//  - éxito: llama a la API y muestra el mensaje de éxito.
// Fallos intencionados para el taller:
//  - email vacío: no hace nada y NO avisa al usuario.
//  - email inválido: no hace nada y NO avisa al usuario.
//  - ya suscrito / error del servidor: NO gestiona la respuesta de error.
// La lógica "funciona" en aislado (los unitarios de subscription.js pasan), pero la
// experiencia integrada está incompleta: eso es lo que destapa el test e2e.
async function subscribe() {
  clearSuccess();
  const email = input.value.trim();
  // El formulario se vacía siempre al pulsar el botón.
  input.value = '';
  if (!email) return;
  if (!isValidEmail(email)) return;

  try {
    await subscribeEmail(email);
    showSuccess('¡Te has suscrito al foro! Revisa tu correo.');
  } catch {
    // TODO: avisar de "ya estás suscrito" / error del servidor
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  subscribe();
});
