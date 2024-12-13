import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import OutlinedCard from "../Card/Card";
import ActiveLogo from "../../../assets/Card/ActiveLogo.png";
import InActiveLogo from "../../../assets/Card/InActiveLogo.png";
import JobSitesIcon from "../../../assets/Sidebar/JobSitesIconSelected.svg";
import TableHeader from "../TableHeader/TableHeader";
import TablePagination from "../Pagination/TablePagination";
import { Button, Typography } from "@mui/material";
import OperatorsTableContent from "../Table/OperatorsTableContent";
import JobCompanyLocationCard from "../Card/JobCompanyLocationCard";
import { useNavigate } from "react-router-dom";

export default function JobSites() {
    const navigate = useNavigate(); // Initialize it inside your component

    const route = 'add-jobsites'; // Define it if it's dynamic

    return (
        <Box sx={{
            position: "absolute",
            mt: { xs: 5, sm: 5, md: 5, lg: 5 },
            // Adjust padding based on the screen size

            overflow: "none", // Prevent overflowing horizontally and vertically
            width: { lg: "82%", xs: "auto" }, // Ensure it takes full width

        }} >



            <Box sx={{ padding: { lg: "1rem 4rem 1rem 1rem", xs: "1rem 1rem 1rem 1rem" }, marginRight: { sm: "2rem", xs: "0rem" }, background: "#FFF", }}>
                <Box sx={{ display: "flex", gap: "1.5rem", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                        <Box sx={{ width: 44, height: 40, background: "#FEF2E5", borderRadius: "0.7rem", display: "flex", justifyContent: "center", alignItems: "center" }}> <img src={JobSitesIcon} /> </Box>
                        <Typography sx={{ fontFamily: "Poppins", fontSize: "0.8rem", color: "#909097" }}>
                            Job Sites
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        sx={{
                            height: "38px",
                            backgroundColor: "#15294E",
                            color: "white",
                            textTransform: "none",
                            display: "flex",
                            alignItems: "center",
                            "&:hover": {
                                backgroundColor: "#15294E",
                            },
                        }}
                   onClick={() => navigate(route)}
                    >
                        + Add Job Site here
                    </Button>
                </Box>


                <Box sx={{ display: "flex", flexFlow: "wrap", padding: "2rem 0rem 2rem 0rem", gap: "1.5rem", justifyContent: { sm: "start", xs: "center" } }}>
                    <JobCompanyLocationCard />
                    

                </Box>
            </Box>



        </Box>
    );
}
