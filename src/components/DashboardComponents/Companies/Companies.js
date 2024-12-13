import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import OutlinedCard from "../Card/Card";
import VehicleLogo from "../../../assets/Card/VehicleLogo.png";
import ActiveLogo from "../../../assets/Card/ActiveLogo.png";
import InActiveLogo from "../../../assets/Card/InActiveLogo.png";
import MaintenenceLogo from "../../../assets/Card/MaintenenceLogo.png";
import TableHeader from "../TableHeader/TableHeader";
import VehicleManagmentTableContent from "../Table/CompaniesTableContent";
import CompanyIcon from "../../../assets/Sidebar/CompaniesIconSelected.svg"
import TablePagination from "../Pagination/TablePagination";
import { Typography } from "@mui/material";
import CompaniesTableContent from "../Table/CompaniesTableContent";
import MachineLogsTable from "../Table/MachineLogsTable";

import OrganizationList from "../Table/OrganizationList";


export default function Companies() {
  return (
    <Box sx={{
      flexGrow: 1, position: 'absolute',
      mt: { xs: 5, sm: 5, md: 5, lg: 5 },
      // Adjust padding based on the screen size

      overflow: "none",
      width: { lg: "82%", xs: "100%" },// Prevent overflowing horizontally and vertically

    }} mt={0}>


   
      <Box sx={{ padding: { lg: "1rem 4rem 1rem 1rem", xs: "1rem 1rem 1rem 1rem" }, marginRight: { sm: "2rem", xs: "0rem" }, background: "#FFF", }}>
        <Box sx={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Box sx={{ width: 44, height: 40, background: "#FEF2E5", borderRadius: "0.7rem", display: "flex", justifyContent: "center", alignItems: "center" }}> <img src={CompanyIcon} /> </Box>
          <Typography sx={{ fontFamily: "Poppins", fontSize: "0.8rem", color: "#909097" }}>
            Company
          </Typography>
        </Box>
        <CompaniesTableContent />

        {/* <OrganizationList /> */}

      </Box>


      {/* <TablePagination /> */}
    </Box>
  );
}
