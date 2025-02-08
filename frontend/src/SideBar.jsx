import React from "react";
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import UploadIcon from "@mui/icons-material/Upload";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";

export default function SideBar({ open, setPage }) {
  function handlePageChange(page) {
    setPage(page);
  }
  const DrawerList = (
    <Box role="presentation" >
      <List >
        {["download", "upload", "viewer"].map((text, index) => (
          <ListItem key={text} disablePadding >
            <ListItemButton
              onClick={() => {
                handlePageChange(text);
              }}
              sx={{ display: "flex", alignItems: "center", mx: 'auto', px: '20px' }}
            >
              <ListItemIcon>
                {index === 0 ? (
                  <DashboardIcon sx={{ fontSize: "32px" }}/>
                ) : index === 1 ? (
                  <UploadIcon sx={{ fontSize: "32px" }}/>
                ) : (
                  <OpenInFullIcon sx={{ fontSize: "32px" }}/>
                )}
                <ListItemText primary={text.charAt(0).toUpperCase() + text.slice(1)} sx={{ marginLeft: "24px" }}/>
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
     <Drawer
        sx={{
          width: open ? 200 : 72,  
          flexShrink: 0,
          transition: "width 0.3s ease-in-out",
          [`& .MuiDrawer-paper`]: {
            width: open ? 200 : 72,  
            transition: "width 0.3s ease-in-out",
            boxSizing: "border-box",
            marginTop: "64px", 
          },
        }}
        variant="permanent"
      >
        {DrawerList}
      </Drawer>
    </div>
  );
}
