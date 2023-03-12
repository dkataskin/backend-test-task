const { Op } = require('sequelize');
const HttpApiError = require('../httpApiError');
const { Job, Contract, Profile } = require('../model');

async function getUnpaid(profileId, offset, limit) {
  return await Job.findAll({
    include: {
      model: Contract,
      attributes: [],
      required: true,
      where: {
        status: 'in_progress',
        [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
      },
    },
    offset,
    limit,
    where: {
      [Op.or]: [{ paid: null }, { paid: false }],
    },
    order: [['id', 'ASC']],
  });
}

async function payForJob(jobId, profileId) {
  return await sequelize.transaction(async (t) => {
    const job = await Job.findOne(
      {
        include: {
          model: Contract,
          required: true,
          attributes: ['ContractorId'],
          where: {
            ClientId: profileId
          }
        },
        where: { id: jobId }
      },
      { transaction: t });

    if (!job) {
      throw new HttpApiError(404, `Job with id ${jobId} not found`);
    }

    if (job.paid) {
      throw new HttpApiError(400, `Job with id ${jobId} already paid`);
    }

    const client = await Profile.findByPk(profileId, { transaction: t });
    if (client.type != 'client') {
      throw new HttpApiError(400, `Contractor can't pay for job with id ${jobId}`);
    }

    const contractor = await Profile.findByPk(job.Contract.ContractorId, { transaction: t });

    if (client.balance < job.price) {
      throw new HttpApiError(400, `Insufficient balance to pay for job with id ${jobId}`);
    }

    client.balance -= job.price;
    contractor.balance += job.price;
    job.paid = true;
    job.paymentDate = new Date().toISOString();

    await job.save({ transaction: t });
    await client.save({ transaction: t });
    await contractor.save({ transaction: t });

    return job;
  });
}

module.exports = { getUnpaid, payForJob };
