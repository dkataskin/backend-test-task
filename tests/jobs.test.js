const app = require('../src/app');
const request = require('supertest');
const { cleanUpDb } = require('./helpers');

const { Contract, Profile, Job } = require('../src/model');

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
      profession: 'profession-1',
      balance: 200,
      type: 'contractor',
    }
  );

  await Profile.create(
    {
      id: 4,
      firstName: 'first name',
      lastName: 'last name',
      profession: 'profession-3',
      balance: 300,
      type: 'client',
    }
  );

  await Contract.create({
    id: 1,
    terms: 'contract 1',
    status: 'in_progress',
    ClientId: 1,
    ContractorId: 2,
  });

  await Contract.create({
    id: 2,
    terms: 'contract 2',
    status: 'new',
    ClientId: 1,
    ContractorId: 3,
  });

  await Job.create({
    id: 1,
    description: 'job 1',
    price: 200,
    paid: false,
    paymentDate: null,
    ContractId: 1
  });

  await Job.create({
    id: 2,
    description: 'job 2',
    price: 300,
    paid: true,
    paymentDate: '2020-08-15T19:11:26.737Z',
    ContractId: 1
  });

  await Job.create({
    id: 3,
    description: 'job 3',
    price: 400,
    paid: null,
    paymentDate: null,
    ContractId: 2
  });
}

describe('Jobs api tests', () => {
  beforeEach(async () => {
    await cleanUpDb();
  });

  test('client can get unpaid jobs', async () => {
    await prepareDataSet1();

    const response = await request(app).get(`/jobs/unpaid`).set('profile_id', 1);
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);

    // TODO: more checks for properties of objects returned in the array
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 1
        })
      ])
    );
  });
});
