const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Convention = sequelize.define("Convention", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  schoolId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' } },
  studentId: { type: DataTypes.UUID, allowNull: true, references: { model: User, key: 'id' } },
  companyId: { type: DataTypes.UUID, allowNull: true, references: { model: User, key: 'id' } },
  studentEmail: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } },
  companyEmail: { type: DataTypes.STRING, allowNull: true, validate: { isEmail: true } },
  studentFirstName: { type: DataTypes.STRING, allowNull: true },
  studentLastName: { type: DataTypes.STRING, allowNull: true },
  studentPhone: { type: DataTypes.STRING, allowNull: true },
  companyDirectorName: { type: DataTypes.STRING, allowNull: true },
  tutorName: { type: DataTypes.STRING, allowNull: true },
  tutorPhone: { type: DataTypes.STRING, allowNull: true },
  startDate: { type: DataTypes.DATEONLY, allowNull: true },
  endDate: { type: DataTypes.DATEONLY, allowNull: true },
  status: {
    type: DataTypes.ENUM("En attente Etudiant", "En attente Entreprise", "Prête à signer", "Signée", "Refusée"),
    allowNull: false,
    defaultValue: "En attente Etudiant"
  },
  studentCompletionToken: { type: DataTypes.STRING, allowNull: true, unique: true },
  companyCompletionToken: { type: DataTypes.STRING, allowNull: true, unique: true },
  studentSignature: { type: DataTypes.DATE, allowNull: true },
  companySignature: { type: DataTypes.DATE, allowNull: true },
  schoolSignature: { type: DataTypes.DATE, allowNull: true },
}, {
  timestamps: true,
});

module.exports = Convention;