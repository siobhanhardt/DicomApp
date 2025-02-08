import { CircularProgress, Container, Typography, Table, TableCell, TableHead, TableRow, TableBody } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import PatientTable from "../PatientTable";

export default function Download() {
  const headers = [
    "Patient Name",
    "Patient Birth Date",
    "Series Description",
    "View",
    "Download",
  ];

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const GRAPHQL_URL = "http://localhost:4000/graphql";
  const GET_FILES = `
  query {
    files {
      FilePath
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

  async function fetchGraphQL(query) {
    try {
      const response = await axios.post(GRAPHQL_URL, { query });
      return response.data.data; 
    } catch (error) {
      console.error("GraphQL Request Error:", error);
      return null;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const filesData = await fetchGraphQL(GET_FILES);

        if (filesData) {
          const flattened = flattenData(filesData);
          setFiles(flattened);
        } else {
          setError("Failed to fetch data.");
        }
      } catch (err) {
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

      delete flattened.patient;

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
        paddingBottom={"30px"}
      >
        Download
      </Typography>
      <PatientTable headers={headers} sampleData={files}/>
    </Container>
  );
}
