import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { Divider, Paper, Stack } from "@mui/material";
import Arrowdown from "../../../assets/Card/fi_chevron-down.png";
import User from "../../../assets/Card/user.png";

export default function DashboardCard({
  text,
  icon,
  secText,
  leftContent,
  middleContent,
  rightContent,
}) {
  return (
    <Paper
      sx={{
        padding: "0.6em 1rem",
        minWidth: "12rem",
      }}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        pb={"1.5em"}
      >
        <Stack direction={"row"} alignItems={"center"} gap={"0.3em"}>
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
          <Typography
            sx={{
              fontSize: "0.8rem",
              color: "#5A607F",
              fontWeight: 400,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {text && text}
          </Typography>
        </Stack>
        <Typography
          sx={{
            fontSize: "2rem",
            color: "#45464E",
            fontWeight: 500,
            fontFamily: "Poppins, sans-serif",
            mx: "0.2em",
          }}
        >
          {secText ? secText : "09"}
        </Typography>
        <Stack direction={"row"} gap="0.3em">
          <Typography
            sx={{
              fontSize: "0.7rem",
              color: "#AEAEAE",
              fontWeight: 400,
              fontFamily: "Inter, sans-serif",
            }}
          >
            Today
          </Typography>
          <Box width="1rem" height="1rem">
            <img src={Arrowdown} height={"100%"} width={"100%"} />
          </Box>
        </Stack>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Stack direction={"column"}>
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
        </Stack>
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{ mx: "0.4em" }}
        />
        <Stack direction={"column"}>
          <Typography
            sx={{
              fontSize: "0.8rem",
              color: "#8B8D97",
              fontWeight: 400,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {middleContent && middleContent.text}
          </Typography>
          <Typography
            sx={{
              fontSize: "1.1rem",
              color: "#45464E",
              fontWeight: 500,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            {middleContent && middleContent.value}
          </Typography>
        </Stack>
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{ mx: "0.4em" }}
        />
        <Stack direction={"column"}>
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
        </Stack>
      </Stack>
    </Paper>
  );
}
