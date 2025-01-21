import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { Box, Typography, Button } from "@mui/material";
import React from "react";
import { useUser } from "../../../Context/UserContext"; // Assuming you have a UserContext to fetch the user details
import { useNavigate } from "react-router-dom";

function JobCompanyLocationCard() {
  const navigate = useNavigate(); // Initialize it inside your component

  const route = "add-jobsites"; // Define it if it's dynamic
  const { user } = useUser(); // Destructure user data from context
  const userOrganizationID = user.organizationID;

  const [jobSites, setJobSites] = useState([]);

  useEffect(() => {
    const db = getDatabase(); // Initialize Firebase Database
    const orgRef = ref(db, `organizations/${userOrganizationID}/JobSites`);

    // Listen for real-time updates
    onValue(orgRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setJobSites(Object.values(data)); // Convert data to array
      } else {
        setJobSites([]); // No job sites found
      }
    });
  }, [userOrganizationID]);

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      {jobSites.length > 0 ? (
        jobSites.map((site, index) => (
          <Box
            key={index}
            sx={{
              padding: "0.5rem",
              background: "#FFF",
              height: "100%",
              maxHeight: 340,
              boxShadow: "0px 1px 4px 0px #00000014",
              maxWidth: 250
            }}
          >
            <Box sx={{ gap: "1.5rem", padding: "1rem" }}>
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontSize: "0.8rem",
                  color: "#3D4149"
                }}
              >
                Company:{" "}
                <span style={{ color: "#3D4149", fontWeight: 600 }}>
                  {site.companyName}
                </span>
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontSize: "0.8rem",
                  color: "#3D4149"
                }}
              >
                Location:{" "}
                <span style={{ color: "#3D4149", fontWeight: 600 }}>
                  {site.locationName}
                </span>
              </Typography>
            </Box>
            <Box height={{ md: "240px", xs: "220px" }} pl={"7px"} pr={"7px"}>
              <iframe
                width={"100%"}
                height={"100%"}
                frameBorder="0"
                style={{ border: 0, borderRadius: "0px" }}
                src={site.locationURL}
                allowFullScreen
                title="Google Map"
              ></iframe>
            </Box>
          </Box>
        ))
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2rem",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)"
          }}
        >
          <img
            src="https://res.cloudinary.com/dnfc9g33c/image/upload/v1733904665/IMG_2553.JPEG_b1uztd.jpg" // Replace with an actual illustration URL
            alt="No Jobs Available"
            style={{ maxWidth: "200px", marginBottom: "1rem" }}
          />
          <Typography
            variant="h6"
            sx={{ color: "#3D4149", marginBottom: "0.5rem" }}
          >
            No job sites available right now!
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#6c757d", marginBottom: "1rem" }}
          >
            It looks like there are currently no job sites at this organization.
            Check back later for updates!
          </Typography>
          <Button
            variant="contained"
            // color="primary"
            sx={{
              backgroundColor: "#15294E"
            }}
            onClick={() => navigate(route)}
          >
            Want To Add Job Site? 📍
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default JobCompanyLocationCard;
