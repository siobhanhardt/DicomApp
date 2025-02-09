import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import MenuBar from "./MenuBar";
import SideBar from "./SideBar";
import Upload from "./Upload/Upload";
import Download from "./Download/Download";
import Viewer from "./Viewer/Viewer";
import axios from "axios";

function App() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState("upload");
  const [imageUrl, setImageUrl] = useState("");
  const [imageData, setImageData] = useState();
  const [ids, setIds] = useState([0, 0]);
  const [thumbnailImages, setThumbnailImages] = useState([]);

  const GET_IMAGES = `
  query images($idSeries: Int, $idPatient: Int) {
    images(idSeries: $idSeries, idPatient: $idPatient) {
      ImagePath
      InstanceNumber
    }
  }
`;
  async function fetchFiles() {
    try {
      const variables = {
        idSeries: Number(ids[0]),
        idPatient: Number(ids[1]),
      };
      const response = await axios.post('http://localhost:4000/graphql', {
        query: GET_IMAGES,
        variables,
      });
      const data = response.data.data;
      setThumbnailImages(data.images);
    } catch (err) {
      console.error("GraphQL Request Error:", err);
    }
  }

  useEffect(() => {
    fetchFiles();
  }, [ids]);

  function toggleDrawer() {
    setOpen(!open);
  }

  function handleViewerPageChange(imageUrl, data) {
    setImageData(data);
    setPage("viewer");
    setImageUrl(imageUrl);
    setIds([data.idSeries, data.idPatient]);
  }

  function renderPage() {
    switch (page) {
      case "upload":
        return <Upload />;
      case "download":
        return <Download handleViewerPageChange={handleViewerPageChange} />;
      case "viewer":
        return (
          <Viewer
            imageUrl={imageUrl}
            thumbnails={thumbnailImages}
            onThumbnailClick={setImageUrl}
            imageData={imageData}
          />
        );
      default:
        return <Upload />;
    }
  }
  return (
    <>
      <MenuBar toggleDrawer={toggleDrawer} />
      <SideBar open={open} setPage={setPage} />
      <Box
        sx={{
          marginLeft: open ? "200px" : "80px",
          transition: "margin-left 0.3s ease-in-out",
          padding: "20px",
        }}
      >
        {renderPage()}
      </Box>
    </>
  );
}

export default App;
