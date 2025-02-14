import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, update, remove } from "firebase/database";
import { Box, Typography, Button, Modal, TextField, Alert } from "@mui/material";
import React from "react";
import { useUser } from "../../../Context/UserContext"; // Assuming you have a UserContext to fetch the user details
import { useNavigate } from "react-router-dom";

function JobCompanyLocationCard() {
  const navigate = useNavigate(); // Initialize it inside your component
  const route = "add-jobsites"; // Define it if it's dynamic
  const { user } = useUser(); // Destructure user data from context
  const userOrganizationID = user.organizationID;

  const [jobSites, setJobSites] = useState([]);
  const [selectedJobSite, setSelectedJobSite] = useState(null); // For update modal
  const [deleteJobSiteId, setDeleteJobSiteId] = useState(null); // For delete confirmation
  const [updateFormData, setUpdateFormData] = useState({
    companyName: "",
    locationName: "",
    jobSiteNotes: ""
  });
  const [alert, setAlert] = useState({ open: false, severity: "success", message: "" });

  useEffect(() => {
    const db = getDatabase(); // Initialize Firebase Database
    const orgRef = ref(db, `organizations/${userOrganizationID}/JobSites`);

    // Listen for real-time updates
    onValue(orgRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert Firebase object to array and include the ID
        const jobSitesArray = Object.keys(data).map((key) => ({
          id: key, // Include the Firebase key as the ID
          ...data[key]
        }));
        setJobSites(jobSitesArray);
      } else {
        setJobSites([]); // No job sites found
      }
    });
  }, [userOrganizationID]);

  // Handle Update Modal Open
  const handleUpdateModalOpen = (jobSite) => {
    setSelectedJobSite(jobSite);
    setUpdateFormData({
      companyName: jobSite.companyName,
      locationName: jobSite.locationName,
      jobSiteNotes: jobSite.jobSiteNotes || ""
    });
  };

  // Handle Update Modal Close
  const handleUpdateModalClose = () => {
    setSelectedJobSite(null);
    setUpdateFormData({
      companyName: "",
      locationName: "",
      jobSiteNotes: ""
    });
  };

  // Handle Update Job Site
  const handleUpdateJobSite = async () => {
    if (!selectedJobSite || !selectedJobSite.id) {
      setAlert({ open: true, severity: "error", message: "Error: Job site ID is missing." });
      return;
    }

    try {
      const db = getDatabase();
      const jobSiteRef = ref(db, `organizations/${userOrganizationID}/JobSites/${selectedJobSite.id}`);

      await update(jobSiteRef, {
        companyName: updateFormData.companyName,
        locationName: updateFormData.locationName,
        jobSiteNotes: updateFormData.jobSiteNotes
      });

      setAlert({ open: true, severity: "success", message: "Job site updated successfully!" });
      handleUpdateModalClose();
    } catch (error) {
      setAlert({ open: true, severity: "error", message: "Error updating job site: " + error.message });
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirmation = (jobSiteId) => {
    setDeleteJobSiteId(jobSiteId);
  };

  // Handle Delete Job Site
  const handleDeleteJobSite = async () => {
    if (!deleteJobSiteId) {
      setAlert({ open: true, severity: "error", message: "Error: Job site ID is missing." });
      return;
    }

    try {
      const db = getDatabase();
      const jobSiteRef = ref(db, `organizations/${userOrganizationID}/JobSites/${deleteJobSiteId}`);

      await remove(jobSiteRef);

      setAlert({ open: true, severity: "success", message: "Job site deleted successfully!" });
      setDeleteJobSiteId(null);
    } catch (error) {
      setAlert({ open: true, severity: "error", message: "Error deleting job site: " + error.message });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: "1.5rem",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem"
      }}
    >
      {jobSites.length > 0 ? (
        jobSites.map((site, index) => (
          <Box
            key={index}
            sx={{
              padding: "1rem",
              background: "#FFF",
              borderRadius: "8px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              width: "100%",
              maxWidth: 300,
              height: 400, // Fixed height for the card
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              overflow: "hidden" // Ensure the card doesn't expand
            }}
          >
            {/* Company and Location Details */}
            <Box>
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontSize: "1rem",
                  color: "#3D4149",
                  fontWeight: 600,
                  marginBottom: "0.5rem"
                }}
              >
                {site.companyName}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontSize: "0.9rem",
                  color: "#6c757d"
                }}
              >
                📍 {site.locationName}
              </Typography>
            </Box>

            {/* Map */}
            <Box
              sx={{
                height: "150px", // Fixed height for the map
                borderRadius: "8px",
                overflow: "hidden",
                position: "relative"
              }}
            >
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`${site.locationURL}&zoom=15&markers=color:red%7C${site.locationURL.split("!1d")[1].split("!2d")[0]},${site.locationURL.split("!2d")[1].split("!3d")[0]}`}
                allowFullScreen
                title="Google Map"
              ></iframe>
            </Box>

            {/* Job Site Notes */}
            <Box
              sx={{
                flex: 1, // Take up remaining space
                backgroundColor: "#f9f9f9",
                padding: "0.75rem",
                borderRadius: "8px",
                overflowY: "auto", // Enable vertical scrolling
                maxHeight: "120px" // Limit the height of the notes section
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontSize: "0.9rem",
                  color: "#3D4149",
                  whiteSpace: "pre-wrap" // Preserve line breaks
                }}
              >
                📝 <strong>Notes:</strong> {site.jobSiteNotes}
              </Typography>
            </Box>

            {/* Update and Delete Buttons */}
            <Box sx={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#1976d2", "&:hover": { backgroundColor: "#115293" } }}
                onClick={() => handleUpdateModalOpen(site)}
              >
                Update
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#d32f2f", "&:hover": { backgroundColor: "#9a0007" } }}
                onClick={() => handleDeleteConfirmation(site.id)}
              >
                Delete
              </Button>
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
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            maxWidth: 500,
            margin: "0 auto"
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
            sx={{
              backgroundColor: "#15294E",
              "&:hover": { backgroundColor: "#1a365d" }
            }}
            onClick={() => navigate(route)}
          >
            Want To Add Job Site? 📍
          </Button>
        </Box>
      )}

      {/* Update Modal */}
      <Modal
        open={Boolean(selectedJobSite)}
        onClose={handleUpdateModalClose}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            backgroundColor: "#FFF",
            padding: "2rem",
            borderRadius: "8px",
            width: "100%",
            maxWidth: 400
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
            Update Job Site
          </Typography>
          <TextField
            label="Company Name"
            fullWidth
            value={updateFormData.companyName}
            onChange={(e) => setUpdateFormData({ ...updateFormData, companyName: e.target.value })}
            sx={{ marginBottom: "1rem" }}
          />
          <TextField
            label="Location Name"
            fullWidth
            value={updateFormData.locationName}
            onChange={(e) => setUpdateFormData({ ...updateFormData, locationName: e.target.value })}
            sx={{ marginBottom: "1rem" }}
          />
          <TextField
            label="Job Site Notes"
            fullWidth
            multiline
            rows={4}
            value={updateFormData.jobSiteNotes}
            onChange={(e) => setUpdateFormData({ ...updateFormData, jobSiteNotes: e.target.value })}
            sx={{ marginBottom: "1rem" }}
          />
          <Button
            variant="contained"
            sx={{ backgroundColor: "#1976d2", "&:hover": { backgroundColor: "#115293" } }}
            onClick={handleUpdateJobSite}
          >
            Save Changes
          </Button>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={Boolean(deleteJobSiteId)}
        onClose={() => setDeleteJobSiteId(null)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            backgroundColor: "#FFF",
            padding: "2rem",
            borderRadius: "8px",
            width: "100%",
            maxWidth: 400
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
            Are you sure you want to delete this job site?
          </Typography>
          <Box sx={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#d32f2f", "&:hover": { backgroundColor: "#9a0007" } }}
              onClick={handleDeleteJobSite}
            >
              Delete
            </Button>
            <Button
              variant="outlined"
              onClick={() => setDeleteJobSiteId(null)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Alert */}
      {alert.open && (
        <Alert
          severity={alert.severity}
          onClose={() => setAlert({ ...alert, open: false })}
          sx={{ position: "fixed", bottom: 20, right: 20 }}
        >
          {alert.message}
        </Alert>
      )}
    </Box>
  );
}

export default JobCompanyLocationCard;