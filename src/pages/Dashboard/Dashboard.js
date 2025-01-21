import React from 'react'
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/LayoutComponents/Navbar/Navbar"
import Sidebar from '../../components/LayoutComponents/Sidebar/Sidebar';

function Dashboard() {
    return (
        <Box display={"flex"} flexDirection={"row"} gap={3} sx={{ background: "#F4F7F7" }}
        >
            <Sidebar />
            <Box flex={10} >
                <Navbar />
                <Outlet />            
            </Box>
        </Box>
    )
}

export default Dashboard
