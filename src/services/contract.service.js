const { Op } = require("sequelize");
const { Contract } = require("../model");

const getContractById = async (contractId, profileId) => {
  return await Contract.findOne({
    where: {
      id: contractId,
      [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
    },
  });
};

module.exports = { getContractById };
