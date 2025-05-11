const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');
const { User } = require('./User');

const Listing = sequelize.define('Listing', {
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  price: DataTypes.FLOAT,
  imageUrl: DataTypes.STRING
});

Listing.belongsTo(User, { foreignKey: 'ownerId' });

module.exports = { Listing };
