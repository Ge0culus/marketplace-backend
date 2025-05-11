const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './marketplace.sqlite'
});

module.exports = { sequelize };
