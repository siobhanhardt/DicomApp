import { useState } from "react";
import { Box } from "@mui/material";
import MenuBar from "./MenuBar";
import SideBar from "./SideBar";
import Upload from "./Upload/Upload";
import Download from "./Download/Download";
import Viewer from "./Viewer/Viewer";

function App() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState("upload");

  function toggleDrawer() {
    setOpen(!open);
  }

  function renderPage() {
    switch (page) {
      case "upload":
        return <Upload />;
      case "download":
        return <Download/>;
      case "viewer":
        return <Viewer/>
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
