import { Box, Container, Typography } from "@mui/material";
import { useState } from "react";

export default function Viewer({
  imageUrl,
  thumbnails,
  onThumbnailClick,
  imageData,
}) {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [currentImageIndex, setCurrentImageIndex] = useState(
    thumbnails.findIndex(
      (thumb) =>
        `${apiUrl}/uploads/${thumb.ImagePath.split("/").pop()}` === imageUrl
    )
  );
  console.log(thumbnails);
  const handleThumbnailClick = (imagePath, index) => {
    setCurrentImageIndex(index); // Update the current image index
    onThumbnailClick(imagePath); // Call the provided onThumbnailClick callback
  };

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
            const imagePath = `${apiUrl}/uploads/${thumb.ImagePath.split(
              "/"
            ).pop()}`;
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
                  onClick={() => handleThumbnailClick(imagePath, index)}
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
          position: "relative",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "black",
        }}
        maxWidth={false}
      >
        {imageData && (
          <>
            <Box
              sx={{ position: "absolute", color: "white", left: 10, top: 10 }}
            >
              <Typography variant="body2">
                PatientName: {imageData.PatientName}
              </Typography>
              <Typography variant="body2">
                PatientBirthDate: {imageData.CreatedDate}
              </Typography>
            </Box>
            <Box
              sx={{ position: "absolute", color: "white", right: 10, top: 10 }}
            >
              <Typography variant="body2">
                StudyName: {imageData.StudyName}
              </Typography>
              <Typography variant="body2">
                SeriesName: {imageData.SeriesName}
              </Typography>
            </Box>
          </>
        )}
        <Box
          sx={{
            maxWidth: "80vw",
            maxHeight: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Viewer"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          )}
        </Box>

        {imageData && thumbnails && (
          <>
            <Box
              sx={{
                position: "absolute",
                bottom: 10,
                left: 10,
                color: "white",
              }}
            >
              <Typography variant="body2">
                Image: {`${currentImageIndex + 1} / ${thumbnails.length}`}
              </Typography>
            </Box>
            <Box
              sx={{
                position: "absolute",
                color: "white",
                right: 10,
                bottom: 10,
              }}
            >
              <Typography variant="body2">
                StudyDate: {imageData.StudyDate}
              </Typography>
              <Typography variant="body2">
                Modality: {imageData.ModalityName}
              </Typography>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}
