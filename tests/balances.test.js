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

  await Contract.create({
    id: 1,
    terms: 'contract 1',
    status: 'in_progress',
    ClientId: 1,
    ContractorId: 2,
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
    paid: false,
    paymentDate: null,
    ContractId: 1,
  });

  await Job.create({
    id: 3,
    description: 'job 3',
    price: 400,
    paid: true,
    paymentDate: null,
    ContractId: 1,
  });

  await Job.create({
    id: 4,
    description: 'job 4',
    price: 400,
    paid: true,
    paymentDate: '2020-08-15T19:11:26.737Z',
    ContractId: 1,
  });
}

describe('Balances api tests', () => {
  beforeEach(async () => {
    await cleanUpDb();
  });

  test("can't deposit to a contractor's balance", async () => {
    await prepareDataSet1();

    const response = await request(app)
      .post(`/balances/deposit/2`)
      .send({ amount: 432 });
    expect(response.status).toBe(400);
  });

  test("can't deposit if amount is greater than 25% of total price of unpaid jobs", async () => {
    await prepareDataSet1();

    // total unpaid 500, threshold is 125
    const response = await request(app)
      .post(`/balances/deposit/1`)
      .send({ amount: 126 });
    expect(response.status).toBe(400);
  });

  test("client's balance increases after deposit", async () => {
    await prepareDataSet1();

    // total unpaid 500, threshold is 125
    const clientId = 1;
    const amount = 125;

    const clientProfileBefore = await Profile.findByPk(clientId);

    const response = await request(app)
      .post(`/balances/deposit/${clientId}`)
      .send({ amount });
    expect(response.status).toBe(200);

    const clientProfileAfter = await Profile.findByPk(clientId);
    expect(clientProfileAfter.balance).toBe(
      clientProfileBefore.balance + amount
    );
  });
});
