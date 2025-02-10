import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import MenuBar from "./MenuBar";
import SideBar from "./SideBar";
import Upload from "./Upload/Upload";
import Download from "./Download/Download";
import Viewer from "./Viewer/Viewer";
import axios from "axios";

function App() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const api = `${apiUrl}/graphql`
  const [open, setOpen] = useState(false); // for opening and closing sidebar
  const [page, setPage] = useState("upload"); // for changing what page you're on
  const [imageUrl, setImageUrl] = useState(""); // hold image url for displaying in viewer
  const [imageData, setImageData] = useState(); // holds all data relating to the image/series you are viewing
  const [ids, setIds] = useState({ idSeries: 0, idPatient: 0 }); // hold patient and series id for image query below
  const [thumbnailImages, setThumbnailImages] = useState([]); // holds list of images in a series, set by function below

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
      const { idSeries, idPatient } = ids;  // Destructure to get idSeries and idPatient from the object
      const variables = {
        idSeries: Number(idSeries), 
        idPatient: Number(idPatient),
      };
      const response = await axios.post(api, {
        query: GET_IMAGES,
        variables,
      })
      if(response.status != 200) {
        throw new Error(`error with status:${response.status})`);
      }
      const data = response.data.data;
      setThumbnailImages(data.images);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchFiles();
  }, [ids]); // when ids update, ie a different series has been selected, reload series of images

  function toggleDrawer() {
    setOpen(!open);
  }

  function handleViewerPageChange(imageUrl, data) { // Passed down to table, is triggered when a user clicks the view icon. Opens viewer page and sets relevant data
    setImageData(data);
    setPage("viewer");
    setImageUrl(imageUrl);
    setIds({ idSeries: data.idSeries, idPatient: data.idPatient });
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
