const { Op } = require('sequelize');
const HttpApiError = require('../httpApiError');
const { Job, Contract, Profile, sequelize } = require('../model');

async function depositMoneyToBalance(userId, amount) {
  return await sequelize.transaction(async (t) => {
    const client = await Profile.findByPk(userId, { transaction: t });
    if (!client) {
      throw new HttpApiError(404, `client not found`);
    }

    if (client.type != 'client') {
      throw new HttpApiError(400, `profile type is not client`);
    }

    const unpaidAmount = await Job.sum(`price`, {
      include: [
        {
          model: Contract,
          required: true,
          attributes: [],
          where: {
            ClientId: client.id,
          },
        },
      ],
      where: {
        [Op.or]: [{ paid: null }, { paid: false }],
      },
    });

    if (amount > unpaidAmount * 0.25) {
      throw new HttpApiError(
        400,
        `Unpaid amount is greater than 25% of amount being deposited`
      );
    }

    client.balance += amount;
    await client.save({ transaction: t });

    return client;
  });
}

module.exports = { depositMoneyToBalance };
