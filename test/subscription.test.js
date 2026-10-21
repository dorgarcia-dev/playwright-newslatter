import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { isValidEmail, subscribeEmail } from '../src/js/subscription.js';

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

let fetchStub;
afterEach(() => fetchStub?.restore());

test('valida emails correctos e incorrectos', () => {
  assert.equal(isValidEmail('ana@orvium.io'), true);
  assert.equal(isValidEmail('sin-arroba'), false);
  assert.equal(isValidEmail(''), false);
});

test('envía la suscripción a /api/subscribe con el email', async () => {
  fetchStub = stubFetch(200, { status: 'ok' });

  const res = await subscribeEmail('ana@orvium.io');

  assert.equal(fetchStub.calls.length, 1);
  assert.deepEqual(fetchStub.calls[0], {
    url: '/api/subscribe',
    method: 'POST',
    body: { email: 'ana@orvium.io' },
  });
  assert.deepEqual(res, { status: 'ok' });
});

test('simula un 200 cuando no hay backend (404)', async () => {
  fetchStub = stubFetch(404, null);

  assert.deepEqual(await subscribeEmail('ana@orvium.io'), { status: 'ok' });
});

test('lanza el error del servidor si no es 404', async () => {
  fetchStub = stubFetch(409, { status: 'already_subscribed' });

  await assert.rejects(subscribeEmail('ana@orvium.io'), {
    status: 409,
    data: { status: 'already_subscribed' },
  });
});
