// Drawer.js
import React from "react";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Drawer
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
      >
        <List>
          <ListItem disablePadding onClick={handleDrawerClose}>
            <ListItemButton>
              {/* Render all navigation items */}
              <ListItemIcon>
                <i className="fa-solid fa-user" />
              </ListItemIcon>
              <ListItemText primary="New ride" onClick={() => navigate("/newride")} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding onClick={handleDrawerClose}>
            <ListItemButton>
              <ListItemIcon>
                <i className="fa-solid fa-user" />
              </ListItemIcon>
              <ListItemText primary="Users" onClick={() => navigate("/users")} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding onClick={handleDrawerClose}>
            <ListItemButton>
              <ListItemIcon>
                <i className="fa-solid fa-user" />
              </ListItemIcon>
              <ListItemText primary="Rental Services" onClick={() => navigate("/bookings")} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding onClick={handleDrawerClose}>
            <ListItemButton>
              <ListItemIcon>
                <i className="fa-solid fa-user" />
              </ListItemIcon>
              <ListItemText primary="About Us" onClick={() => navigate("/aboutus")} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding onClick={handleDrawerClose}>
            <ListItemButton>
              <ListItemIcon>
                <i className="fa-solid fa-user" />
              </ListItemIcon>
              <ListItemText primary="Profile" onClick={() => navigate("/profile")} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Button onClick={handleDrawerOpen}>
        <i className="fa-solid fa-bars" style={{ color: "#fff", fontSize: "25px" }} />
      </Button>
    </div>
  );
};

export default SideBar;
