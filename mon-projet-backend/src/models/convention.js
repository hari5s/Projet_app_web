const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Convention = sequelize.define("Convention", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: User, key: 'id' }
  },
  schoolId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: User, key: 'id' }
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: User, key: 'id' }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("En attente", "À signer", "Signée", "Refusée"),
    allowNull: false,
    defaultValue: "En attente"
  },
  studentSignature: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  schoolSignature: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  companySignature: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  completionToken: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  companyTutorName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  companyAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = Convention;