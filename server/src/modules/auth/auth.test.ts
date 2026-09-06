import assert from "node:assert/strict";
import test from "node:test";
import { hashPassword, normalizeEmail, registrationError, verifyPassword } from "./auth.credentials.js";
import { signSessionToken, verifySessionToken } from "./auth.token.js";

// Both modules under test are pure, so the suite runs without a DATABASE_URL.
const secret = "test-secret-that-is-at-least-thirty-two-bytes-long";

test("registration credentials are normalized, validated, hashed, and verified", async () => {
  const email = normalizeEmail("  Guest@Example.COM ");
  assert.equal(email, "guest@example.com");
  assert.equal(registrationError(email, "password123", "password123"), null);

  const passwordHash = await hashPassword("password123");
  assert.notEqual(passwordHash, "password123");
  assert.equal(await verifyPassword("password123", passwordHash), true);
  assert.equal(await verifyPassword("wrong-password", passwordHash), false);
});

test("registration rejects invalid email, short passwords, and mismatched confirmation", () => {
  assert.equal(registrationError("invalid", "password123", "password123"), "Enter a valid email address");
  assert.equal(
    registrationError("guest@example.com", "short", "short"),
    "Password must be at least 8 characters",
  );
  assert.equal(
    registrationError("guest@example.com", "password123", "different123"),
    "Passwords do not match",
  );
});

test("JWT session tokens preserve the database user id and role", async () => {
  const token = await signSessionToken(
    { userId: "9272f1f4-606d-4e7c-85dc-c9c1c44562ec", role: "guest" },
    secret,
  );
  const payload = await verifySessionToken(token, secret);

  assert.equal(payload?.userId, "9272f1f4-606d-4e7c-85dc-c9c1c44562ec");
  assert.equal(payload?.role, "guest");
  assert.equal(await verifySessionToken(`${token}tampered`, secret), null);
});

test("a token signed with a different secret is rejected", async () => {
  // Guards against a rotated or mismatched AUTH_SECRET silently granting sessions.
  const token = await signSessionToken(
    { userId: "9272f1f4-606d-4e7c-85dc-c9c1c44562ec", role: "staff" },
    secret,
  );
  const otherSecret = "another-secret-that-is-also-at-least-thirty-two-bytes";

  assert.equal(await verifySessionToken(token, otherSecret), null);
  assert.equal(await verifySessionToken(undefined, secret), null);
});

test("signing refuses a secret shorter than 32 bytes", async () => {
  // A short HS256 key is a deployment mistake, so it must fail loudly rather than sign.
  await assert.rejects(
    () => signSessionToken({ userId: "9272f1f4-606d-4e7c-85dc-c9c1c44562ec", role: "guest" }, "too-short"),
    /at least 32 bytes/,
  );
});
