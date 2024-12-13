import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import MaintenanceIcon from "../../../assets/Sidebar/MaintenanceIconSelected.svg";
import RadioButtonLogo from "../../../assets/Maintenance_Scheduling/RadioButton.png";
import Vehicle from "../../../assets/Maintenance_Scheduling/Vehicle.png";
import Hardware from "../../../assets/Maintenance_Scheduling/HardwareLogo.png";
import Arrowdown from "../../../assets/Card/fi_chevron-down.png";
import CrossIcon from "../../../assets/Table/CrossIcon.png";
import { useNavigate } from "react-router-dom";
import { maintenanceSchedulingStyles } from "../../UI/Main";
import MaintenanceTableContent from "../Table/MaintenanceTableContent";
import TablePagination from "../Pagination/TablePagination";

import AddIcon from '@mui/icons-material/Add'; // If using Material-UI

function Maintenance() {

  const route = 'add-maintenance'; // Define it if it's dynamic
  // navigate(route); // Ensure 'route' is a string or path variable
  const buttonText = 'Add Here'; // Or dynamically set based on props/state
  const navigate = useNavigate();
  return (
    <Box mt={12}
      sx={{
        position: "absolute",
        mt: { xs: 5, sm: 5, md: 5, lg: 5 },
        // Adjust padding based on the screen size
        width: { lg: "82%", xs: "100%" }, // Ensure it takes full width
        // maxWidth: "1200px", // Set a max width as needed
      }}
    >
      
      <Box sx={{ padding: { lg: "1rem 4rem 1rem 1rem", xs: "1rem 1rem 1rem 1rem" }, marginRight: { sm: "2rem", xs: "0rem" }, background: "#FFF", }}>
        <Box sx={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Box sx={{ width: 44, height: 40, background: "#FEF2E5", borderRadius: "0.7rem", display: "flex", justifyContent: "center", alignItems: "center" }}> <img src={MaintenanceIcon} /> </Box>
          <Typography sx={{ fontFamily: "Poppins", fontSize: "0.8rem", color: "#909097" }}>
            Maintenance Status
          </Typography>
          <Button
    variant="contained"
    sx={{
      marginLeft: "auto", // Pushes the button to the right
      width: "150px",
      height: "38px",
      backgroundColor: "#15294E",
      color: "white",
      textTransform: "none",
      display: "flex",
      alignItems: "center",
      flexDirection: "row",
      paddingRight: "25px",
      gap: "3px", // Spacing between icon and text
      "&:hover": {
        backgroundColor: "#15294E",
      },
    }}
    onClick={() => navigate(route)}
  >
    <AddIcon />
    {buttonText}
  </Button>
        </Box>
        <MaintenanceTableContent />
        <TablePagination />
      </Box>
    </Box>
  );
}

export default Maintenance;
