import { Box, Container, Typography } from "@mui/material";
import React from "react";

export default function Viewer({ imageUrl }) {
  return (
    <Box
      sx={{
        display: "flex",
        marginTop: "64px",
        height: "calc(100vh - 110px)",
      }}
    >
      <Container
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "black",
        }}
        maxWidth={false}
      >
        <Box
          sx={{
            maxWidth: "80vw",
            maxHeight: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={imageUrl}
            alt="Viewer"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
      </Container>
    </Box>
  );
}
