import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import OutlinedCard from "../../pages/Card/Card";
import UserLogo from "../../assets/Card/user.png";
import AdminLogo from "../../assets/Card/adminIcon.png";
import DriverLogo from "../../assets/Card/DriversLogo.png";
import GuestLogo from "../../assets/Card/GuestLogo.png";

export default function ResUserManagment() {
  return (
    <>
      <Box flex={{ md: 9 }} sx={{ px: 2, mt: 2 }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ width: "100%", mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <OutlinedCard text={"All Users"} icon={UserLogo} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <OutlinedCard text={"Admin"} icon={AdminLogo} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <OutlinedCard text={"Drivers"} icon={DriverLogo} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <OutlinedCard text={"Guest"} icon={GuestLogo} />
              </Grid>
            </Grid>
          </Box>

          <Box
            sx={{
              width: "100%",
              height: { xs: "auto", md: "81%" },
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              backgroundColor: "yellow",
            }}
          >
            {/* Additional content here */}
          </Box>
        </Box>
      </Box>
    </>
  );
}
