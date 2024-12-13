export const mainContainer = {
  height: "100vh",
  display: "flex",
  backgroundColor: "white",
  flexDirection: { xs: "column", md: "row" },
};

export const loginLeftContent = {
  width: { xs: "100%" },
  height: { xs: "100%" },
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  // backgroundColor: "red",
};
export const loginRightContent = {
  width: { xs: "100%", md: "50%" },
  height: { xs: "50%", md: "100%" },
  display: { xs: "none", md: "block" },
};

export const loginLeftContentContainer = {
  width: { xs: "100%", sm: "70%" },
  height: { xs: "90vh" },
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "auto",
  // backgroundColor: "red",
};

export const loginLeftContentContainerItemWidth = { width: "80%" };
export const loginRightContentContainerItemWidth = { width: "100%" };
export const LoginForgotPasswordStyles = {
  width: "80%",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
};
export const LoginCheckboxStyle = { padding: "0px", margin: "0px" };
export const LoginButtonStyle = {
  width: "80%",
  height: "51px",
  backgroundColor: "#15294E",
  color: "white",
  marginTop: "16px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#15294E",
  },
};
