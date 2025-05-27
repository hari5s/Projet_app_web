const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Convention = sequelize.define("Convention", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  studentId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  schoolId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  companyId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("En attente", "Signée", "Refusée", "À signer"),
    allowNull: false,
  },
}, {
  timestamps: true, // Crée automatiquement createdAt et updatedAt
});

module.exports = Convention;
