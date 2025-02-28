const express = require("express");
const multer = require("multer");
const path = require("path");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const cors = require("cors");
const { Patient, Study, Series, File, Modality } = require("./models");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// Storage for uploading images and .dcim files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/app/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Defining Graphql data
const schema = buildSchema(`
    type Patient {
        idPatient: ID!
        Name: String
        CreatedDate: String
    }
    type Modality {
      idModality: Int!
      Name: String
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
        study: Study
        modality: Modality
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
        InstanceNumber: Int
        series: Series
    }

    type Query {
        patients: [Patient]
        studies: [Study]
        series: [Series]
        files: [File]
        images(idSeries: Int, idPatient: Int): [File]
    }
`);
// Defining resolvers
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
              {
                model: Study,
                as: "study",
                attributes: ["StudyName", "CreatedDate"],
              },
              {
                model: Modality,
                as: "modality",
                attributes: ["Name"],
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
  images: async ({ idSeries, idPatient }) => {
    const whereClause = {};
    if (typeof idSeries === "number") {
      whereClause.idSeries = idSeries;
    }
    if (typeof idPatient === "number") {
      whereClause.idPatient = idPatient;
    }
    try {
      const files = await File.findAll({
        where: whereClause,
        order: [["InstanceNumber", "ASC"]],
      });

      return files;
    } catch (error) {
      console.error("Error fetching images:", error);
      return [];
    }
  },
  modality: async () => await Modality.findAll(),
};

app.use("/graphql", graphqlHTTP({ schema, rootValue: root, graphiql: true })); // Creating graphql endpoint

app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Creating end point for uploading files

app.post("/api/upload-dicom", upload.array("file"), async (req, res) => { // Creating endpoint for processing and uploading dicom data
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "No files uploaded" });
    }
    for (const file of req.files) {
      const filePath = path.join(__dirname, "uploads", file.filename); 

      try {
        const response = await axios.post(
          "http://python-service:5000/process-dicom", // Sending to python service to process the data
          {
            filePath: filePath,
          }
        );
        const dicomMetadata = response.data;

        if (!dicomMetadata.PatientName) {
          return res.status(400).json({
            success: false,
            error: "Missing PatientName in DICOM metadata",
          });
        }

        let patient = await Patient.findOne({
          where: { Name: dicomMetadata.PatientName },
        });

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
        let file = await File.findOne({
          where: { ImagePath: dicomMetadata.ImagePath },
        });
        if (!file) {
          file = await File.create({
            idPatient: patient.idPatient,
            idStudy: study.idStudy,
            idSeries: series.idSeries,
            FilePath: dicomMetadata.FilePath,
            ImagePath: dicomMetadata.ImagePath,
            CreatedDate: dicomMetadata.StudyDate,
            InstanceNumber: dicomMetadata.InstanceNumber,
          });
        }
      } catch (error) {
        console.error("Error processing DICOM file:", error);
        return res.status(500).json({ success: false, error: error.message });
      }
    }

    res.json({
      success: true,
      message: `${req.files.length} files uploaded successfully.`,
      files: req.files,
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(4000, () => {
  console.log("Node.js server is running");
});
