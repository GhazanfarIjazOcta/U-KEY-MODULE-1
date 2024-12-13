import { Box, Button, Divider, Stack, List, ListItem, ListItemIcon, ListItemText, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState, useEffect } from "react";
import Ukeylogo from "../../../assets/Layout/Ukeylogo-removebg-preview.png";
import DashboardLogo from "../../../assets/Sidebar/DashboardIcon.svg";
import SelectedDashboardLogo from "../../../assets/Sidebar/DashboardIconSelected.svg"
import UserLogo from "../../../assets/Sidebar/UserIcon.svg";
import SelectedUserLogo from "../../../assets/Sidebar/UserIconSelected.svg";
import CompanyLogo from "../../../assets/Sidebar/CompaniesIcon.svg";
import SelectedCompanyLogo from "../../../assets/Sidebar/CompaniesIconSelected.svg"
import MachinesLogo from "../../../assets/Sidebar/MachinesIcon.svg";
import SelectedMachinesLogo from "../../../assets/Sidebar/MachinesIconSelected.svg"
import OperatorsLogo from "../../../assets/Sidebar/OperatorsIcon.svg";
import SelectedOperatorLogo from "../../../assets/Sidebar/OperatorsIconSelected.svg"
import MaintenanceLogo from "../../../assets/Sidebar/MaintenanceIcon.svg";
import SelectedMaintenanceLogo from "../../../assets/Sidebar/MaintenanceIconSelected.svg"
import JobLogo from "../../../assets/Sidebar/JobSitesIcon.svg";
import SelectedJobLogo from "../../../assets/Sidebar/JobSitesIconSelected.svg"
import LogoutLogo from "../../../assets/Layout/Left_icon.png";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation

function Sidebar2({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route
  const [selectedItem, setSelectedItem] = useState(0);

  const listItems = [
    { text: "Dashboard", icon: DashboardLogo, selectedIcon: SelectedDashboardLogo, route: "/dashboard" },
    { text: "Companies", icon: CompanyLogo, selectedIcon: SelectedCompanyLogo, route: "companies", },
    { text: "Users", icon: UserLogo, selectedIcon: SelectedUserLogo, route: "user-management" },
    { text: "Machines", icon: MachinesLogo, selectedIcon: SelectedMachinesLogo, route: "machines", },
    { text: "Operators", icon: OperatorsLogo, selectedIcon: SelectedOperatorLogo, route: "operators", },
    { text: "Job Sites", icon: JobLogo, selectedIcon: SelectedJobLogo, route: "job-sites" },
    { text: "Maintenance", icon: MaintenanceLogo, selectedIcon: SelectedMaintenanceLogo, route: "maintenance", },
  ];

  // Synchronize the selected item with the current route
  useEffect(() => {
    const currentItemIndex = listItems.findIndex(item => item.route === location.pathname);
    if (currentItemIndex !== -1) {
      setSelectedItem(currentItemIndex);
    }
  }, [location.pathname]); // Run when location changes

  const handleListItemClick = (index, route) => {
    setSelectedItem(index);
    navigate(route);
    onClose(); // Close the sidebar when an item is clicked
  };

  return (
    <Box
      sx={{
        width: { xs: '50vw', sm: '40vw', md: '20vw' },
        maxHeight: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: "#15294E",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 'clamp(0.5rem, 1vw, 1rem)',
        boxShadow: "2px 0 5px rgba(0,0,0,0.5)",
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" justifyContent="center" mb={1}>
          <img src={Ukeylogo} alt="logo" style={{ width: '70%', maxWidth: '120px' }} />
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ backgroundColor: "#FFF", opacity: "43%", }} />

      <List>
        {listItems.map((item, index) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleListItemClick(index, item.route)}
            sx={{
              backgroundColor: selectedItem === index ? "#283A5C" : "transparent",
              "&:hover": { backgroundColor: "#F38712" },
              fontSize: 'clamp(0.7rem, 1.2vw, 0.9rem)',
              padding: 'clamp(0.4rem, 0.8vw, 0.8rem)',
            }}
          >
            <ListItemIcon>
              <img
                src={selectedItem === index ? item.selectedIcon : item.icon}
                alt={item.text} style={{ width: 'clamp(14px, 3vw, 22px)', height: 'clamp(14px, 3vw, 22px)' }} />
            </ListItemIcon>
            <ListItemText primary={item.text} sx={{ color: 'white' }} />
          </ListItem>
        ))}
      </List>

      <Stack spacing={1}>
        <Divider sx={{ backgroundColor: "#FFF", opacity: "43%", }} />
        <Button
          variant="contained"
          fullWidth
          startIcon={<img src={LogoutLogo} alt="logout" style={{ width: 'clamp(10px, 1.5vw, 14px)', height: 'clamp(10px, 1.5vw, 14px)' }} />}
          onClick={() => navigate("/login")}
          sx={{
            backgroundColor: "white",
            textTransform: "none",
            color: "black",
            "&:hover": { backgroundColor: "lightgray" },
            fontSize: 'clamp(0.7rem, 1.2vw, 0.9rem)',
            padding: 'clamp(0.4rem, 0.8vw, 0.8rem)',
          }}
        >
          Log out
        </Button>
      </Stack>
    </Box>
  );
}

export default Sidebar2;
