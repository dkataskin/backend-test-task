const express = require('express');
require('express-async-errors');

const bodyParser = require('body-parser');

const HttpApiError = require('./httpApiError');
const { sequelize } = require('./model');

const contractRouter = require('./routes/contract.routes');
const jobsRouter = require('./routes/jobs.routes');

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.use('/contracts', contractRouter);
app.use('/jobs', jobsRouter);

app.use((err, req, res, next) => {
  if (err instanceof HttpApiError) {
    res.status(err.status);
    res.json({ error: err.message });
  }

  next(err);
});

module.exports = app;
