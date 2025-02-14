// REACT IMPORTS
import * as React from "react";

// MUI IMPORTS
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import {
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  useMediaQuery
} from "@mui/material";
import User from "../../../assets/Card/user.png";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Arrowdown from "../../../assets/Card/fi_chevron-down.png";
import CrossIcon from "../../../assets/Table/CrossIcon.png";
import cloudLogo from "../../../assets/Table/cloudLogo.png";
import { useNavigate } from "react-router-dom";

export default function TableHeader({
  text,
  searchText,
  buttonText,
  trip,
  exportIcon,
  icon,
  route
}) {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:980px)");

  return (
    <Box sx={{ width: "99%", overflow: "none" }} mt={2}>
      <Card
        variant="outlined"
        sx={{
          border: "none",
          boxShadow: "none",
          padding: isMobile ? "12px" : "24px",
          height: isMobile ? "auto" : "4vh"
        }}
      >
        <React.Fragment>
          <Stack
            direction={isMobile ? "column" : "row"}
            justifyContent={isMobile ? "center" : "space-between"}
            gap={isMobile ? 2 : 0}
          >
            <Stack
              direction={isMobile ? "column" : "row"}
              alignItems={isMobile ? "flex-start" : "center"}
              gap={2}
            >
              <Box
                sx={{
                  width: isMobile ? "100%" : "44%",
                  height: "40px",
                  backgroundColor: "#FFF4F2",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "2px"
                }}
              >
                <img src={icon ? icon : User} height={"13px"} width={"20px"} />
              </Box>

              <Typography
                sx={{
                  fontSize: isMobile ? "12px" : "14px",
                  color: "#5A607F",
                  fontWeight: 400,
                  fontFamily: "Inter, sans-serif"
                }}
              >
                {text}
              </Typography>
            </Stack>

            {trip && (
              <Stack direction={isMobile ? "column" : "row"} gap={2}>
                <Box>
                  <Paper
                    component="form"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: isMobile ? "100%" : 317,
                      height: 46,
                      boxShadow: "none",
                      border: "1px solid #E0E0E0"
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
                          fontFamily: "Inter, sans-serif"
                        }}
                      >
                        Total Trips
                      </Box>
                      <Typography
                        sx={{
                          fontSize: "24px",
                          color: "#14181F",
                          fontWeight: 500,
                          fontFamily: "Poppins, sans-serif"
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
                          fontFamily: "Inter, sans-serif"
                        }}
                      >
                        Active
                      </Box>
                      <Typography
                        sx={{
                          fontSize: "24px",
                          color: "#14181F",
                          fontWeight: 500,
                          fontFamily: "Poppins, sans-serif"
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
              direction={isMobile ? "column" : "row"}
              gap={2}
              alignItems={isMobile ? "flex-start" : "center"}
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
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: "38px",
                      width: isMobile ? "100%" : "200px"
                    }
                  }}
                />
              </Box>

              <Box>
                <TextField
                  placeholder="Role"
                  variant="outlined"
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" sx={{ marginRight: 0 }}>
                        <IconButton sx={{ padding: 0 }}>
                          {
                            <img
                              src={Arrowdown}
                              height={"16px"}
                              width={"20px"}
                            />
                          }
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: "38px",
                      width: isMobile ? "100%" : "110px"
                    }
                  }}
                />
              </Box>

              {!exportIcon && (
                <Button
                  variant="contained"
                  sx={{
                    marginRight: isMobile ? "0" : "15px",
                    marginLeft: isMobile ? "0" : "30px",
                    width: isMobile ? "100%" : "150px",
                    height: "38px",
                    backgroundColor: "#15294E",
                    color: "white",
                    textTransform: "none",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    paddingRight: "25px",
                    gap: "3px",
                    "&:hover": {
                      backgroundColor: "#15294E"
                    }
                  }}
                  onClick={() => navigate(route)}
                >
                  <AddIcon />
                  {buttonText}
                </Button>
              )}

              {exportIcon && (
                <Button
                  variant="contained"
                  sx={{
                    marginRight: isMobile ? "0" : "15px",
                    marginLeft: isMobile ? "0" : "30px",
                    width: isMobile ? "100%" : "160px",
                    height: "42px",
                    backgroundColor: "white",
                    color: "#344054",
                    textTransform: "none",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    paddingRight: "25px",
                    gap: "8px",
                    "&:hover": {
                      backgroundColor: "white"
                    }
                  }}
                >
                  <img src={cloudLogo} width={"20px"} height={"20px"} />
                  {"Export"}
                </Button>
              )}
            </Stack>
          </Stack>
        </React.Fragment>
      </Card>
    </Box>
  );
}
