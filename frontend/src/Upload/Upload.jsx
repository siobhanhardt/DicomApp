import { Container, Typography, CircularProgress } from "@mui/material";
import React, { useState, useEffect } from "react";
import PatientTable from "../PatientTable";
import axios from "axios";
import FileUploadArea from "./FileUploadArea";

export default function Upload() {
  const headers = ["Patient Name", "Patient Birth Date", "Series Description"];

  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const GRAPHQL_URL = "http://localhost:4000/graphql";
  const GET_SERIES = `
  query {
    files {
   		series {
        SeriesName
        patient {
          Name
          CreatedDate
        }
      }
    }
  }
`;



  async function fetchData() {
    try {
      setLoading(true);
      const response = await axios.post(GRAPHQL_URL, { query: GET_SERIES });
      const seriesData = response.data.data;
      if (seriesData) {
        const flattened = flattenData(seriesData);
        setSeries(flattened);
      } else {
        setError("Failed to fetch data.");
      }
    } catch (err) {
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleFileUpload() {
    setTimeout(() => {
      fetchData();
    }, 500);
  }

  function flattenData(data) {
    if (!data || !Array.isArray(data.files)) {
      console.error("Invalid data format. Expected 'files' array.");
      return [];
    }

    return data.files.map((file) => {
      if (!file.series || !file.series.patient) {
        console.error("Missing series or patient data for file", file);
        return {};
      }

     
      const flattened = {
        ...file.series.patient, 
        ...file.series, 
      };
      if (flattened.CreatedDate) {
        flattened.CreatedDate = new Date(
          parseInt(flattened.CreatedDate)
        ).toLocaleDateString();
      }

      return flattened;
    });
  }
  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container
      sx={{
        mt: 10,
        flexDirection: "column",
        display: "flex",
      }}
      maxWidth={false}
    >
      <Typography
        variant="h3"
        align="center"
        fontWeight={700}
        paddingTop={"30px"}
      >
        File Scanner
      </Typography>
      <FileUploadArea handleFileUpload={handleFileUpload}/>
      <Typography
        variant="h4"
        align="center"
        fontWeight={700}
        paddingBottom={"30px"}
      >
        Uploaded Files
      </Typography>
      <PatientTable headers={headers} sampleData={series} />
    </Container>
  );
}
