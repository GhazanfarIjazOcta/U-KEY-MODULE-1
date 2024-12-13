import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import OutlinedCard from "../Card/Card";
import ActiveLogo from "../../../assets/Card/ActiveLogo.png";
import InActiveLogo from "../../../assets/Card/InActiveLogo.png";
import DevicesLogo from "../../../assets/Card/DevicesLogo.png";
import MachinesIcon from "../../../assets/Sidebar/MachinesIconSelected.svg";
import TableHeader from "../TableHeader/TableHeader";
import TablePagination from "../Pagination/TablePagination";
import { Button, Typography } from "@mui/material";
import MachinesTableContent from "../Table/MachinesTableContent";

import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add'; // If using Material-UI

import { useUser } from "../../../Context/UserContext";


export default function Machines() {

  const { user, updateUserData } = useUser(); // Destructure user data from context

  console.log("here is the user in the machine component <><><>" , user)

  const navigate = useNavigate(); // Initialize it inside your component

  const route = 'add-machine'; // Define it if it's dynamic
// navigate(route); // Ensure 'route' is a string or path variable
const buttonText = 'Add Here'; // Or dynamically set based on props/state



  return (
    <Box sx={{
      position: "absolute",
      mt: { xs: 5, sm: 5, md: 5, lg: 5 },
      // Adjust padding based on the screen size

      overflow: "none", // Prevent overflowing horizontally and vertically
      width: { lg: "82%", xs: "100%" }, // Ensure it takes full width
    }} >

      {/* <Grid container
        spacing={2} a
        sx={{
          flexGrow: 1,
          flexWrap: "wrap",
        }}>


        <Grid item xs={13} sm={4} md={2.98} sx={{ flexShrink: 1 }}>
          <OutlinedCard text={"All Devices"} icon={DevicesLogo} />
        </Grid>
        <Grid item xs={13} sm={6} md={2.98} sx={{ flexShrink: 1 }}>
          <OutlinedCard text={"Active"} icon={ActiveLogo} />
        </Grid>
        <Grid item xs={13} sm={6} md={2.98} sx={{ flexShrink: 1 }}>
          <OutlinedCard text={"InActive"} icon={InActiveLogo} />
        </Grid>
        <Grid item xs={13} sm={6} md={2.98} sx={{ flexShrink: 1 }}>
          <OutlinedCard text={"Malfunctioning"} icon={MalfunctioningLogo} />
        </Grid>


      </Grid> */}




      {/* 
      <TableHeader
        text={"Device Management"}
        searchText={"Device"}
        buttonText={"Add Device"}
        icon={DevicesLogo}
        route={"/add-device"}
      />
      <TablePagination count={5} currentPageResults={3} /> */}


      <Box sx={{ padding: { lg: "1rem 4rem 1rem 1rem", xs: "1rem 1rem 1rem 1rem" }, marginRight: { sm: "2rem", xs: "0rem" }, background: "#FFF", }}>
        <Box sx={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          {/* <Box sx={{ width: 44, height: 40, background: "#FEF2E5", borderRadius: "0.7rem", display: "flex", justifyContent: "center", alignItems: "center" }}> <img src={MachinesIcon} /> </Box>
          <Typography sx={{ fontFamily: "Poppins", fontSize: "0.8rem", color: "#909097" }}>
            Machines
          </Typography>

          <Button
                  variant="contained"
                  sx={{
                    marginRight: "15px",
                    marginLeft: "30px",
                    width: "150px",
                    height: "38px",
                    backgroundColor: "#15294E",
                    color: "white",
                    textTransform: "none",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    paddingRight: "25px",
                    gap: "3px", // spacing between icon and text
                    "&:hover": {
                      backgroundColor: "#15294E",
                    },
                  }}
                  onClick={() => navigate(route)}
                >
                  <AddIcon/>
                  {buttonText}
          </Button> */}

<Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between", // Ensures space between the Box and Button
    width: "100%", // Adjust this based on parent container size
  }}
>
  <Box
    sx={{
      width: 44,
      height: 40,
      background: "#FEF2E5",
      borderRadius: "0.7rem",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <img src={MachinesIcon} alt="Machines Icon" />
  </Box>
  
  <Typography
    sx={{
      fontFamily: "Poppins",
      fontSize: "0.8rem",
      color: "#909097",
      marginLeft: "10px", // Adjust spacing between icon and text
    }}
  >
    Machines
  </Typography>

  {(user.role === "superAdmin" || user.role === "admin") && (
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
)}



</Box>

          
        </Box>
        <MachinesTableContent />
      </Box>

    </Box>
  );
}
