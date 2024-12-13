import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { loginLeftContentContainerItemWidth } from "../UI/styles/Login";
import Arrowdown from "../../assets/Card/fi_chevron-down.png";
import { addDriverStyles } from "../UI/styles/Main";

function AddDriver() {
  return (
    <Paper sx={addDriverStyles.mainContainer}>
      <Box sx={addDriverStyles.container} pl={8} mt={12}>
        <Box>
          <Box sx={loginLeftContentContainerItemWidth}>
            <Typography
              variant="subtitle1"
              mt={4}
              mb={1}
              style={addDriverStyles.label}
            >
              Driver Id
            </Typography>
            <TextField sx={addDriverStyles.textField} label="Enter Driver ID" />
          </Box>
          <Box sx={loginLeftContentContainerItemWidth}>
            <Typography
              variant="subtitle1"
              mt={3}
              mb={1}
              style={addDriverStyles.label}
            >
              Name
            </Typography>
            <TextField sx={addDriverStyles.textField} label="Enter Name" />
          </Box>
          <Box sx={loginLeftContentContainerItemWidth}>
            <Typography
              variant="subtitle1"
              mt={3}
              mb={1}
              style={addDriverStyles.label}
            >
              Email
            </Typography>
            <TextField sx={addDriverStyles.textField} label="Enter Email" />
          </Box>
          <Box sx={loginLeftContentContainerItemWidth}>
            <Typography
              variant="subtitle1"
              mt={3}
              mb={1}
              style={addDriverStyles.label}
            >
              Phone number
            </Typography>
            <TextField
              sx={addDriverStyles.textField}
              label="Enter Phone number"
            />
          </Box>
          <Box sx={loginLeftContentContainerItemWidth}>
            <Typography
              variant="subtitle1"
              mt={3}
              mb={1}
              style={addDriverStyles.label}
            >
              Vehicle Assigned
            </Typography>
            <TextField
              sx={addDriverStyles.textField}
              label="Name of the Vehicle Assigned"
            />
          </Box>
          <Box sx={loginLeftContentContainerItemWidth}>
            <Typography
              variant="subtitle1"
              mt={3}
              mb={1}
              style={addDriverStyles.label}
            >
              Status
            </Typography>
            <TextField
              placeholder="Select Status"
              variant="outlined"
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ marginRight: 0 }}>
                    <IconButton sx={{ padding: 0 }}>
                      {<img src={Arrowdown} height={"16px"} width={"20px"} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInputBase-root": {
                  height: "50px", // Adjust the height as needed
                  marginLeft: "5px",
                },
                width: "35%",
              }}
            />
          </Box>
        </Box>
        <Stack
          sx={{
            gap: "24px",
          }}
          mt={6}
          ml={1}
        >
          <Button variant="contained" sx={addDriverStyles.button}>
            Add
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}

export default AddDriver;
