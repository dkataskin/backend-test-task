const express = require('express');
require('express-async-errors');

const bodyParser = require('body-parser');

const HttpApiError = require('./httpApiError');
const { sequelize } = require('./model');
const contractRoutes = require('./routes/contract.routes');

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.use('/contracts', contractRoutes);


app.use((err, req, res, next) => {
  if (err instanceof HttpApiError) {
    res.status(err.status);
    res.json({ error: err.message });
  }

  next(err);
});

module.exports = app;
