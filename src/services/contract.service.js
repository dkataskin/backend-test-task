const { Op } = require("sequelize");
const { Contract } = require("../model");

async function getContractById(contractId, profileId) {
  return await Contract.findOne({
    where: {
      id: contractId,
      [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
    },
  });
}

async function getAll(profileId, offset, limit) {
  return await Contract.findAll({
    offset,
    limit,
    where: {
      status: { [Op.ne]: "terminated" },
      [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
    },
    order: [["id", "ASC"]],
  });
}

module.exports = { getContractById, getAll };
