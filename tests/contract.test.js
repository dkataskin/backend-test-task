const app = require('../src/app');
const request = require('supertest');

const { Contract, Profile, Job } = require('../src/model');

async function cleanUpDb() {
  await Contract.sync({ force: true });
  await Profile.sync({ force: true });
  await Job.sync({ force: true });
}

async function prepareDataSet1() {
  await Profile.create(
    {
      id: 1,
      firstName: 'first name',
      lastName: 'last name',
      profession: 'profession-1',
      balance: 100,
      type: 'client',
    }
  );

  await Profile.create(
    {
      id: 2,
      firstName: 'first name',
      lastName: 'last name',
      profession: 'profession-2',
      balance: 200,
      type: 'contractor',
    }
  );

  await Profile.create(
    {
      id: 3,
      firstName: 'first name',
      lastName: 'last name',
      profession: 'profession-3',
      balance: 300,
      type: 'client',
    }
  );

  await Contract.create({
    id: 1,
    terms: 'job 1',
    status: 'in-progress',
    ClientId: 1,
    ContractorId: 2,
  });
}

describe('Contracts api tests', () => {
  beforeEach(async () => {
    await cleanUpDb();
  });

  test('root req returns 404', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(404);
  });

  test('can\'t get contract by id with a wrong profile id', async () => {
    await prepareDataSet1();

    const response = await request(app).get(`/contracts/1`).set('profile_id', 999);
    expect(response.status).toBe(401);
  });

  test('can\'t get contract by id if not contractor or client', async () => {
    await prepareDataSet1();

    const response = await request(app).get(`/contracts/1`).set('profile_id', 3);
    expect(response.status).toBe(404);
  });

  test('can get contract by id as client', async () => {
    await prepareDataSet1();

    const response = await request(app).get(`/contracts/1`).set('profile_id', 1);
    expect(response.status).toBe(200);
  });

  test('can get contract by id as contractor', async () => {
    await prepareDataSet1();

    const response = await request(app).get(`/contracts/1`).set('profile_id', 2);
    expect(response.status).toBe(200);
  });
});
