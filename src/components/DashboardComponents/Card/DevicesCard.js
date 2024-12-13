import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { Divider, Paper, Stack } from "@mui/material";
import User from "../../../assets/Card/user.png";

export default function DevicesCard({
  icon,
  leftContent,
  rightContent,
  devicesText,
  devicesValue,
}) {
  return (
    <Paper
      sx={{
        paddingX: "1em",
        minWidth: "12em",
        paddingTop: "1em",
        paddingBottom: "0.4em",
      }}
    >
      <Stack direction={"row"} alignItems={"start"} pb={"0.5em"} gap={"1em"}>
        <Box
          sx={{
            width: "2.75rem",
            height: "2.5rem",
            backgroundColor: "#FFF4F2",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "2px",
          }}
        >
          <Box width="1.25rem" height="1.375rem">
            <img src={icon ? icon : User} height={"100%"} width={"100%"} />
          </Box>
        </Box>
        <Stack>
          <Typography
            sx={{
              fontSize: "1rem",
              color: "#5A607F",
              fontWeight: 400,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {devicesText}
          </Typography>
          <Typography
            sx={{
              fontSize: "1.5rem",
              color: "#2A3547",
              fontWeight: 600,
              fontFamily: "Plus Jakarta Sans, sans-serif",
            }}
          >
            {devicesValue}
          </Typography>
        </Stack>
      </Stack>
      <Box>
        <Divider
          orientation="horizontal"
          variant="middle"
          flexItem
          sx={{ mx: "0.4em" }}
        />
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          pl={2}
          pr={2}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "0.8rem",
                color: "#8B8D97",
                fontWeight: 400,
                fontFamily: "Inter, sans-serif",
              }}
            >
              {leftContent && leftContent.text}
            </Typography>
            <Typography
              sx={{
                fontSize: "1.1rem",
                color: "#45464E",
                fontWeight: 500,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {leftContent && leftContent.value}
            </Typography>
          </Box>

          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ mx: "0.4em" }}
          />
          <Box>
            <Typography
              sx={{
                fontSize: "0.8rem",
                color: "#8B8D97",
                fontWeight: 400,
                fontFamily: "Inter, sans-serif",
              }}
            >
              {rightContent && rightContent.text}
            </Typography>
            <Typography
              sx={{
                fontSize: "1.1rem",
                color: "#45464E",
                fontWeight: 500,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {rightContent && rightContent.value}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}
