const express = require('express');
const HttpApiError = require('../httpApiError');
const { getProfile } = require('../middleware/getProfile');
const { getUnpaid } = require('../services/jobs.service');

const jobsRouter = express.Router();

jobsRouter.post('/:jobId/pay', getProfile, async (req, res) => {
});

jobsRouter.get('/unpaid', getProfile, async (req, res) => {
  const { offset, limit } = req.query;

  const unpaidJobs = await getUnpaid(req.profile.id, offset, limit);
  res.json(unpaidJobs);
});

module.exports = jobsRouter;