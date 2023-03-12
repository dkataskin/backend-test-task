const express = require("express");
const bodyParser = require("body-parser");

const { sequelize } = require("./model");
const { getProfile } = require("./middleware/getProfile");
const { getContractById } = require("./services/contract.service");

const app = express();
app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

/**
 * @returns contract by id
 */
app.get("/contracts/:id", getProfile, async (req, res) => {
  const { id } = req.params;

  // TODO: validation of input parameters, contract id, profile id
  const contract = await getContractById(id, req.profile.id);
  if (!contract) return res.status(404).end();
  res.json(contract);
});

module.exports = app;
