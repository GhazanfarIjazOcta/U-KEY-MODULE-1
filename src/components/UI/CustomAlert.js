import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import useMediaQuery from "@mui/material/useMediaQuery";

const CustomAlert = ({
  open,
  onClose,
  severity,
  message,
  duration = 2200,
  positionVertical = "bottom",
  positionHorizontal = "right",
}) => {
  // Check if the screen width is mobile-sized (600px or less)
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{
        vertical: isMobile ? "top" : positionVertical,
        horizontal: isMobile ? "center" : positionHorizontal,
      }}
      sx={{
        top: isMobile ? "10px" : "auto", // Adds spacing from the top on mobile
        "& .MuiAlert-root": {
          borderRadius: isMobile ? "10px" : "4px", // Rounded corners on mobile
          boxShadow: isMobile ? "0px 4px 20px rgba(0, 0, 0, 0.3)" : "none", // Shadow effect on mobile
          width: isMobile ? "90%" : "auto", // Makes alert width more adaptable on mobile
        },
      }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomAlert;
