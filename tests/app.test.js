const request = require('supertest');
const { app, resetStore } = require('../src/app');

const sample = {
  name: 'Hasini Reddy',
  email: 'hasini@example.com',
  course: 'Computer Science',
  year: 2
};

beforeEach(() => resetStore());

describe('Campus Records Hub API', () => {
  test('1. GET /health returns UP', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('UP');
  });

  test('2. POST /api/students creates a student with a year', async () => {
    const res = await request(app).post('/api/students').send(sample);
    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({ id: 1, name: 'Hasini Reddy', year: 2 });

    const list = await request(app).get('/api/students');
    expect(list.body).toHaveLength(1);
  });

  test('3. POST /api/students rejects missing fields', async () => {
    const res = await request(app).post('/api/students').send({ name: 'No Email' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/required/);
  });

  test('4. POST /api/students rejects an invalid year', async () => {
    const res = await request(app).post('/api/students').send({ ...sample, year: 9 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/year/);
  });

  test('5. PUT /api/students/:id updates the year', async () => {
    const created = await request(app).post('/api/students').send(sample);
    const res = await request(app)
      .put(`/api/students/${created.body.id}`)
      .send({ ...sample, year: 3 });
    expect(res.statusCode).toBe(200);
    expect(res.body.year).toBe(3);
  });

  test('6. DELETE /api/students/:id removes the student', async () => {
    const created = await request(app).post('/api/students').send(sample);
    const del = await request(app).delete(`/api/students/${created.body.id}`);
    expect(del.statusCode).toBe(204);

    const after = await request(app).get(`/api/students/${created.body.id}`);
    expect(after.statusCode).toBe(404);
  });
});
