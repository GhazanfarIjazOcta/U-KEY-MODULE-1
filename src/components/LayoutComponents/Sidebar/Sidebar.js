import { Box, Button, Divider, Stack } from "@mui/material";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

import React, { useEffect, useState } from "react";
import Ukeylogo from "../../../assets/Layout/Ukeylogo-removebg-preview.png";
import DashboardLogo from "../../../assets/Sidebar/DashboardIcon.svg";
import SelectedDashboardLogo from "../../../assets/Sidebar/DashboardIconSelected.svg";
import UserLogo from "../../../assets/Sidebar/UserIcon.svg";
import SelectedUserLogo from "../../../assets/Sidebar/UserIconSelected.svg";
import CompanyLogo from "../../../assets/Sidebar/CompaniesIcon.svg";
import SelectedCompanyLogo from "../../../assets/Sidebar/CompaniesIconSelected.svg";
import MachinesLogo from "../../../assets/Sidebar/MachinesIcon.svg";
import SelectedMachinesLogo from "../../../assets/Sidebar/MachinesIconSelected.svg";
import OperatorsLogo from "../../../assets/Sidebar/OperatorsIcon.svg";
import SelectedOperatorLogo from "../../../assets/Sidebar/OperatorsIconSelected.svg";
import MaintenanceLogo from "../../../assets/Sidebar/MaintenanceIcon.svg";
import SelectedMaintenanceLogo from "../../../assets/Sidebar/MaintenanceIconSelected.svg";
import JobLogo from "../../../assets/Sidebar/JobSitesIcon.svg";
import SelectedJobLogo from "../../../assets/Sidebar/JobSitesIconSelected.svg";
import LogoutLogo from "../../../assets/Layout/Left_icon.png";
import {
  lineStyle,
  listItemIconStyle,
  listItemStyles,
  listStyle,
  logoutButtonContainer
} from "../../UI/Layout";
import { useNavigate } from "react-router-dom";

import { signOut, getAuth } from "firebase/auth";
import { useUser } from "../../../Context/UserContext";

import { sidebarUI } from "../../UI/Main";

