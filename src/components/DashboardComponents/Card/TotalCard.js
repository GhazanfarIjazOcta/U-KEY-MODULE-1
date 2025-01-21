import { Box, Divider, Typography } from "@mui/material";
import React from "react";
import CompaniesIcon from "../../../assets/Sidebar/CompaniesIconSelected.svg";
import MachinesIcon from "../../../assets/Sidebar/MachinesIconSelected.svg";
import UsersIcon from "../../../assets/Sidebar/UserIconSelected.svg";

function TotalCard({
  icon,
  title,
  totalNumber,
  activeNumber,
  inactiveNumber,
  maintenanceNumber
}) {
  const iconMap = {
    CompaniesIcon: CompaniesIcon,
    MachinesIcon: MachinesIcon,
    UsersIcon: UsersIcon
  };

  // Get the correct icon path based on the icon prop
  const iconSrc = iconMap[icon];

  return (
    <Box sx={{ background: "#FFF", width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          gap: "1.5rem",
          alignItems: { sm: "start", xs: "center" },
          justifyContent: "space-between",
          marginBottom: "0rem",
          padding: "1rem 2rem 0.5rem 1rem",
          flexFlow: "wrap"
        }}
      >
        <Box sx={{ display: "flex", gap: "1.5rem", alignItems: "start" }}>
          <Box
            sx={{
              width: 44,
              height: 40,
              background: "#FEF2E5",
              borderRadius: "0.7rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <img src={iconSrc} />
          </Box>
          <Box pt={"0.4rem"}>
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontSize: "0.8rem",
                color: "#909097"
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontSize: "2rem",
                color: "#040219",
                fontWeight: 600
              }}
            >
              {totalNumber}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: "1rem",
            flexFlow: "wrap",
            alignItems: "center",
            justifyContent: "center",
            width: "100%"
          }}
        >
          <Typography
            sx={{ color: "#68676E", fontFamily: "Poppins", fontSize: "0.8rem" }}
          >
            Active
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontSize: "1.5rem",
              color: "#040219",
              fontWeight: 500
            }}
          >
            {activeNumber}
          </Typography>
          <Divider
            orientation="vertical"
            sx={{ border: "1px solid #E2E2E2", height: "2rem" }}
          />
          <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Typography
              sx={{
                color: "#68676E",
                fontFamily: "Poppins",
                fontSize: "0.8rem"
              }}
            >
              Inactive
            </Typography>
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontSize: "1.5rem",
                color: "#040219",
                fontWeight: 500
              }}
            >
              {inactiveNumber}
            </Typography>
          </Box>

          {/* {maintenanceNumber &&
                        <>
                            <Divider orientation="vertical" sx={{ border: "1px solid #E2E2E2", height: "2rem" }} />
                            <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                                <Typography sx={{ color: "#68676E", fontFamily: "Poppins", fontSize: "0.8rem" }}>
                                    Under Maintenance
                                </Typography>
                                <Typography sx={{ fontFamily: "Poppins", fontSize: "1.5rem", color: "#040219", fontWeight: 500 }}>
                                    {maintenanceNumber}
                                </Typography>
                            </Box>

                        </>
                    } */}
        </Box>
      </Box>
    </Box>
  );
}

export default TotalCard;
