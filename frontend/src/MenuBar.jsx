import React from "react";
import { AppBar, Box, Toolbar, IconButton, SvgIcon } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function MenuBar({ toggleDrawer }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#175275' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
            <SvgIcon sx={{ ml: 5 }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                focusable="false"
              >
                <path
                  d="M4 10h3v7H4zm6.5 0h3v7h-3zM2 19h20v3H2zm15-9h3v7h-3zm-5-9L2 6v2h20V6z"
                  fill="#FFFFFF"
                />
              </svg>
            </SvgIcon>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
