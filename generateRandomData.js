'use strict';

module.exports = {
  generateRandomData
};

// Make sure to "npm install faker" first.
const Faker = require('faker');

function generateRandomData(userContext, events, done) {
  // generate data with Faker:
  const id = Faker.random.number(10000000);
  userContext.vars.id = id;
  // continue with executing the scenario:
  return done();
}