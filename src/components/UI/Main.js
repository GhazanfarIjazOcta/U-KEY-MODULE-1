
import LoginImg from "../../assets/Registration/Login.png"

//=====================================================================================

export const LoginUI = {

loginmainBox : {

  backgroundImage: `url(${LoginImg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  height: "100vh",
  width: "100vw",

  
},

loginSecondBox : {
  width: { lg: "45%", md: "50%", sm: "100%", xs: "100%" }, opacity: "95%", background: "#F5F7F9", height: "100vh" 
 
},

loginButton: {

  width: { xs: "80%", sm: "60%" },
  maxWidth: "370px",
  height: "3.1rem",
  backgroundColor: "#212122",
  color: "white",
  marginTop: "1.8em",
  textTransform: "none",
}



}


export const SignupUI = {

  signupMainBox : {

    backgroundImage: `url(${LoginImg})`,
    backgroundSize: "cover",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw"
  },

  signupSecondWhiteBox : {

    width: { xs: "90%", sm: "600px", md: "700px" }, // Adjust width
    maxWidth: "100%", // Prevent overflow
    padding: "2rem",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    position: { xs: "static", md: "absolute" }, // Change position for smaller screens
    right: { xs: "auto", md: "0px" },
    height: { xs: "auto", md: "90vh", lg: "100vh" }, // Ensure height adjusts dynamically
    maxHeight: "100vh", // Prevent exceeding the viewport
    overflowY: "auto", // Allow scrolling for content overflow
    boxSizing: "border-box" // Ensures padding doesn't add to the box size
  },

  signupThirdBox: {

    width: { xs: "100%", sm: "400px" },
    margin: "0 auto",
    textAlign: "center"
  },

  signupTypography: {
    fontWeight: 600,
      fontSize: "1.675rem",
    fontFamily: "Inter",
    color: "#14181F"
  },

  signupRegisterButton : {
    mt: 2,
    backgroundColor: "#14181F",
    "&:hover": {
      backgroundColor: "#0F1419" // Hover color
    }
  }
}




export const navbarUI = {

  navbarMainBox: {
    color: "black",
    // width: { xs: "98vw", lg: "79vw" },
    width: "100%",
    minHeight: "5.4rem",
    display: "flex",
    justifyContent: "space-between",
    minWidth: "320px",
    zIndex: 4,
    position: "sticky",
    top: 0, // Align to the top of the viewport
    left: 0, // Align to the left of the viewport
    background: "#F4F7F7"
  },

  navbarSecondBox : {

    display: { lg: "block" },
    fontFamily: "Poppins",
    fontWeight: 500,
    fontSize: { sm: "1.5rem", xs: "1rem" },
    color: "#202020",
  }

}

export const sidebarUI = {

  sidebarSecondBox: {
    width: "16.5vw",
    //   backgroundColor: "red",
    position: "fixed", // Make the sidebar fixed
    top: 0, // Align to the top of the viewport
    left: 0, // Align to the left of the viewport
    zIndex: 1000, // Ensure it stays above other elements
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sidebarFourthColorBox : {

    width: "96%",
    height: "86vh",
    minWidth: "220px",
    minHeight: "510px",
    borderRadius: "10px",
    backgroundColor: "#15294E",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center"
  },

  mobileSidebarMainBox: {

    width: { xs: "50vw", sm: "40vw", md: "20vw" },
    maxHeight: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
    backgroundColor: "#15294E",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "clamp(0.5rem, 1vw, 1rem)",
    boxShadow: "2px 0 5px rgba(0,0,0,0.5)",
    overflowY: "auto",
    overflowX: "hidden"
  },

  sidebarButton: {

    width: "80%",
    height: "3rem",
    fontFamily: "Poppins",
    backgroundColor: "white",
    textTransform: "none",
    marginBottom: "1.5rem",
    color: "black",
    "&:hover": {
      backgroundColor: "lightgray"
    }
  },
  mobileSideBarButton : {

    backgroundColor: "white",
    textTransform: "none",
    color: "black",
    "&:hover": { backgroundColor: "lightgray" },
    fontSize: "clamp(0.7rem, 1.2vw, 0.9rem)",
    padding: "clamp(0.4rem, 0.8vw, 0.8rem)"
  }
}

export const dashboardStylesAdmin = {

mainbox: {

  flexGrow: 1, position: 'absolute',
  mt: { xs: 0, sm: 0, md: 0, lg: 5 },
  overflowY: "auto",
  height: "85vh",
  background: "#F4F7F7",
  gap: "0.5rem",
  width: { lg: "82%", xs: "100%" },// Prevent overflowing horizontally and vertically
}

};


export const userManagement ={



mainboxUserManagement: {
  position: "absolute",
  mt: { xs: 13, sm: 12, md: 12, lg: 12 },
  // Adjust padding based on the screen size
  px: { xs: 2, sm: 2, md: 2, lg: 0 }, // Remove padding at larger screens where sidebar becomes toggle
  ml: { xs: 0, sm: 0, md: 0, lg: 0, xl: 0 }, // Leave space for the sidebar on larger screens
  overflow: "none", // Prevent overflowing horizontally and vertically
  width: "82%", // Ensure it takes full width
  // maxWidth: "1200px", // Set a max width as needed
},

usermanagementTablecontainer: {

  borderRadius: 0,
  elevation: 0,
  borderTop: "1px solid #EAECF0",
  height: "54vh",
  width: "99%",
  overflow: "none"

}

}


export const machineUI = {

  machinemainBox:{

    position: "absolute",
    mt: { xs: 5, sm: 5, md: 5, lg: 5 },
    // Adjust padding based on the screen size

    overflow: "none", // Prevent overflowing horizontally and vertically
    width: { lg: "82%", xs: "100%" } // Ensure it takes full width

  },

  machineHeaderBox : {

    padding: { lg: "1rem 4rem 1rem 1rem", xs: "1rem 1rem 1rem 1rem" },
    marginRight: { sm: "2rem", xs: "0rem" },
    background: "#FFF"
  },

  machinethirdBox : {
    display: "flex", gap: "1.5rem", alignItems: "center"
  },

  machine4thBoxHeaderItems:{

    display: "flex",
    alignItems: "center",
    justifyContent: "space-between", // Ensures space between the Box and Button
    width: "100%" // Adjust this based on parent container size
  },

  machine5thBox :{

    width: 44,
    height: 40,
    background: "#FEF2E5",
    borderRadius: "0.7rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  machineTypography : {

    fontFamily: "Poppins",
                fontSize: "0.8rem",
                color: "#909097",
                marginLeft: "10px" // Adjust spacing between icon and text
  },

  machineButton :{

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
      backgroundColor: "#15294E"
    }
  },

//-----

machineTableContent:{
  borderRadius: 0,
  elevation: 0,
  borderTop: "1px solid #EAECF0",
  marginTop: "2.5rem",
  background: "#FFF",
  height: "60%"
},

machineTabletypography1 :{

  color: "#F38712",
  fontSize: "0.9rem",
  fontFamily: "Inter",
  textDecoration: "underline",
  cursor: "pointer",
  whiteSpace: "nowrap"
}



}


//====================================================================================



