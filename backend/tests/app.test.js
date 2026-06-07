const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");

process.env.NODE_ENV = "test";
process.env.BOT_ENABLED = "false";
process.env.CRON_ENABLED = "false";
process.env.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "test-secret";

const app = require("../app");
const db = require("../models");

let baseUrl;
let server;

before(async () => {
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));

  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  await db.sequelize.close();
});

test("GET / returns the backend health response", async () => {
  const response = await fetch(`${baseUrl}/`);

  assert.equal(response.status, 200);
  assert.equal(await response.text(), "NIT Hostel Backend is Live 🚀");
  assert.equal(response.headers.get("x-powered-by"), null);
});

test("protected student endpoint rejects requests without a token", async () => {
  const response = await fetch(`${baseUrl}/student/getProfile`);
  const body = await response.json();

  assert.equal(response.status, 401);
  assert.equal(body.success, false);
  assert.equal(body.message, "Authentication token missing");
});
