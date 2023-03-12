const express = require('express');

const { getProfile } = require('../middleware/getProfile');
const { getContractById, getAll } = require("../services/contract.service");

const contractRouter = express.Router();

contractRouter.get('/', getProfile, async (req, res) => {
  const { offset, limit } = req.query;
  const contracts = await getAll(req.profile.id, offset, limit);

  res.json(contracts);
});

contractRouter.get('/:id', getProfile, async (req, res) => {
  const { id } = req.params;

  // TODO: validation of input parameters, contract id, profile id
  const contract = await getContractById(id, req.profile.id);
  if (!contract) return res.status(404).end();
  res.json(contract);
});

module.exports = contractRouter;