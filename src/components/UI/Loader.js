import React from 'react'
import Logo from "../../assets/Registration/UkeyLogo.png"
import { Box, Typography } from '@mui/material'
import CircleSharpIcon from '@mui/icons-material/CircleSharp';



function Loader() {

    const circleCount = 4; // Number of circles
    const baseDelay = 0.2; // Base delay for animation stagger

    const circles = Array.from({ length: circleCount }).map((_, index) => (
        <CircleSharpIcon
            key={index}
            sx={{
                color: "#FE9B10",
                fontSize: "0.6rem",
                animation: "bounce 1s infinite ease-in-out",
                animationDelay: `${index * baseDelay}s`, // Stagger animation
            }}
        />
    ));

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <Box component="img" src={Logo} sx={{ width: 175, }} alt="Logo" />

            <Box sx={{ borderRadius: "50%", width: 90, height: 90, background: "#FEF4EA", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.3rem" }}>
                {circles}
            </Box>


            <Typography sx={{ fontFamily: "Inter", color: "#14181F" }}>
                Please wait ...
            </Typography>
        </Box>
    )
}

export default Loader
