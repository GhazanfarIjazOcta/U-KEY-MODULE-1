import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import { auth, rtdb, ref, set, get } from "../../../firebase";
import { useUser } from "../../../Context/UserContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import CustomAlert from "../../UI/CustomAlert";

function AddJobSites() {
  const [formData, setFormData] = useState({
    companyName: "",
    locationName: "",
    locationURL: "",
    status: "Active" // Default status
  });

  const [jobSites, setJobSites] = useState([]); // To hold existing job sites from the database
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 51.505,
    lng: -0.09
  }); // Default to center map location
  const { user } = useUser();
  const CurrentUserID = user.uid;
  const CurrentOrganizationID = user.organizationID;

  const [alert, setAlert] = useState({
    open: false,
    severity: "success",
    message: ""
  });

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  // Fetch existing job sites when component mounts
  useEffect(() => {
    const fetchJobSites = async () => {
      const jobSitesRef = ref(
        rtdb,
        `organizations/${CurrentOrganizationID}/JobSites`
      );
      const snapshot = await get(jobSitesRef);
      if (snapshot.exists()) {
        const existingJobSites = snapshot.val().filter((site) => site !== null); // Remove null entries
        setJobSites(existingJobSites);
      }
    };

    fetchJobSites();
  }, [CurrentOrganizationID]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (e) => {
    setFormData({ ...formData, status: e.target.value });
  };

  const handleAddJobSite = async () => {
    try {
      // Construct new job site object
      const newJobSite = {
        companyName: formData.companyName,
        locationName: formData.locationName,
        locationURL: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d${
          selectedLocation.lat
        }!2d${selectedLocation.lng}!3d${
          selectedLocation.lat
        }!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xd3cf0b0078a0e217!2s${encodeURIComponent(
          formData.locationName
        )}!5e0!3m2!1sen!2sus!4vYOUR_EMBED_API_KEY`,
        status: formData.status
      };

      // Add the new job site and filter out null values before updating
      const updatedJobSites = [...jobSites, newJobSite].filter(
        (site) => site !== null
      );
      const jobSitesRef = ref(
        rtdb,
        `organizations/${CurrentOrganizationID}/JobSites`
      );
      await set(jobSitesRef, updatedJobSites);

      // alert("Job site added successfully!");
      setAlert({
        open: true,
        severity: "success",
        message: "Job site added successfully!"
      });
      setFormData({
        companyName: "",
        locationName: "",
        locationURL: "",
        status: "Active"
      });
    } catch (error) {
      // alert("Error: " + error.message);
      setAlert({
        open: true,
        severity: "error",
        message: "Error: " + error.message
      });
    }
  };

  return (
    <Paper sx={{ padding: 3 }}>
      <Box>
        {["companyName", "locationName", "locationURL"].map((field) => (
          <Box key={field} sx={{ marginBottom: 2 }}>
            <Typography sx={{ mb: 1 }}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </Typography>
            {field === "locationURL" ? (
              <TextField
                name={field}
                value={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d${
                  selectedLocation.lat
                }!2d${selectedLocation.lng}!3d${
                  selectedLocation.lat
                }!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xd3cf0b0078a0e217!2s${encodeURIComponent(
                  formData.locationName
                )}!5e0!3m2!1sen!2sus!4vYOUR_EMBED_API_KEY`}
                fullWidth
                disabled
                label="Location URL (auto-generated)"
              />
            ) : (
              <TextField
                name={field}
                value={formData[field]}
                onChange={handleChange}
                fullWidth
              />
            )}
          </Box>
        ))}
      </Box>

      <Box sx={{ marginBottom: 2 }}>
        <Typography sx={{ mb: 1 }}>Status:</Typography>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select value={formData.status} onChange={handleStatusChange}>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ marginBottom: 2 }}>
        <Typography sx={{ mb: 1 }}>
          Location Will be selected on basis of Location Name:
        </Typography>
        <MapContainer
          center={selectedLocation}
          zoom={13}
          style={{ height: "300px", width: "100%" }}
          onClick={(e) => setSelectedLocation(e.latlng)}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={selectedLocation}>
            <Popup>
              Selected Location: {selectedLocation.lat.toFixed(5)},{" "}
              {selectedLocation.lng.toFixed(5)}
            </Popup>
          </Marker>
        </MapContainer>
      </Box>

      <Stack direction="row" justifyContent="flex-end">
        <Button
          sx={{ backgroundColor: "#15294E" }}
          variant="contained"
          onClick={handleAddJobSite}
        >
          Add Job Site
        </Button>
      </Stack>

      <CustomAlert
        open={alert.open}
        onClose={handleAlertClose}
        severity={alert.severity}
        message={alert.message}
      />
    </Paper>
  );
}

export default AddJobSites;
