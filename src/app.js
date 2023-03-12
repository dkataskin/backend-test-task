const express = require("express");
const bodyParser = require("body-parser");

const { sequelize } = require("./model");
const { getProfile } = require("./middleware/getProfile");
const { getContractById, getAll } = require("./services/contract.service");

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

app.get("/contracts", getProfile, async (req, res) => {
  console.log(`req.profile ${JSON.stringify(req.profile)}`);

  const { offset, limit } = req.query;
  const contracts = await getAll(req.profile.id, offset, limit);

  res.json(contracts);
});

module.exports = app;
