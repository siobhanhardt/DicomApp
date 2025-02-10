const { DataTypes } = require("sequelize");
const sequelize = require("./db");

// This file determines the structure and relationships of the database

const Patient = sequelize.define("Patient", {
  idPatient: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Name: { type: DataTypes.STRING, allowNull: true },
  CreatedDate: { type: DataTypes.DATE, allowNull: true}
},
{
    tableName: "patient"
});

const Modality = sequelize.define("Modality", {
  idModality: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Name: { type: DataTypes.STRING, allowNull: true, unique: true },
},
{
    tableName: "modality"
});

const Study = sequelize.define("Study", {
  idStudy: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  idPatient: {type: DataTypes.INTEGER, allowNull: false}, 
  StudyName: { type: DataTypes.STRING, allowNull: true },
  CreatedDate: { type: DataTypes.DATE, allowNull: true },
},
{
    tableName: "studies"
});

const Series = sequelize.define("Series", {
  idSeries: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  idPatient: { type: DataTypes.INTEGER, allowNull: false },
  idStudy: { type: DataTypes.INTEGER, allowNull: false },
  idModality: { type: DataTypes.INTEGER, allowNull: false },
  SeriesName: { type: DataTypes.STRING, allowNull: true },
  CreatedDate: { type: DataTypes.DATE, allowNull: true },
},
{
    tableName: "series"
});

const File = sequelize.define("File", {
  idFile: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  idPatient: { type: DataTypes.INTEGER, allowNull: false },
  idStudy: { type: DataTypes.INTEGER, allowNull: false },
  idSeries: { type: DataTypes.INTEGER, allowNull: false },
  FilePath: { type: DataTypes.STRING, allowNull: false },
  ImagePath: { type: DataTypes.STRING, allowNull: true },
  CreatedDate: { type: DataTypes.DATE, allowNull: true },
  InstanceNumber: { type: DataTypes.INTEGER, allowNull: true }
},
{
    tableName: "files"
});


Patient.hasMany(Study, {foreignKey: "idPatient"});
Patient.hasMany(Series, {foreignKey: "idPatient"});
Patient.hasMany(File, {foreignKey: "idPatient"});
Study.hasMany(Series, {foreignKey: "idStudy"});
Study.hasMany(File, {foreignKey: "idStudy"});
Series.hasMany(File, {foreignKey: "idSeries"});
Modality.hasMany(Series, {foreignKey: "idModality"})

Study.belongsTo(Patient, {foreignKey: "idPatient"});

Series.belongsTo(Patient, { foreignKey: "idPatient", as: 'patient' });
Series.belongsTo(Study, { foreignKey: "idStudy", as: "study" });
Series.belongsTo(Modality, { foreignKey: "idModality", as: "modality" });

File.belongsTo(Patient, { foreignKey: "idPatient" });
File.belongsTo(Study, { foreignKey: "idStudy" });
File.belongsTo(Series, { foreignKey: "idSeries", as: 'series' });

// Sync database
sequelize.sync({ alter: true });


module.exports = { Patient, Study, Series, File, Modality };
