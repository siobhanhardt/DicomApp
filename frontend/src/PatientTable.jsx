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

export default function PatientTable({ headers, sampleData}) {
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
        <TableBody>
            {sampleData.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {Object.entries(row).map(([key, cell], cellIndex) => {
                if (key === "FilePath" || key === "ImagePath") {
                  return null; 
                }
                return <TableCell key={cellIndex}>{cell}</TableCell>;
              })}
              {headers.length === 5 && (
                <>
                  <TableCell key="action1">
                    <IconButton
                      size="large"
                      edge="start"
                      color="#696969"
                      aria-label="pageview"
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
                    >
                      <DownloadIcon />
                    </IconButton>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
