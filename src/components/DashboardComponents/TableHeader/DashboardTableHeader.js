import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import {
  Button,
  Divider,
  IconButton,
  InputAdornment,
  InputBase,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import User from "../../assets/Card/user.png";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Arrowdown from "../../../assets/Card/fi_chevron-down.png";
import CrossIcon from "../../../assets/Table/CrossIcon.png";
import cloudLogo from "../../../assets/Table/cloudLogo.png";
export default function DashboardTableHeader({
  text,
  searchText,
  buttonText,
  trip,
  exportIcon,
  icon,
}) {
  return (
    <Box height={"100%"} width={"100%"}>
      <Card
        variant="outlined"
        sx={{
          border: "none",
          boxShadow: "none",
          height: "100%",
          // backgroundColor: "red",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          // paddingTop: "8px",
        }}
      >
        <React.Fragment>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent={"space-between"}
          >
            <Stack direction={"row"} alignItems={"center"} gap={2} pl={2}>
              <Box
                sx={{
                  width: "2rem",
                  height: "2rem",
                  backgroundColor: "#FFF4F2",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "2px",
                }}
              >
                <img src={icon ? icon : User} height={"16px"} width={"16px"} />
              </Box>

              <Typography
                sx={{
                  fontSize: {
                    xl: "16px",
                    lg: "14px",
                    md: "12px",
                    sm: "12px",
                    xs: "14px",
                  },
                  color: "#5A607F",
                  fontWeight: 400,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {text}
              </Typography>
            </Stack>
            {trip && (
              <Stack direction={"row"} gap={2}>
                <Box>
                  <Paper
                    component="form"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: 317,
                      height: 46,
                      boxShadow: "none",
                      border: "1px solid #E0E0E0",
                    }}
                  >
                    <Stack
                      direction={"row"}
                      p={2}
                      gap={2}
                      alignItems={"center"}
                    >
                      <Box
                        sx={{
                          fontSize: "16px",
                          color: "#5A607F",
                          fontWeight: 500,
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        Total Trips
                      </Box>
                      <Typography
                        sx={{
                          fontSize: "24px",
                          color: "#14181F",
                          fontWeight: 500,
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        212
                      </Typography>
                    </Stack>

                    <Divider
                      sx={{ height: 28, m: 0.5 }}
                      orientation="vertical"
                    />
                    <Stack
                      direction={"row"}
                      p={2}
                      gap={2}
                      alignItems={"center"}
                    >
                      <Box
                        sx={{
                          fontSize: "16px",
                          color: "#5A607F",
                          fontWeight: 500,
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        Active
                      </Box>
                      <Typography
                        sx={{
                          fontSize: "24px",
                          color: "#14181F",
                          fontWeight: 500,
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        210
                      </Typography>
                    </Stack>
                  </Paper>
                </Box>
              </Stack>
            )}
            <Stack
              direction={"row"}
              gap={1}
              mr={{ xs: 0, sm: 2 }}
              my={{ xs: 2, sm: 0 }}
            >
              <Box>
                <TextField
                  placeholder={`Search ${searchText} ,ID`}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ marginRight: 0 }}>
                        <IconButton sx={{ padding: 0 }}>
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: {
                        xs: "38px",
                        sm: "38px",
                        md: "32px",
                        lg: "32px",
                        xl: "38px",
                      }, // Adjust the height as needed
                      fontSize: "12px",
                      width: {
                        lg: "200px",
                        md: "180px",
                        xs: "180px",
                      }, // Responsive width
                      border: "1px solid #E2E8F0",
                    },
                  }}
                />
              </Box>

              <Box>
                <TextField
                  placeholder="Status"
                  variant="outlined"
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" sx={{ marginRight: 0 }}>
                        <IconButton sx={{ padding: 0 }}>
                          {
                            <Box
                              height={"14px"}
                              width={"20px"}
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <img
                                src={Arrowdown}
                                width={"100%"}
                                height={"100%"}
                              />
                            </Box>
                          }
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: {
                        xs: "38px",
                        sm: "38px",
                        md: "32px",
                        lg: "32px",
                        xl: "38px",
                      }, // Adjust the height as needed
                      fontSize: "12px",
                      width: {
                        md: "80px",
                        md: "100px",
                        xs: "120px",
                      }, // Responsive width
                      fontSize: "12px",
                      boxShadow: "none",
                      // Responsive width
                    },
                  }}
                />
              </Box>
              <Box>
                <TextField
                  placeholder="7/6/2024 - 5/8-2024"
                  variant="outlined"
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" sx={{ marginRight: 0 }}>
                        <IconButton sx={{ padding: 0 }}>
                          {
                            <Box
                              height={{ xl: "14px", lg: "12px", md: "10px" }}
                              width={{ xl: "16px", lg: "14px", md: "12px" }}
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <img
                                src={CrossIcon}
                                width={"100%"}
                                height={"100%"}
                              />
                            </Box>
                          }
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: {
                        xs: "38px",
                        sm: "38px",
                        md: "32px",
                        lg: "32px",
                        xl: "38px",
                      }, // Adjust the height as needed
                      fontSize: "12px",
                      width: {
                        md: "130px",
                        md: "150px",
                        xs: "180px",
                      }, // Responsive width
                      fontSize: "12px",
                      boxShadow: "none",
                    },
                  }}
                />
              </Box>

              {/* {exportIcon && (
                <Button
                  variant="contained"
                  sx={{
                    marginRight: "15px",
                    marginLeft: "30px",
                    width: "160px",
                    height: {
                      sm: "20px",
                      md: "20px",
                      lg: "20px",
                      xl: "20px",
                    },
                    backgroundColor: "white",
                    color: "#344054",
                    textTransform: "none",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    // paddingRight: "25px",
                    gap: "8px", // spacing between icon and text
                    "&:hover": {
                      backgroundColor: "white",
                    },
                  }}
                >
                  <img src={cloudLogo} width={"20px"} height={"20px"} />
                  {"Export"}
                </Button>
              )} */}
            </Stack>
          </Stack>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            pl={{ md: 7, sm: 2, xs: 0 }}
            my={{ xs: 2, md: 0 }}
          >
            <Stack direction={"row"} gap={2}>
              <Box>
                <Paper
                  component="form"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: {
                      xs: "350px",
                      sm: "400px",
                      md: "400px",
                      lg: "420px",
                      xl: "420px",
                    },
                    height: {
                      sm: "42px",
                      md: "30px",
                      lg: "35px",
                      xl: "42px",
                    },
                    boxShadow: "none",
                    border: "1px solid #E0E0E0",
                  }}
                >
                  <Stack
                    direction={"row"}
                    pl={2}
                    pr={2}
                    gap={2}
                    alignItems={"center"}
                  >
                    <Box
                      sx={{
                        fontSize: "16px",
                        color: "#5A607F",
                        fontWeight: 500,
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      Total Trips
                    </Box>
                    <Typography
                      sx={{
                        fontSize: {
                          sm: "20px",
                          md: "18px",
                          lg: "21px",
                          xl: "24px",
                        },
                        color: "#14181F",
                        fontWeight: 500,
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      212
                    </Typography>
                  </Stack>

                  <Divider
                    sx={{ height: "29px", m: 0.5 }}
                    orientation="vertical"
                  />
                  <Stack
                    direction={"row"}
                    pl={2}
                    pr={2}
                    gap={2}
                    alignItems={"center"}
                  >
                    <Box
                      sx={{
                        fontSize: "16px",
                        color: "#5A607F",
                        fontWeight: 500,
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      Active
                    </Box>
                    <Typography
                      sx={{
                        fontSize: {
                          sm: "20px",
                          md: "18px",
                          lg: "21px",
                          xl: "24px",
                        },
                        color: "#14181F",
                        fontWeight: 500,
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      210
                    </Typography>
                  </Stack>
                  <Divider
                    sx={{ height: "19px", m: 0.5 }}
                    orientation="vertical"
                  />
                  <Stack
                    direction={"row"}
                    pl={2}
                    gap={{ xs: 1, sm: 2 }}
                    alignItems={"center"}
                  >
                    <Box
                      sx={{
                        fontSize: "16px",
                        color: "#5A607F",
                        fontWeight: 500,
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      --
                    </Box>
                    <Typography
                      sx={{
                        fontSize: {
                          xs: "8px", // Extra small screens
                          sm: "10px", // Small screens
                          md: "16px", // Medium screens
                          lg: "20px", // Large screens
                          xl: "24px", // Extra large screens
                        },
                        color: "#14181F",
                        fontWeight: 500,
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      --
                    </Typography>
                  </Stack>
                </Paper>
              </Box>
            </Stack>
            <Button
              variant="contained"
              sx={{
                marginRight: "15px",
                marginLeft: "30px",
                width: "105px",
                height: {
                  sm: "42px",
                  md: "30px",
                  lg: "35px",
                  xl: "42px",
                },
                backgroundColor: "white",
                color: "#344054",
                textTransform: "none",
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                paddingRight: "25px",
                boxShadow: "none",
                border: "1px solid #D0D5DD",
                gap: "8px", // spacing between icon and text
                "&:hover": {
                  backgroundColor: "white",
                },
              }}
            >
              <img src={cloudLogo} width={"20px"} height={"20px"} />
              {"Export"}
            </Button>
          </Stack>
        </React.Fragment>
      </Card>
    </Box>
  );
}
