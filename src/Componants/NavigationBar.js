/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import { useNavigate, useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";

import "./navigation.scss";
import { UseChannelIdContext } from "../Context/Context";

const drawerWidth = 240;
const settings = ["Profile", "Account", "Dashboard", "Logout"];

export default function PermanentDrawerLeft() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const navigate = useNavigate();
  const location = useLocation();
  const User = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : "";

  const renderBreadcrumbsButton = () => {
    return (
      <div className="breadcrumbs-button" onClick={handleDrawerOpen}>
        <i
          className="fa-solid fa-bars"
          style={{ color: "#fff", fontSize: "25px" }}
        />
      </div>
    );
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const { isVisible, setIsVisible } = UseChannelIdContext();
  const [open, setOpen] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const DrawerContent = (
    <div>
      <Toolbar className="Drawer">
        <div className="logo" />
        <div className="lg-name">𝑀𝒴 𝐵𝐼𝒦𝐸</div>
      </Toolbar>
      <Divider />
      <List>
        <ListItem disablePadding className="Navigation-tab">
          <ListItemButton>
            <ListItemIcon>
              <i class="fa-solid fa-motorcycle" />
            </ListItemIcon>
            <ListItemText
              primary="New ride"
              onClick={() => navigate("/newride")}
            />
          </ListItemButton>
        </ListItem>
        {User.role === "admin" ? (
          <ListItem disablePadding className="Navigation-tab">
            <ListItemButton>
              <ListItemIcon>
                <i className="fa-solid fa-user" />
              </ListItemIcon>
              <ListItemText
                primary="Users"
                onClick={() => navigate("/users")}
              />
            </ListItemButton>
          </ListItem>
        ) : (
          ""
        )}

        {User.role === "admin" ? (
          <ListItem disablePadding className="Navigation-tab">
            <ListItemButton onClick={() => navigate("/dashboard")}>
              <ListItemIcon>
                <img
                  src="https://static.thenounproject.com/png/2521383-200.png"
                  style={{ width: "20px" }}
                />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
        ) : (
          ""
        )}

        {User.role === "admin" ? (
          ""
        ) : (
          <ListItem disablePadding className="Navigation-tab">
            <ListItemButton onClick={() => navigate("/bookings")}>
              <ListItemIcon>
                <i class="fa-solid fa-scroll" />
              </ListItemIcon>
              <ListItemText primary="Bookings" />
            </ListItemButton>
          </ListItem>
        )}
        <ListItem disablePadding className="Navigation-tab">
          <ListItemButton onClick={() => navigate("/")}>
            <ListItemIcon>
              <i class="fa-regular fa-address-card" />
            </ListItemIcon>
            <ListItemText primary="About Us" />
          </ListItemButton>
        </ListItem>
        <Divider />
        {User.role === "admin" || User.role === "owner" ? (
          ""
        ) : (
          <ListItem disablePadding className="Navigation-tab">
            <ListItemButton onClick={() => navigate("/request")}>
              <ListItemIcon>
                <i class="fa-solid fa-message" />
              </ListItemIcon>
              <ListItemText primary="Request To Rent" />
            </ListItemButton>
          </ListItem>
        )}

        {User.role === "admin" ? (
          <ListItem disablePadding className="Navigation-tab">
            <ListItemButton onClick={() => navigate("/allrequests")}>
              <ListItemIcon>
                <i class="fa-solid fa-table" />
              </ListItemIcon>
              <ListItemText primary="Users Request" />
            </ListItemButton>
          </ListItem>
        ) : (
          ""
        )}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {isDesktop ? (
        <AppBar
          className="asds"
          position="fixed"
          sx={{
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
          }}
        >
          <Toolbar className="User-profile">
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src={User.image} />
                </IconButton>
              </Tooltip>

              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => {
                      if (setting === "Profile") {
                        navigate("/profile");
                        handleCloseUserMenu();
                      } else if (setting === "Logout") {
                        localStorage.removeItem("tokan");
                        localStorage.removeItem("user");
                        setIsVisible(true);
                        handleCloseUserMenu();
                        navigate("/login");
                      }
                    }}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Typography ml="30px">{User.name}</Typography>
          </Toolbar>
        </AppBar>
      ) : (
        renderBreadcrumbsButton()
      )}

      {location.pathname.includes("/login") ||
      location.pathname.includes("/signup") ||
      location.pathname.includes("/checkotp") ? (
        ""
      ) : (
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant={isDesktop ? "permanent" : "temporary"}
          anchor="left"
          open={open}
          onClose={() => setOpen(false)}
        >
          {DrawerContent}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 0 }}
      >
        <Toolbar />
      </Box>
    </Box>
  );
}
