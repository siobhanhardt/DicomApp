import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import PageviewIcon from "@mui/icons-material/Pageview";

export default function PatientTable({ headers, sampleData, handleViewerPageChange,}) {

  const apiUrl = import.meta.env.VITE_API_URL;

  function handleDownload(filePath) {
    const fileName = filePath.split("/").pop();
    const downloadUrl = `${apiUrl}/uploads/${fileName}`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 400 }}>
        <TableHead>
          <TableRow>
            {headers.map((column, index) => (
              <TableCell key={index}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        {sampleData &&
        <TableBody>
          {sampleData.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {Object.entries(row)
                .slice(0, 3) 
                .map(([key, value], cellIndex) => {
                  return <TableCell key={cellIndex}>{value}</TableCell>; 
                })}
              {headers.length === 5 && (
                <>
                  <TableCell key="action1">
                    <IconButton
                      size="large"
                      edge="start"
                      color="#696969"
                      aria-label="pageview"
                      onClick={() => {
                        const imageUrl = `${apiUrl}/uploads/${row.ImagePath.split(
                          "/"
                        ).pop()}`;
                        handleViewerPageChange(imageUrl, row);
                      }}
                    >
                      <PageviewIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell key="action2">
                    <IconButton
                      size="large"
                      edge="start"
                      color="#696969"
                      aria-label="download"
                      onClick={() => handleDownload(row.FilePath)}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>}
      </Table>
    </TableContainer>
  );
}
