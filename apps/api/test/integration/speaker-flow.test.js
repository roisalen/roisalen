/**
 * @jest-environment node
 */
const request = require('supertest');
const app = require('../../server');
const { resetDatabase } = require('../helpers/mongo');

const org = { 'X-organisation': 'it-flow' };

// Statistics are written fire-and-forget after the response, so poll briefly.
async function eventually(check, timeoutMs = 3000) {
  const start = Date.now();
  for (;;) {
    try {
      return await check();
    } catch (err) {
      if (Date.now() - start > timeoutMs) throw err;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
}

beforeAll(resetDatabase);

test('main speaker and reply are queued, advanced, logged and summarised', async () => {
  await request(app).post('/representatives').set(org).send({ name: 'Kari', number: '1', sex: 'female', group: 'A' }).expect(201);
  await request(app).post('/representatives').set(org).send({ name: 'Ola', number: '2', sex: 'male', group: 'B' }).expect(201);

  const queued = await request(app).post('/speakerList').set(org).send({ speakerNumber: 1 });
  expect(queued.status).toBe(200);
  expect(queued.body).toHaveLength(1);
  expect(queued.body[0]).toMatchObject({ name: 'Kari', number: 1, speaking: true });

  const replied = await request(app).post('/speakerList/0/replies').set(org).send({ replicantNumber: 2 });
  expect(replied.status).toBe(200);
  expect(replied.body[0].replies).toHaveLength(1);

  const afterMain = await request(app).post('/speakerList/0').set(org);
  expect(afterMain.status).toBe(200);
  expect(afterMain.body[0].speaking).toBe(false);
  expect(afterMain.body[0].replies[0]).toMatchObject({ name: 'Ola', speaking: true });

  const afterReply = await request(app).post('/speakerList/0').set(org);
  expect(afterReply.status).toBe(200);
  expect(afterReply.body).toEqual([]);

  const stats = await eventually(async () => {
    const res = await request(app).get('/statistics/name').set(org);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    return res.body;
  });
  expect(stats).toEqual(expect.arrayContaining([
    expect.objectContaining({ _id: 'Kari', mainEntries: 1, replies: 0 }),
    expect.objectContaining({ _id: 'Ola', mainEntries: 0, replies: 1 }),
  ]));

  const usage = await request(app).get('/usage/summary').set('X-Admin-Secret', process.env.ROISALEN_ADMIN_SECRET);
  expect(usage.status).toBe(200);
  expect(usage.body.recentMeetingsLast30Days).toEqual(expect.arrayContaining([
    expect.objectContaining({ organisation: 'it-flow', eventCount: 2 }),
  ]));
});
