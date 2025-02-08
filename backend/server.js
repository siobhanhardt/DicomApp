const express = require("express");
const path = require("path");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const cors = require("cors");
const { Patient, Study, Series, File, Modality } = require("./models");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const schema = buildSchema(`
    type Patient {
        idPatient: ID!
        Name: String
        CreatedDate: String
    }

    type Study {
        idStudy: ID!
        idPatient: Int!
        StudyName: String
        CreatedDate: String
    }

    type Series {
        idSeries: ID!
        idPatient: Int!
        idStudy: Int!
        idModality: Int!
        SeriesName: String
        CreatedDate: String
        patient: Patient
    }

    type File {
        idFile: ID!
        idPatient: Int!
        idStudy: Int!
        idSeries: Int!
        FilePath: String
        ImagePath: String
        CreatedDate: String
        series: Series
    }

    type Query {
        patients: [Patient]
        studies: [Study]
        series: [Series]
        files: [File]
    }
`);

const root = {
  patients: async () => await Patient.findAll(),
  studies: async () => await Study.findAll(),
  series: async () => await Series.findAll(),
  files: async () => {
    try {
      const filesWithDetails = await File.findAll({
        include: [
          {
            model: Series,
            as: "series",
            attributes: ["SeriesName", "idSeries"], 
            include: [
              {
                model: Patient, 
                as: "patient", 
                attributes: ["idPatient", "Name", "CreatedDate"], 
              },
            ],
          },
        ],
      });

      return filesWithDetails;
    } catch (error) {
      console.error("Error fetching files with series and patient:", error);
      return [];
    }
  },
  modality: async () => await Modality.findAll(),
};

app.use("/graphql", graphqlHTTP({ schema, rootValue: root, graphiql: true }));

app.post("/api/upload-dicom", async (req, res) => { 
  try {
    const dicomMetadata = req.body;
    // const response = await axios.post(
    //   "http://python-service:5000/process-dicom",
    //   {
    //     filePath: filePath,
    //   }
    // );

    //const dicomMetadata = JSON.parse(response.data);

    if (!dicomMetadata.PatientName) {
      return res.status(400).json({
        success: false,
        error: "Missing PatientName in DICOM metadata",
      });
    }

    let patient = null

    if (!patient) {
      patient = await Patient.create({
        Name: dicomMetadata.PatientName,
        CreatedDate: dicomMetadata.PatientBirthDate
          ? new Date(dicomMetadata.PatientBirthDate).toISOString()
          : null,
      });
    }

    let modality = await Modality.findOne({
      where: { Name: dicomMetadata.Modality },
    });
    if (!modality) {
      modality = await Modality.create({
        Name: dicomMetadata.Modality,
      });
    }

    let study = await Study.findOne({
      where: { StudyName: dicomMetadata.StudyDescription },
    });
    if (!study) {
      study = await Study.create({
        idPatient: patient.idPatient,
        StudyName: dicomMetadata.StudyDescription,
        CreatedDate: dicomMetadata.StudyDate,
      });
    }

    let series = await Series.findOne({
      where: { SeriesName: dicomMetadata.SeriesDescription },
    });
    if (!series) {
      series = await Series.create({
        idPatient: patient.idPatient,
        idStudy: study.idStudy,
        idModality: modality.idModality,
        SeriesName: dicomMetadata.SeriesDescription,
        CreatedDate: dicomMetadata.StudyDate,
      });
    }

    const file = await File.create({
      idPatient: patient.idPatient,
      idStudy: study.idStudy,
      idSeries: series.idSeries,
      FilePath: dicomMetadata.FilePath,
      CreatedDate: dicomMetadata.StudyDate,
    });

    res.json({
      success: true,
      message: `File processed successfully.`,
      filePath: dicomMetadata.FilePath,
    });
  } catch (error) {
    console.error("Error processing DICOM file:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(4000, () => {
  console.log(
    "Node.js GraphQL API running at http://localhost:4000/graphql"
  );
});
