const express = require('express');
const bodyParser = require('body-parser');

const { sequelize } = require('./model');
const contractRoutes = require( './routes/contract.routes');

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.use('/contracts', contractRoutes);

module.exports = app;
