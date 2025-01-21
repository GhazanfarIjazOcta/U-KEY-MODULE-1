import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { Button, Divider, Grid, Stack, Typography } from "@mui/material";
import JobSiteIcon from "../../../assets/Sidebar/JobSitesIconSelected.svg";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";

export default function DashboardLocationCard({}) {
  const navigate = useNavigate();

  return (
    <Box sx={{ mt: { xs: 1, md: 0 } }}>
      <Card
        variant="outlined"
        sx={{
          border: "none",
          boxShadow: "none",
          height: "420px"
        }}
      >
        <>
          <Box
            sx={{
              display: "flex",
              gap: "1.5rem",
              alignItems: "start",
              justifyContent: "space-between",
              marginBottom: "0rem",
              padding: "1rem 2rem 0.5rem 1rem",
              flexFlow: "wrap"
            }}
          >
            <Box sx={{ display: "flex", gap: "1.5rem", alignItems: "start" }}>
              <Box
                sx={{
                  width: 44,
                  height: 40,
                  background: "#FEF2E5",
                  borderRadius: "0.7rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                {" "}
                <img src={JobSiteIcon} />{" "}
              </Box>
              <Box pt={"0.4rem"}>
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: "0.8rem",
                    color: "#909097"
                  }}
                >
                  Job sites overview
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: "2rem",
                    color: "#040219",
                    fontWeight: 600
                  }}
                >
                  06
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: "2rem",
                flexFlow: "wrap",
                alignItems: "center"
              }}
            >
              <Typography
                sx={{
                  color: "#68676E",
                  fontFamily: "Poppins",
                  fontSize: "0.8rem"
                }}
              >
                Active
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontSize: "1.5rem",
                  color: "#040219",
                  fontWeight: 500
                }}
              >
                13
              </Typography>
              <Divider
                orientation="vertical"
                sx={{ border: "1px solid #E2E2E2", height: "2rem" }}
              />
              <Typography
                sx={{
                  color: "#68676E",
                  fontFamily: "Poppins",
                  fontSize: "0.8rem"
                }}
              >
                Inactive
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontSize: "1.5rem",
                  color: "#040219",
                  fontWeight: 500
                }}
              >
                13
              </Typography>
            </Box>

            <Button
              variant="text"
              sx={{
                color: "#5A607F",
                textTransform: "none",
                fontFamily: "Inter",
                fontSize: "0.8rem",
                display: "flex",
                alignItems: "center",
                "&:hover": {
                  backgroundColor: ""
                }
              }}
              onClick={() => navigate("job-sites")}
            >
              sites
              <ExpandMoreIcon
                sx={{ fontSize: "1.5rem", marginLeft: "0.3rem" }}
              />
            </Button>
          </Box>

          <Box height={{ md: "300px", xs: "250px" }} pl={"7px"} pr={"7px"}>
            <iframe
              width={"100%"}
              height={"100%"}
              borderRadius="0px"
              frameBorder="0"
              style={{ border: 0, borderRadius: "0px" }}
              // src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d33.6074086!2d73.100091!3dYOUR_ZOOM_LEVEL!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfeb96a77dbcff%3A0x936bce527a1d6838!2sOctathorn+Technologies!5e0!3m2!1sen!2sus!4vYOUR_EMBED_API_KEY"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d330400.5089714776!2d-118.243683!3d34.052235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c5d4b2f1f7db%3A0x8c4f2ef328e24f6c!2sLos+Angeles%2C+CA!5e0!3m2!1sen!2sus!4vYOUR_EMBED_API_KEY"
              allowFullScreen
              title="Google Map"
            ></iframe>
          </Box>
        </>
      </Card>
    </Box>
  );
}
