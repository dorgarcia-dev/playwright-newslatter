import { test, expect } from '@playwright/test';

// Login de demostración. Estos tests PASAN: sin page.route, la simulación de la API de la app
// (src/js/mock-api.js) responde a /api/login con los dos usuarios de demo (src/js/auth/mock-users.js).

const users = [
  { email: 'ana@orvium.io', password: 'playwright123', name: 'Ana García' },
  { email: 'luis@orvium.io', password: 'testing456', name: 'Luis Martín' },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
});

for (const user of users) {
  test(`inicia sesión como ${user.name}`, async ({ page }) => {
    await page.getByLabel('Correo electrónico').fill(user.email);
    await page.getByLabel('Contraseña').fill(user.password);
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page.getByRole('status')).toHaveText(`Has iniciado sesión como ${user.name}.`);
    const token = await page.evaluate(() => localStorage.getItem('auth_token'));
    expect(token).toMatch(/^[\w-]+\.[\w-]+\.mock-signature$/);
  });
}

test('avisa cuando la contraseña es incorrecta', async ({ page }) => {
  await page.getByLabel('Correo electrónico').fill('ana@orvium.io');
  await page.getByLabel('Contraseña').fill('contraseña-incorrecta');
  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page.getByRole('alert')).toHaveText('Email o contraseña incorrectos.');
  expect(await page.evaluate(() => localStorage.getItem('auth_token'))).toBeNull();
});
