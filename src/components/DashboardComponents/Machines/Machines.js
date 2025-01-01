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

import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add"; // If using Material-UI

import { useUser } from "../../../Context/UserContext";

import { machineUI } from "../../UI/Main";

export default function Machines() {
  const { user, updateUserData } = useUser(); // Destructure user data from context

  console.log("here is the user in the machine component <><><>", user);

  const navigate = useNavigate(); // Initialize it inside your component

  const route = "add-machine"; // Define it if it's dynamic

  const buttonText = "Add Here"; // Or dynamically set based on props/state

  return (
    <Box
      sx={{
        ...machineUI.machinemainBox
      }}
    >
      <Box
        sx={{
          ...machineUI.machineHeaderBox
        }}
      >
        <Box sx={{ ...machineUI.machinethirdBox }}>
          <Box
            sx={{
              ...machineUI.machine4thBoxHeaderItems
            }}
          >
            <Box
              sx={{
                ...machineUI.machine5thBox
              }}
            >
              <img src={MachinesIcon} alt="Machines Icon" />
            </Box>

            <Typography
              sx={{
                ...machineUI.machineTypography
              }}
            >
              Machines
            </Typography>

            {(user.role === "superAdmin" || user.role === "admin") && (
              <Button
                variant="contained"
                sx={{
                  ...machineUI.machineButton
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
