import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { TOKEN_KEY, getToken, isTokenValid, login, logout } from '../src/js/auth/auth.js';
import { createToken } from '../src/js/auth/token.js';

// Sustituye globalThis.fetch por uno que responde con `status` y `body` (JSON)
// y apunta cada llamada en `calls` como { url, method, body }.
function stubFetch(status, body) {
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url, method: init.method, body: JSON.parse(init.body) });
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  };
  return { calls, restore: () => (globalThis.fetch = original) };
}

// En Node no hay localStorage: lo sustituye uno mínimo en memoria con la API que usa auth.js.
function stubLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
    clear: () => data.clear(),
  };
  return globalThis.localStorage;
}

let storage;
let fetchStub;

beforeEach(() => {
  storage = stubLocalStorage();
});

afterEach(() => {
  fetchStub?.restore();
  fetchStub = undefined;
});

test('da por válido el token de un usuario de demo', () => {
  assert.equal(isTokenValid(createToken('ana@orvium.io', 'Ana García')), true);
});

test('rechaza un token caducado', () => {
  const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
  assert.equal(isTokenValid(createToken('ana@orvium.io', 'Ana García', twoHoursAgo)), false);
});

test('rechaza un token con la firma manipulada', () => {
  const [header, payload] = createToken('ana@orvium.io', 'Ana García').split('.');
  assert.equal(isTokenValid(`${header}.${payload}.otra-firma`), false);
});

test('rechaza un token de un email que no es de demo', () => {
  assert.equal(isTokenValid(createToken('nadie@orvium.io', 'Nadie')), false);
});

test('guarda el token tras un login correcto', async () => {
  const token = createToken('ana@orvium.io', 'Ana García');
  fetchStub = stubFetch(200, { token, name: 'Ana García' });

  const res = await login('ana@orvium.io', 'playwright123');

  assert.deepEqual(fetchStub.calls, [
    {
      url: '/api/login',
      method: 'POST',
      body: { email: 'ana@orvium.io', password: 'playwright123' },
    },
  ]);
  assert.deepEqual(res, { token, name: 'Ana García' });
  assert.equal(storage.getItem(TOKEN_KEY), token);
  assert.equal(getToken(), token);
  assert.equal(isTokenValid(), true);
});

test('simula el login de un usuario de demo cuando no hay backend (404)', async () => {
  fetchStub = stubFetch(404, null);

  const res = await login('luis@orvium.io', 'testing456');

  assert.equal(res.name, 'Luis Martín');
  assert.equal(getToken(), res.token);
});

test('no guarda token si las credenciales no son válidas', async () => {
  fetchStub = stubFetch(404, null);

  await assert.rejects(login('ana@orvium.io', 'mala'), {
    status: 401,
    data: { status: 'invalid_credentials' },
  });
  assert.equal(getToken(), null);
});

test('logout borra el token', () => {
  storage.setItem(TOKEN_KEY, createToken('ana@orvium.io', 'Ana García'));

  logout();

  assert.equal(getToken(), null);
});
