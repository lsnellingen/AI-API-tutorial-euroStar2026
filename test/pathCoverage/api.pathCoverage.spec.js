const { expect } = require('chai');
const request = require('supertest');
const { spawn } = require('child_process');
const path = require('path');

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const API_PREFIX = '/api';

let serverProcess;
let startedByTests = false;
let authToken;

async function isApiHealthy() {
  try {
    const response = await request(BASE_URL).get(`${API_PREFIX}/healthcheck`);
    return response.status === 200;
  } catch {
    return false;
  }
}

async function waitForApiReady(maxAttempts = 30, delayMs = 250) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    if (await isApiHealthy()) {
      return true;
    }

    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  return false;
}

describe('REST API path coverage', function () {
  this.timeout(20000);

  before(async function () {
    const alreadyRunning = await waitForApiReady(3, 150);
    if (alreadyRunning) {
      return;
    }

    const projectRoot = path.resolve(__dirname, '../../');
    serverProcess = spawn('node', ['src/app.js'], {
      cwd: projectRoot,
      stdio: 'pipe',
    });
    startedByTests = true;

    const ready = await waitForApiReady();
    if (!ready) {
      throw new Error('API server did not become ready on http://localhost:3000');
    }
  });

  after(function () {
    if (startedByTests && serverProcess) {
      serverProcess.kill();
    }
  });

  it('GET /api/healthcheck should return API status', async function () {
    const response = await request(BASE_URL).get(`${API_PREFIX}/healthcheck`);

    expect(response.status).to.equal(200);
    expect(response.body).to.include({ status: 'ok' });
    expect(response.body).to.have.property('timestamp');
  });

  it('POST /api/register should register a user and return a token', async function () {
    const uniqueId = Date.now();
    const payload = {
      username: `dave_${uniqueId}`,
      email: `dave_${uniqueId}@example.com`,
      password: 'password123',
    };

    const response = await request(BASE_URL)
      .post(`${API_PREFIX}/register`)
      .send(payload);

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('token').that.is.a('string').and.is.not.empty;
    expect(response.body).to.have.property('user');
    expect(response.body.user).to.include({ username: payload.username, email: payload.email });
  });

  it('POST /api/login should authenticate a known user', async function () {
    const response = await request(BASE_URL)
      .post(`${API_PREFIX}/login`)
      .send({
        username: 'alice',
        password: 'password123',
      });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('token').that.is.a('string').and.is.not.empty;
    expect(response.body).to.have.property('user');
    expect(response.body.user).to.include({
      username: 'alice',
      email: 'alice@example.com',
    });

    authToken = response.body.token;
  });

  it('POST /api/checkout should place an order for an authenticated user', async function () {
    const response = await request(BASE_URL)
      .post(`${API_PREFIX}/checkout`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        items: [
          { productId: 1, quantity: 1 },
          { productId: 3, quantity: 2 },
        ],
        paymentMethod: 'cash',
      });

    expect(response.status).to.equal(201);
    expect(response.body).to.include({ paymentMethod: 'cash', discountRate: 0.1 });
    expect(response.body).to.have.property('orderId');
    expect(response.body).to.have.property('items').that.is.an('array').and.has.lengthOf(2);
    expect(response.body).to.have.property('total').that.is.a('number');
  });
});
