/**
 * @jest-environment node
 */
const request = require('supertest');
const app = require('../../server');
const { resetDatabase } = require('../helpers/mongo');

beforeAll(resetDatabase);

describe('organisations', () => {
  test('POST rejects short shortName and empty name', async () => {
    await request(app).post('/organisations').send({ name: 'X', shortName: 'ab' }).expect(400);
    await request(app).post('/organisations').send({ name: '', shortName: 'abcd' }).expect(400);
  });

  test('POST stores with _id = shortName and a 16-char hex slug', async () => {
    const res = await request(app).post('/organisations').send({ name: 'Bergen lag', shortName: 'bergen' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ _id: 'bergen', shortName: 'bergen', name: 'Bergen lag' });
    expect(res.body.slug).toMatch(/^[0-9a-f]{16}$/);
  });

  test('POST with an existing shortName overwrites it', async () => {
    await request(app).post('/organisations').send({ name: 'Bergen lag 2', shortName: 'bergen', slug: 'fixed' }).expect(201);
    const res = await request(app).get('/organisations?includeHidden=true');
    expect(res.body.filter((o) => o._id === 'bergen')).toEqual([
      expect.objectContaining({ name: 'Bergen lag 2', slug: 'fixed' }),
    ]);
  });

  test('GET lists only hidden === false; includeHidden=true lists all; sorted by name', async () => {
    await request(app).post('/organisations').send({ name: 'Bodo lag', shortName: 'bodo', hidden: false }).expect(201);
    await request(app).post('/organisations').send({ name: 'Alta lag', shortName: 'alta', hidden: false }).expect(201);

    const visible = await request(app).get('/organisations');
    expect(visible.status).toBe(200);
    expect(visible.body.map((o) => o._id)).toEqual(['alta', 'bodo']);

    const all = await request(app).get('/organisations?includeHidden=true');
    expect(all.body.map((o) => o._id)).toEqual(['alta', 'bergen', 'bodo']);
  });

  test('DELETE /organisations/IMSURE/:id removes it', async () => {
    await request(app).delete('/organisations/IMSURE/bodo').expect(200);
    const all = await request(app).get('/organisations?includeHidden=true');
    expect(all.body.map((o) => o._id)).toEqual(['alta', 'bergen']);
  });
});
