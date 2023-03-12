const app = require('../src/app');
const request = require('supertest');
const { cleanUpDb } = require('./helpers');

const { Contract, Profile, Job } = require('../src/model');

async function prepareDataSet1() {
  await Profile.create({
    id: 1,
    firstName: 'first name',
    lastName: 'last name',
    profession: 'profession-1',
    balance: 100,
    type: 'client',
  });

  await Profile.create({
    id: 2,
    firstName: 'first name',
    lastName: 'last name',
    profession: 'profession-2',
    balance: 200,
    type: 'contractor',
  });

  await Profile.create({
    id: 3,
    firstName: 'first name',
    lastName: 'last name',
    profession: 'profession-1',
    balance: 200,
    type: 'contractor',
  });

  await Profile.create({
    id: 4,
    firstName: 'first name',
    lastName: 'last name',
    profession: 'profession-3',
    balance: 3000,
    type: 'client',
  });

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

  await Contract.create({
    id: 3,
    terms: 'contract 2',
    status: 'in_progress',
    ClientId: 4,
    ContractorId: 3,
  });

  await Job.create({
    id: 1,
    description: 'job 1',
    price: 200,
    paid: false,
    paymentDate: null,
    ContractId: 1,
  });

  await Job.create({
    id: 2,
    description: 'job 2',
    price: 300,
    paid: true,
    paymentDate: '2020-08-15T19:11:26.737Z',
    ContractId: 1,
  });

  await Job.create({
    id: 3,
    description: 'job 3',
    price: 400,
    paid: null,
    paymentDate: null,
    ContractId: 2,
  });

  await Job.create({
    id: 4,
    description: 'job 4',
    price: 400,
    paid: null,
    paymentDate: null,
    ContractId: 3,
  });

  await Job.create({
    id: 5,
    description: 'job 4',
    price: 400,
    paid: true,
    paymentDate: '2020-08-15T19:11:26.737Z',
    ContractId: 3,
  });
}

describe('Jobs api tests', () => {
  beforeEach(async () => {
    await cleanUpDb();
  });

  test('client can get unpaid jobs', async () => {
    await prepareDataSet1();

    const response = await request(app)
      .get(`/jobs/unpaid`)
      .set('profile_id', 1);
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);

    // TODO: more checks for properties of objects returned in the array
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 1,
        }),
      ])
    );
  });

  test("client can't pay for a job if balances is insufficient", async () => {
    await prepareDataSet1();

    const response = await request(app)
      .post(`/jobs/1/pay`)
      .set('profile_id', 1);
    expect(response.status).toBe(400);
    // TODO: error msg check
  });

  test("client can't pay for a job that doesn't belong to his contracts", async () => {
    await prepareDataSet1();

    const response = await request(app)
      .post(`/jobs/1/pay`)
      .set('profile_id', 4);
    expect(response.status).toBe(404);
  });

  test("contractor can't pay for a job", async () => {
    await prepareDataSet1();

    const response = await request(app)
      .post(`/jobs/1/pay`)
      .set('profile_id', 2);
    expect(response.status).toBe(404);
  });

  test("client can't pay for already paid job", async () => {
    await prepareDataSet1();

    const response = await request(app)
      .post(`/jobs/5/pay`)
      .set('profile_id', 4);
    expect(response.status).toBe(400);
  });

  test('client can pay for a job', async () => {
    await prepareDataSet1();

    const clientId = 4;
    const contractorId = 3;
    const jobId = 4;

    const clientProfileBefore = await Profile.findByPk(clientId);
    const contractorProfileBefore = await Profile.findByPk(contractorId);
    const job = await Job.findByPk(jobId);

    const response = await request(app)
      .post(`/jobs/4/pay`)
      .set('profile_id', 4);

    expect(response.status).toBe(200);

    const clientProfileAfter = await Profile.findByPk(clientId);
    const contractorProfileAfter = await Profile.findByPk(contractorId);

    // mb use toBeCloseTo because of floats
    expect(clientProfileAfter.balance).toBe(
      clientProfileBefore.balance - job.price
    );
    expect(contractorProfileAfter.balance).toBe(
      contractorProfileBefore.balance + job.price
    );
  });
});
