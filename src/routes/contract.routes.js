const express = require('express');
const HttpApiError = require('../httpApiError');
const { getProfile } = require('../middleware/getProfile');
const { getContractById, getAll } = require('../services/contract.service');

const contractRouter = express.Router();

contractRouter.get('/', getProfile, async (req, res) => {
  const { offset, limit } = req.query;
  // TODO: validation of input parameters, profile id, offset, limit
  const contracts = await getAll(req.profile.id, offset, limit);

  res.json(contracts ?? []);
});

contractRouter.get('/:id', getProfile, async (req, res) => {
  const { id } = req.params;

  // TODO: validation of input parameters, contract id, profile id
  const contract = await getContractById(id, req.profile.id);
  if (!contract) {
    throw new HttpApiError(404, `Contract with id ${id} not found`);
  }

  res.json(contract);
});

module.exports = contractRouter;
