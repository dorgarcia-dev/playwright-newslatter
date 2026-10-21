import { test, expect } from '@playwright/test';

// Cubre la diapositiva 9: la vista de suscripción a la newsletter.
// Hoy todos menos el de éxito FALLAN a propósito: la página solo da feedback
// al usuario cuando la suscripción va bien. Los que fallan son el "rojo" que
// arreglaremos en la app hasta ponerlos en verde.
//
// El servidor se simula con page.route: no hace falta backend real.

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('muestra un mensaje de éxito al suscribirse con un email válido', async ({ page }) => {
  await page.route('**/api/subscribe', (route) =>
    route.fulfill({ status: 200, json: { status: 'ok' } }));

  await page.getByTestId('email').fill('ana@orvium.io');
  await page.getByTestId('subscribe').click();

  await expect(page.getByText(/te has suscrito/i)).toBeVisible();
});

test('avisa cuando el email es incorrecto', async ({ page }) => {
  await page.getByTestId('email').fill('esto-no-es-un-email');
  await page.getByTestId('subscribe').click();

  await expect(page.getByText(/email no válido/i)).toBeVisible();
});

test('avisa cuando el campo está vacío', async ({ page }) => {
  await page.getByTestId('subscribe').click();

  await expect(page.getByText(/introduce tu email/i)).toBeVisible();
});

test('avisa cuando el usuario ya está suscrito', async ({ page }) => {
  await page.route('**/api/subscribe', (route) =>
    route.fulfill({ status: 409, json: { status: 'already_subscribed' } }));

  await page.getByTestId('email').fill('ana@orvium.io');
  await page.getByTestId('subscribe').click();

  await expect(page.getByText(/ya estás suscrito/i)).toBeVisible();
});
