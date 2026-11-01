/**
 * @jest-environment node
 */
const request = require('supertest');
const app = require('../../server');
const { resetDatabase } = require('../helpers/mongo');

const org = { 'X-organisation': 'it-reps' };
const otherOrg = { 'X-organisation': 'it-reps-other' };

beforeAll(resetDatabase);

describe('representatives', () => {
  test('add, list sorted by number, get, delete one, delete all', async () => {
    await request(app).post('/representatives').set(org).send({ name: 'B', number: '20', sex: 'male', group: 'G' }).expect(201);
    const created = await request(app).post('/representatives').set(org).send({ name: 'A', number: 3, sex: 'female', group: 'G' });
    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({ _id: 3, number: 3, name: 'A', sex: 'female', group: 'G', replies: [], speaking: false });

    await request(app).post('/representatives').set(org).send({ name: 'X', number: 'abc' }).expect(400);

    const list = await request(app).get('/representatives').set(org);
    expect(list.status).toBe(200);
    expect(list.body.map((r) => r.number)).toEqual([3, 20]);

    const one = await request(app).get('/representatives/20').set(org);
    expect(one.status).toBe(200);
    expect(one.body.name).toBe('B');

    // Existing behaviour: unknown number answers 500, not 404
    await request(app).get('/representatives/99').set(org).expect(500);

    await request(app).delete('/representatives/20').set(org).expect(200);
    expect((await request(app).get('/representatives').set(org)).body.map((r) => r.number)).toEqual([3]);

    await request(app).delete('/representativesDeleteAll/IMSURE').set(org).expect(200);
    expect((await request(app).get('/representatives').set(org)).body).toEqual([]);
  });

  test('representatives are stored per organisation', async () => {
    await request(app).post('/representatives').set(org).send({ name: 'Only A', number: 1 }).expect(201);
    expect((await request(app).get('/representatives').set(otherOrg)).body).toEqual([]);
  });
});
