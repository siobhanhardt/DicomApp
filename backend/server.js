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
    }

    type File {
        idFile: ID!
        idPatient: Int!
        idStudy: Int!
        idSeries: Int!
        FilePath: String
        ImagePath: String
        CreatedDate: String
    }

    type Query {
        patients: [Patient]
        studies: [Study]
        series: [Series]
        files: [File]
    }
`);

// GraphQL Resolvers
const root = {
  patients: async () => await Patient.findAll(),
  studies: async () => await Study.findAll(),
  series: async () => await Series.findAll(),
  files: async () => await Files.findAll(),
  modality: async () => await Modality.findAll(),
};

// Set up GraphQL API
app.use("/graphql", graphqlHTTP({ schema, rootValue: root, graphiql: true }));

// Start Server
app.listen(4000, () => {
  console.log(
    "🚀 Node.js GraphQL API running at http://localhost:4000/graphql"
  );
});
