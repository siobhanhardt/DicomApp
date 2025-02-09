import { Box, Container, Typography } from "@mui/material";
import React from "react";

export default function Viewer({ imageUrl, thumbnails, onThumbnailClick }) {
  return (
    <Box
      sx={{
        display: "flex",
        marginTop: "64px", 
        height: "calc(100vh - 110px)", 
      }}
    >
      <Box
        sx={{
          width: "200px", 
          overflowY: "auto", 
          p: 1, 
          top: 0,
        }}
      >
        {thumbnails && thumbnails.length > 0 ? (
          thumbnails.map((thumb, index) => {
            const imagePath = `http://localhost:4000/uploads/${thumb.ImagePath.split("/").pop()}`;
            return (
              <Box key={index} sx={{ mb: 1 }}>
                <img
                  src={imagePath}
                  alt="Thumbnail"
                  style={{
                    width: "100%",
                    cursor: "pointer",
                    border:
                    imagePath === imageUrl ? "2px solid #175275" : "none",
                  }}
                  onClick={() => onThumbnailClick(imagePath)}
                />
              </Box>
            );
          })
        ) : (
          <Box>No thumbnails available</Box>
        )}
      </Box>
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