function Sidebar() {
  const { user, updateUserData } = useUser(); // Destructure user data from context
  console.log("user role is ", user.role);

  // const { storedUser } = useAuth();
  // console.log("user role is actually on sidebar ", storedUser);
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);

  const handleListItemClick = (index, route) => {
    setSelectedItem(index);
    navigate(route);
  };

  const handleLogout = async () => {
    try {
      // Sign out the user from Firebase Authentication
      await signOut(getAuth());

      // Remove user data from localStorage (if any)
      localStorage.removeItem("user");
      localStorage.clear();

      // Optionally, navigate to a login page after logging out
      navigate("/login");
    } catch (error) {
      console.error("Logout error: ", error);
    }
  };

  const SuperAdminlistItems = [
    {
      text: "Dashboard",
      icon: DashboardLogo,
      selectedIcon: SelectedDashboardLogo,
      route: "/dashboard"
    },
    {
      text: "Companies",
      icon: CompanyLogo,
      selectedIcon: SelectedCompanyLogo,
      route: "companies"
    },
    {
      text: "Admins",
      icon: UserLogo,
      selectedIcon: SelectedUserLogo,
      route: "user-management"
    },
    {
      text: "Machines",
      icon: MachinesLogo,
      selectedIcon: SelectedMachinesLogo,
      route: "machines"
    },
    {
      text: "Operators",
      icon: OperatorsLogo,
      selectedIcon: SelectedOperatorLogo,
      route: "operators"
    },
    {
      text: "Job Sites",
      icon: JobLogo,
      selectedIcon: SelectedJobLogo,
      route: "job-sites"
    },
    {
      text: "Maintenance",
      icon: MaintenanceLogo,
      selectedIcon: SelectedMaintenanceLogo,
      route: "maintenance"
    }
  ];

  const AdminlistItems = [
    {
      text: "Dashboard",
      icon: DashboardLogo,
      selectedIcon: SelectedDashboardLogo,
      route: "/admin-dashboard"
    },

    {
      text: "Admins",
      icon: UserLogo,
      selectedIcon: SelectedUserLogo,
      route: "user-management"
    },
    {
      text: "Machines",
      icon: MachinesLogo,
      selectedIcon: SelectedMachinesLogo,
      route: "machines"
    },
    {
      text: "Operators",
      icon: OperatorsLogo,
      selectedIcon: SelectedOperatorLogo,
      route: "operators"
    },
    {
      text: "Job Sites",
      icon: JobLogo,
      selectedIcon: SelectedJobLogo,
      route: "job-sites"
    },
    {
      text: "Maintenance",
      icon: MaintenanceLogo,
      selectedIcon: SelectedMaintenanceLogo,
      route: "maintenance"
    }
  ];

  const CustomerlistItems = [
    {
      text: "Dashboard",
      icon: DashboardLogo,
      selectedIcon: SelectedDashboardLogo,
      route: "/employee-dashboard"
    },
    {
      text: "Machines",
      icon: MachinesLogo,
      selectedIcon: SelectedMachinesLogo,
      route: "machines"
    },
    {
      text: "Maintenance",
      icon: MaintenanceLogo,
      selectedIcon: SelectedMaintenanceLogo,
      route: "maintenance"
    }
  ];

  let listToRender;
  if (user.role === "superAdmin") {
    listToRender = SuperAdminlistItems;
  } else if (user.role === "admin") {
    listToRender = AdminlistItems;
  } else if (user.role === "employee" || user.role === "operator") {
    listToRender = CustomerlistItems;
  } else {
    // Default or fallback case (e.g., handle unexpected roles)
    listToRender = [];
  }

  return (
    <Box
      flex={2}
      //   sx={{ backgroundColor: "red" }}
      display={{ xs: "none", lg: "flex" }}
      height={"100vh"}
      flexDirection={"column"}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Box
        sx={{
          ...sidebarUI.sidebarSecondBox
        }}
      >
        <Box
          padding={"0.5rem"}
          overflow={"hidden"}
          display={"flex"}
          justifyContent={"center"}
        >
          <img
            src={Ukeylogo}
            alt="logo"
            width={150}
            onClick={() => {
              if (user.role === "admin") {
                navigate("/admin-dashboard");
              } else if (user.role === "superAdmin") {
                navigate("/dashboard");
              } else {
                navigate("/employee-dashboard");
              }
            }}
            style={{ cursor: "pointer" }}
          />
        </Box>
        <Box
          sx={{
          ...sidebarUI.sidebarFourthColorBox
          }}
          mt={2}
        >
          <Box sx={listStyle} mt={"1rem"}>
            <List>
              {listToRender.map((item, index) => (
                <ListItem
                  button
                  key={item.text}
                  onClick={() => handleListItemClick(index, item.route)}
                  sx={{
                    ...listItemStyles,
                    backgroundColor:
                      selectedItem === index ? "#283A5C" : "transparent",
                    "&:hover": {
                      backgroundColor:
                        selectedItem === index ? "#283A5C" : "#283A5C"
                    }
                  }}
                >
                  <ListItemIcon sx={listItemIconStyle}>
                    <img
                      src={
                        selectedItem === index ? item.selectedIcon : item.icon
                      }
                      alt={item.text}
                      width="20px"
                      height="22px"
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      fontFamily: "Poppins",
                      display: { xs: "block", lg: "block" },
                      noWrap: true
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          <Stack sx={logoutButtonContainer}>
            <Box sx={lineStyle} />
            <Button
              variant="contained"
              fullWidth
              startIcon={
                <img
                  src={LogoutLogo}
                  alt="dashboard"
                  width="15px"
                  height={"15px"}
                />
              }
              sx={{
               ...sidebarUI.sidebarButton
                }
              }
              onClick={handleLogout}
            >
              Log out
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default Sidebar;
