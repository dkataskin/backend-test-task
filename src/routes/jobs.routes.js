const express = require('express');
const { getProfile } = require('../middleware/getProfile');
const { getUnpaid, payForJob } = require('../services/jobs.service');

const jobsRouter = express.Router();

jobsRouter.post('/:jobId/pay', getProfile, async (req, res) => {
  const { jobId } = req.params;

  //TODO: validate jobId, profile id
  const paidJob = await payForJob(jobId, req.profile.id);

  res.json(paidJob);
});

jobsRouter.get('/unpaid', getProfile, async (req, res) => {
  const { offset, limit } = req.query;

  //TODO: validate profile id, offset, limit
  const unpaidJobs = await getUnpaid(req.profile.id, offset, limit);
  res.json(unpaidJobs);
});

module.exports = jobsRouter;
