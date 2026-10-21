# Foro Playwright — repo de prácticas

Repositorio para practicar lo que vemos en el **taller de Testing E2E con Playwright e IA**. Es una app hecha con HTML, CSS y JavaScript sin framework (módulos ES nativos, sin paso de build) pensada para escribir tests sobre ella, no un producto real.

> **Solo hay front.** No existe backend: las respuestas de la API están simuladas. `npm start` sirve
> la carpeta `src/` con [`serve`](https://www.npmjs.com/package/serve), un servidor de ficheros
> estáticos: no hay código de servidor propio.

## Qué hay en la app

| Ruta     | Vista       | Para qué sirve                                                        |
|----------|-------------|-----------------------------------------------------------------------|
| `/`      | Suscripción | Formulario para suscribirse al foro. Es la vista del ejercicio final. |
| `/foro`  | Foro        | Posts con contenido del curso: locators, acciones, aserciones…        |
| `/login` | Login       | Login simulado con dos usuarios de prueba (ver abajo).                |

Usuarios de prueba para `/login` (al entrar se guarda un token falso en `localStorage`,
clave `auth_token`):

| Email            | Contraseña      | Nombre      |
|------------------|-----------------|-------------|
| `ana@orvium.io`  | `playwright123` | Ana García  |
| `luis@orvium.io` | `testing456`    | Luis Martín |

## Las respuestas de la API son simuladas

La suscripción hace un `POST /api/subscribe` y el login un `POST /api/login`, pero no hay
servidor detrás:

- **En el navegador**, `src/js/mock-api.js` hace la petición de verdad y, como el servidor estático
  responde 404, la convierte en la respuesta simulada. Así se puede probar a mano.
  - `/api/subscribe` → `200 { status: 'ok' }`.
  - `/api/login` → con un usuario de prueba, `200 { token, name }`; si no, `401 { status: 'invalid_credentials' }`.
- **En los tests e2e de la suscripción**, la petición se intercepta con `page.route` y se devuelve
  lo que necesite cada caso (200 de éxito, 409 "ya suscrito"…). Los e2e del login no la
  interceptan: usan la simulación de `mock-api.js` con los usuarios de prueba.

## El ejercicio

La página de suscripción (`src/js/subscription-page.js`) tiene fallos **intencionados**. Solo el
caso de éxito da feedback; con el email vacío, un email incorrecto o un usuario ya suscrito no
avisa de nada.

- `npm test` → los **unitarios pasan**: la lógica (`src/js/subscription.js`), en aislado, "funciona".
- `npm run e2e` → parte de los **e2e fallan**: la experiencia integrada está incompleta.

El objetivo es arreglar la página hasta poner todos los e2e en verde, sin romper los unitarios.

## Práctica 2 · Autenticación con storageState

En esta rama la suscripción (`/`) está **protegida**: sin un token válido en `localStorage`,
`src/js/auth/auth-guard.js` redirige a `/login`. Por eso los e2e de suscripción fallan ahora
antes de llegar al formulario.

Tu tarea: crea un proyecto `setup` en `playwright.config.ts` que inicie sesión una vez con un
usuario de demo y guarde el estado con `storageState`. Haz que el proyecto de los tests dependa
de él y use ese estado, para que los tests de suscripción arranquen ya autenticados, sin tocar
su código.

## Estructura

```
src/
  index.html                 vista de suscripción (/)
  foro.html                  vista del foro (/foro)
  login.html                 vista de login (/login)
  css/                       estilos globales (styles.css) y uno por página
  js/
    mock-api.js              simulación de la API
    subscription.js          lógica de la suscripción (validación y POST /api/subscribe)
    subscription-page.js     comportamiento de la página de suscripción
    forum-posts.js           posts del foro
    forum-page.js            pinta los posts del foro
    login-page.js            comportamiento de la página de login
    auth/                    usuarios de prueba, token falso, login/logout y guard
test/                       tests unitarios (node:test) de la lógica
e2e/
  playwright.config.ts       levanta `npm start` antes de los tests
  tests/subscription.spec.ts tests e2e de la suscripción
  tests/login.spec.ts        tests e2e del login
```

## Comandos

```bash
npm install         # una vez
npx playwright install chromium   # navegador para los e2e, una vez
npm start           # app en http://localhost:4200
npm test            # tests unitarios (node --test)
npm run e2e         # tests e2e con Playwright
npm run e2e -- --ui # e2e en modo UI
```
