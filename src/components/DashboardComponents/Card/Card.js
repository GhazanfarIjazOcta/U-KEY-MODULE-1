import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { Paper, Stack } from "@mui/material";
import Arrowdown from "../../../assets/Card/fi_chevron-down.png";

export default function OutlinedCard({
  text,
  icon,
  secText,
  consumptionColor,
  costColor,
}) {
  return (
    <Paper sx={{
      height: "100%",
      // border: "1px ",  // Simple border
      // boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",  // Light shadow
      // borderBottom: "2px solid rgba(0, 0, 0, 0.3)",  // Slightly darker bottom border
      // borderRadius: "4px",  // Optional: small rounding of corners
    }}>
      <Card
        variant="outlined"
        sx={{
          border: "none",
          boxShadow: "none",
          // width: "100%",

          height: "100%",
          // backgroundColor: "red",
        }}
      >
        <React.Fragment>
          <Stack direction={"column"} mt={3} gap={3} ml={3} mr={3}>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Stack direction={"row"} alignItems={"center"} gap={1}>
                {consumptionColor && (
                  <Box
                    sx={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: `${consumptionColor}`,
                    }}
                  ></Box>
                )}
                {costColor && (
                  <Box
                    sx={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: `${costColor}`,
                    }}
                  ></Box>
                )}
                <Typography
                  sx={{
                    fontSize: "16px",
                    color: "#5A607F",
                    fontWeight: 400,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {text}
                </Typography>
              </Stack>
              <Stack direction={"row"} alignItems={"center"} gap={"7px"}>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "#AEAEAE",
                    fontWeight: 400,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Today
                </Typography>
                <img src={Arrowdown} height={"16px"} width={"16px"} />
              </Stack>
            </Stack>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Box
                sx={{
                  width: "44px",
                  height: "40px",
                  backgroundColor: "#FFF4F2",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "2px",
                }}
              >
                <img src={icon} height={"16px"} width={"16px"} />
              </Box>
              <Typography
                sx={{
                  fontSize: "64px",
                  color: "#45464E",
                  fontWeight: 500,
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                {secText ? secText : "0"}
              </Typography>
            </Stack>
          </Stack>
        </React.Fragment>
      </Card>
    </Paper>
  );
}
