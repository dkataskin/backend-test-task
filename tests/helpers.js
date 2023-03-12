const { Contract, Profile, Job } = require('../src/model');

async function cleanUpDb() {
  await Contract.sync({ force: true });
  await Profile.sync({ force: true });
  await Job.sync({ force: true });
}

module.exports = { cleanUpDb };