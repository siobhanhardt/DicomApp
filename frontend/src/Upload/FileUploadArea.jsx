import React, { useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";
import axios from "axios";

export default function FileUploadArea({ handleFileUpload }) {
  const onDrop = useCallback((acceptedFiles) => {
    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append("file", file);
    });

    axios.post("http://localhost:4000/api/upload-dicom", formData)
    .then((response) => {
      console.log("File successfully uploaded:", response.data);
      handleFileUpload();
    })
    .catch((error) => {
      console.error("Error uploading file:", error);
    });
}, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "150px",
      }}
    >
      <Box
        {...getRootProps()}
        sx={{
          borderRadius: 3,
          width: "80%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "2px dashed #d6d6d6",
          padding: 3,
          cursor: "pointer",
        }}
      >
        <input {...getInputProps()} />
        <Typography variant="h6" color="textSecondary" textAlign="center">
          Drag and drop files here, or click to select files
        </Typography>
      </Box>
    </Box>
  );
}
