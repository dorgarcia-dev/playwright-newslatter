import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MOCK_SIGNATURE, createToken, decodeToken } from '../src/js/auth/token.js';

test('crea un token header.payload.mock-signature', () => {
  assert.match(createToken('ana@orvium.io', 'Ana García'), /^[\w-]+\.[\w-]+\.mock-signature$/);
});

test('decodifica el payload y la firma del token', () => {
  const now = Date.UTC(2026, 9, 6);
  const decoded = decodeToken(createToken('ana@orvium.io', 'Ana García', now));

  assert.deepEqual(decoded, {
    payload: { sub: 'ana@orvium.io', name: 'Ana García', exp: now / 1000 + 3600 },
    signature: MOCK_SIGNATURE,
  });
});

test('devuelve null si el token no tiene el formato esperado', () => {
  assert.equal(decodeToken('no-es-un-token'), null);
  assert.equal(decodeToken('a.%%%.mock-signature'), null);
});
