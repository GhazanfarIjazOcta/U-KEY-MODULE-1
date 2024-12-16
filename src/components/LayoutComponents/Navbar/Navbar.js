import React, { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "../../../assets/Layout/SearchIcon.svg";
import NotificationsBellIcon from "../../../assets/Layout/NotificationIcon.svg";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import {
  messageBoxStyle,
  rightContentStyle,
  textFieldContainerStyle,
  userInfoStyle,
  userNameStyle,
} from "../../UI/Layout";
import { Avatar, Drawer, InputAdornment, Paper, TextField } from "@mui/material";
import Chat from "../../../assets/Layout/Chat.png";
import Sidebar from "../Sidebar/Sidebar";
import SidebarMobile from "../SidebarMobile/SidebarMobile";

import { useUser } from "../../../Context/UserContext";

// import  { useContext } from 'react';
// import { UserContext } from '../../../context/UserContext';



const Search = styled("div")(({ theme }) => ({


  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.common.black, // Set icon color to black
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.common.black, // Set text color to black
  backgroundColor: theme.palette.common.white, // Set background color to white
  border: `1px solid #DCE0E5`, // Set border color to #DCE0E5
  borderRadius: theme.shape.borderRadius,
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function Navbar() {

  
   const navigate = useNavigate();

  // const { user, setUser } = useContext(UserContext);

  const { user, updateUserData } = useUser(); // Destructure user data from context
  const [headerMessage, setHeaderMessage] = React.useState(
    "Good morning, Admin"
  );

  const [SidebarOpen, setSidebarOpen] = useState(false);
  const isSideBarOpen = Boolean(SidebarOpen);



  const handleSideBarOpen = () => {
    setSidebarOpen(true);
  }



  // const handleSideBar = (event) => {
  //   setSidebarOpen(event.currentTarget);

  // }

  // const handleSideBarClose = () =>{
  //   setSidebarOpen(null);
  // }

  
 
  const handleSideBar = () => {
    setSidebarOpen(true);  // Simply open the sidebar
  };

  const handleSideBarClose = () => {
    setSidebarOpen(false);  // Close the sidebar
  };

  const mobileMenuIds = "primary-search-account-menu-mobile";
  const renderSidebar = (
    <Drawer open={SidebarOpen} onClose={handleSideBarClose} >
      <Menu open={SidebarOpen} onClose={handleSideBarClose}
      >
        <SidebarMobile onClose={handleSideBarClose} />
        /</Menu>
    </Drawer>

  );

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  ;

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const getCurrentDateTime = () => {
    const now = new Date();
    
    const options = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric', 
      hour12: true 
    };
    
    const formattedDate = now.toLocaleString('en-US', options);
    return `Today ${formattedDate}`;
  };

  return (
    <>
      <Box
        sx={{
          color: "black",
          // width: { xs: "98vw", lg: "79vw" },
          width: "100%",
          minHeight: "5.4rem",
          display: "flex",
          justifyContent: "space-between",
          minWidth: "320px",
          zIndex: 4,
          position: "sticky",
          top: 0, // Align to the top of the viewport
          left: 0, // Align to the left of the viewport
          background: "#F4F7F7"
        }}


      >
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="open drawer"
          sx={{ ml: "0.5rem", display: { lg: "none", xs: "flex" } }}
          // onClick={handleMobileMenuOpen}
          onClick={handleSideBar}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ ...userNameStyle, paddingTop: "1.5rem" }}>
          <Typography
            variant="h6"
            Wrap
            component="div"
            sx={{
              display: { lg: "block" },
              fontFamily: "Poppins",
              fontWeight: 500,
              fontSize: { sm: "1.5rem", xs: "1rem" },
              color: "#202020",
            }}
          >
            {headerMessage}
          </Typography>
          <Typography sx={{ fontSize: { sm: "0.8rem", xs: "0.7rem" }, color: "#47464A", fontFamily: "Poppins", textAlign: { lg: "start", md: "center", xs: "center" } }}>
            {/* Today Aug 22, 2020 | 7:23 PM */}
            {getCurrentDateTime()}
          </Typography>
        </Box>


        <Box sx={{ display: { xs: "none", md: "flex", }, gap: "2rem", marginRight: '2.5rem' }}>

          <Box display="flex" alignItems="center" gap={4}>
            {/* Search Icon */}
            <img src={SearchIcon} width={24} style={{ cursor: "pointer" }} alt="Search" />

            {/* Notifications Icon with Badge */}
            <Badge badgeContent={1} sx={{
              '& .MuiBadge-badge': {
                minWidth: '8px',      // Reduces the width of the badge
                height: '14px',        // Reduces the height of the badge
                fontSize: '0.55rem',    // Reduces the font size of the content
                top: '1px',            // Adjusts vertical positioning
                left: '4px'           // Adjusts horizontal positioning
              }
            }} color="error">
              <img src={NotificationsBellIcon} width={20} style={{ cursor: "pointer" }} alt="Notifications" />
            </Badge>
          </Box>


          <Box sx={{ display: "flex", gap: 1, paddingTop: "1.5rem" }}  >
            <Avatar
              sx={{ width: 40, height: 40 }}
              src="https://res.cloudinary.com/dnfc9g33c/image/upload/v1731416098/OIP_kxjlsd.jpg"
            />
            <Box sx={userNameStyle}>
              <Typography sx={{ fontWeight: 500, fontSize: "0.9rem", color: "#0A112F", fontFamily: "Inter" }}>
              {user.name}
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: "#3D4149", fontFamily: "Inter" }} >
              {user.role}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton
            size="large"
            aria-label="show more"
            aria-controls={mobileMenuId}
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            color="inherit"
          >
            <MoreIcon />
          </IconButton>
        </Box>
      </Box>
      {renderMobileMenu}
      {renderMenu}
      {renderSidebar}
    </>
  );
}
