const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');
const { User } = require('./User');

const Listing = sequelize.define('Listing', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: DataTypes.TEXT,
  price: DataTypes.FLOAT,
  imageUrl: DataTypes.STRING,
  location: DataTypes.STRING // ✅ new field for additional info
});

Listing.belongsTo(User, { foreignKey: 'ownerId' });

module.exports = { Listing };
