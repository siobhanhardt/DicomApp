const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("dicom_db", "root", "password", {
  host: "database", 
  dialect: "mysql",
  logging: false,
});

module.exports = sequelize;
