import React from 'react'
import Logo from "../../assets/Registration/UkeyLogo.png"
import { Box } from '@mui/material'
import { keyframes } from '@emotion/react';

const growAnimation = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

function Splash() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",

      }}
    >
      <Box
        component="img"
        src={Logo}
        sx={{
          animation: `${growAnimation} 2s ease-out`,
        }}
        alt="Logo"
      />
    </Box>
  )
}

export default Splash
