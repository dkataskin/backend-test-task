const express = require('express');
const { depositMoneyToBalance } = require('../services/balances.service');

const balancesRouter = express.Router();

// since user id is passed as a parameter I assume getProfile isn't required here
balancesRouter.post('/deposit/:userId', async (req, res) => {
  const { userId } = req.params;
  const { amount } = req.body;

  //TODO: validate userId, amount, amount should be float/integer not string

  const client = await depositMoneyToBalance(userId, amount);

  res.json(client);
});

module.exports = balancesRouter;
