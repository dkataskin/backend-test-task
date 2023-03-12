const express = require('express');
const {
  getBestProfession,
  getBestClients,
} = require('../services/jobs.service');

const adminRouter = express.Router();

adminRouter.get('/best-profession', async (req, res) => {
  const { start, end } = req.query;

  const bestProfession = await getBestProfession(start, end);

  res.json(bestProfession);
});

adminRouter.get('/best-clients', async (req, res) => {
  const { start, end, limit } = req.query;

  //TODO: validate start date, end date, limit
  const bestClients = await getBestClients(start, end, limit);

  res.json(bestClients);
});

module.exports = adminRouter;
