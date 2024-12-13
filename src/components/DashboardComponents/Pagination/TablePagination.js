import * as React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { PaginationItem, Typography } from "@mui/material";

const CustomPagination = styled(Pagination)(({ theme }) => ({
  "& .MuiPaginationItem-page": {
    padding: theme.spacing(1),    // Smaller padding for numbers
    fontSize: "14px",             // Font size for numbers
    fontWeight: 500,
    color: "#6B7280",             // Text color for numbers
    borderRadius: 0,              // No border radius for numbers
    border: "none",               // No border for numbers
    background: "transparent",  // Remove background color
    "&:hover": {
      background: "transparent", // Ensure no hover background
    },
  },
  "& .MuiPaginationItem-previousNext": {
    border: `1px solid #EBEFEC`,   // Border for the arrows
    borderRadius: "10px",           // Rounded corners for arrows
    padding: theme.spacing(2.5),   // Increase padding for arrows
    backgroundColor: "#ffffff",    // White background for arrows
  },
  "& .Mui-selected": {
    color: "#F38712",                // Text color when selected
    backgroundColor: "transparent !important",  // Force background to be transparent
    "&:hover": {
      backgroundColor: "transparent !important",  // Force no hover background
    },
    "&.Mui-focusVisible": {
      backgroundColor: "transparent !important",  // Force no background on focus
    },
  },
}));


export default function TablePagination({ count, currentPageResults, page, onChange }) {
  return (

    <Stack
      direction={{ xs: "column", sm: "row" }} // Stack direction for smaller screens
      justifyContent="flex-end"
      marginTop={"2rem"}
      alignItems="center"
      height="100%"
    >
      <CustomPagination
        count={count ? count : 10}
        page={page}
        onChange={onChange}
        shape="rounded"
        variant="outlined"
        sx={{
          marginTop: { xs: 1, sm: 0 },
        }}
        // Customizing the arrow icons
        renderItem={(item) => (
          <PaginationItem
            {...item}
            slots={{
              previous: WestIcon,
              next: EastIcon,
            }}
          />
        )}
      />
    </Stack>
  );
}
