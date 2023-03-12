const { Op } = require('sequelize');
const HttpApiError = require('../httpApiError');
const { Job, Contract, Profile, sequelize } = require('../model');

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
            ClientId: profileId,
          },
        },
        where: { id: jobId },
      },
      { transaction: t }
    );

    if (!job) {
      throw new HttpApiError(404, `Job with id ${jobId} not found`);
    }

    if (job.paid) {
      throw new HttpApiError(400, `Job with id ${jobId} already paid`);
    }

    const client = await Profile.findByPk(profileId, { transaction: t });
    const contractor = await Profile.findByPk(job.Contract.ContractorId, {
      transaction: t,
    });

    if (client.balance < job.price) {
      throw new HttpApiError(
        400,
        `Insufficient balance to pay for job with id ${jobId}`
      );
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

async function getBestProfession(startDate, endDate) {
  const result = await Job.findAll({
    attributes: [[sequelize.fn('sum', sequelize.col('price')), 'total']],
    group: ['Contract.Contractor.profession'],
    include: [
      {
        model: Contract,
        attributes: ['id'],
        required: true,
        include: [
          {
            model: Profile,
            as: 'Contractor',
            where: { type: 'contractor' },
            attributes: ['profession'],
          },
        ],
      },
    ],
    where: {
      paid: true,
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [[sequelize.fn('sum', sequelize.col('price')), 'DESC']],
    limit: 1,
  });

  if (result.length) {
    return result[0].Contract.Contractor.profession;
  }

  return null;
}

async function getBestClients(startDate, endDate, limit = 2) {
  const results = await Job.findAll({
    attributes: [[sequelize.fn('sum', sequelize.col('price')), 'totalPaid']],
    include: [
      {
        model: Contract,
        attributes: ['id'],
        include: [
          {
            model: Profile,
            as: 'Client',
            attributes: ['id', 'firstName', 'lastName'],
            where: {
              type: 'client',
            },
          },
        ],
      },
    ],
    where: {
      paid: true,
      paymentDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    group: ['Contract.Client.id'],
    order: [[sequelize.fn('sum', sequelize.col('price')), 'DESC']],
    limit,
  });

  return results.map(mapToClientInfo);
}

function mapToClientInfo(group) {
  return {
    id: group.Contract.Client.id,
    fullName: `${group.Contract.Client.firstName} ${group.Contract.Client.lastName}`,
    paid: group.dataValues.totalPaid,
  };
}

module.exports = { getUnpaid, payForJob, getBestProfession, getBestClients };
