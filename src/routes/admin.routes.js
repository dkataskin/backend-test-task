const express = require('express');
const { getBestProfession } = require('../services/jobs.service');

const adminRouter = express.Router();

adminRouter.get('/best-profession', async (req, res) => {
  const { start, end } = req.query;

  const bestProfession = await getBestProfession(start, end);

  res.json(bestProfession);
});

adminRouter.get('/best-clients', async (req, res) => {
  // const { userId } = req.params;
  // const { amount } = req.body;

  // //TODO: validate userId, amount, amount should be float/integer not string

  // const client = await depositMoneyToBalance(userId, amount);

  // res.json(client);
});

module.exports = adminRouter;
