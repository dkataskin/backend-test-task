const app = require('../src/app');
const request = require('supertest');

const { Contract, Profile, Job } = require('../src/model');

describe('Contracts api tests', () => {
  test('root req returns 404', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(404);
  });
});
