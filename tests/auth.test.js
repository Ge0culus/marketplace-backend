const request = require('supertest');
const { app, sequelize } = require('../src/app');

beforeAll(async () => {
  await sequelize.sync({ force: true }); // clean DB
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser_' + Date.now(),
        password: 'testpass'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User created');
  });
});
