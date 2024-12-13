export const firstContainer = {
  display: { xmd: "flex", xs: "none" },
  flexDirection: "column",
  alignItems: "center",
  // minWidth: "200px",
};

export const logoStyle = {
  width: "94%",
  height: "12vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
export const listContainer = {
  // marginTop: "7%",
  width: "94%",
  height: "88vh",
  borderRadius: "10px",
  backgroundColor: "#15294E",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  minWidth: "180px",
};
export const listStyle = {
  width: "90%",
};
export const listItemStyles = {
  color: "white",
  padding: "8px",
  cursor: "pointer",
  borderRadius: "0.5rem",
  marginTop: "0.4rem"
  // marginBottom: "10px",
};
export const listItemIconStyle = { color: "white", minWidth: "35px" };
export const logoutButtonContainer = {
  width: "100%",
  marginBottom: "50px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
export const lineStyle = {
  width: "80%",
  height: "2px",
  backgroundColor: "#FFF",
  opacity: "43%",
  marginBottom: "2em", // Space between the line and the button
};
export const logoutButtonStyle = {
  width: "80%",
  height: "2.5rem",
  backgroundColor: "white",
  color: "black",
  "&:hover": {
    backgroundColor: "lightgray",
  },
};

export const navbarContainerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: { xs: "auto", sm: "1.5rem" }, // Responsive height
  backgroundColor: "white",
  padding: { xs: "16px 16px", sm: "24px" }, // Responsive padding
  flexDirection: { xs: "column", sm: "row" }, // Column direction on small screens
  gap: 2,
};

export const leftContentStyle = {
  display: "flex",
  gap: { xs: "16px", sm: "30px" },
  flexDirection: { xs: "column", sm: "row" },
  alignItems: { xs: "flex-start", sm: "center" },
};

export const textFieldContainerStyle = {
  backgroundColor: "white",
};
export const rightContentStyle = {
  display: "flex",
  gap: { xs: "10px", sm: "20px" },
  flexDirection: { xs: "column", sm: "row" },
  alignItems: { xs: "flex-start", sm: "center" },
};

export const messageBoxStyle = {
  width: "8em", // Responsive width
  height: "2.5rem",
  backgroundColor: "#F38712",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.7em",
};

export const userInfoStyle = {
  display: "flex",
  width: "10rem",
  height: "2.5em",
  gap: "0.9rem",
};
export const userNameStyle = { display: "flex", flexDirection: "column", };
