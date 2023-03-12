const { Op } = require('sequelize');
const { Job, Contract } = require('../model');

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

module.exports = { getUnpaid };
