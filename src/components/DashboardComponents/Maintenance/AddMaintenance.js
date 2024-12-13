import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Paper, Stack, MenuItem } from "@mui/material";
import { auth, rtdb, ref, set, get } from "../../../firebase";
import { useUser } from "../../../Context/UserContext";

import CustomAlert from "../../UI/CustomAlert";

function AddMaintenance() {
  const [formData, setFormData] = useState({
    machineID: "",
    maintenanceName: "",
    maintenanceDetails: "",
    nextMaintenance: "",
    status: "Pending",
  });

  const [selectedLocation, setSelectedLocation] = useState({ lat: 51.505, lng: -0.09 });
  const { user } = useUser();
  const CurrentUserID = user.uid;
  const CurrentOrganizationID = user.organizationID;


      const [alert, setAlert] = useState({
          open: false,
          severity: "success",
          message: "",
        });
        
          const handleAlertClose = () => {
            setAlert({ ...alert, open: false });
          };

  const [machines, setMachines] = useState([]);

  useEffect(() => {
    const fetchMachineIds = async () => {
      const machineRef = ref(rtdb, `machines`); // Use 'machines' instead of 'organizations'
      const snapshot = await get(machineRef);
      if (snapshot.exists()) {
        const machineData = snapshot.val();
        const machineIds = Object.keys(machineData)
          .filter((id) => machineData[id].organizationID === CurrentOrganizationID) // Filter by organization ID
          .map((id) => ({
            id: id,
            label: `Machine ID: ${id}` // Formatting for display
          }));
        setMachines(machineIds);
      }
    };
  
    fetchMachineIds();
  }, [CurrentOrganizationID]);
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddMaintenance = async () => {
    try {
      const { machineID, maintenanceName, maintenanceDetails, nextMaintenance, status } = formData;

      if (!machineID || !maintenanceName || !maintenanceDetails || !nextMaintenance) {
        // alert("Please fill out all required fields.");
        setAlert({
          open: true,
          severity: "warning",
          message: "Please fill out all required fields.",
        });
        return;
      }

      const maintenanceRef = ref(
        rtdb,
        `machines/${machineID}/maintenance` // Machines -> specific machine ID -> maintenance
      );

      // Fetch existing maintenance records
      const snapshot = await get(maintenanceRef);
      const existingMaintenances = snapshot.exists() ? snapshot.val() : [];

      // Construct new maintenance object
      const newMaintenance = {
        machineID,
        maintenanceName,
        maintenanceDetails,
        nextMaintenance,
        status,
        recentMaintenance: new Date().toISOString().split("T")[0],
      };

      // Add new maintenance while preserving existing ones
      const updatedMaintenances = [...existingMaintenances, newMaintenance].filter(
        (item) => item !== null
      );

      await set(maintenanceRef, updatedMaintenances);

      // alert("Maintenance added successfully!");
      setAlert({
        open: true,
        severity: "success",
        message: "Maintenance added successfully!",
      });

      setFormData({
        machineID: "",
        maintenanceName: "",
        maintenanceDetails: "",
        nextMaintenance: "",
        status: "Pending",
      });

    } catch (error) {
      // alert("Error: " + error.message);

      setAlert({
        open: true,
        severity: "error",
        message: "Error: " + error.message,
      });
    }
  };

  return (
    <Paper sx={{ padding: 3 }}>
      <Box>
        <Box sx={{ marginBottom: 2 }}>
          <Typography sx={{mb:1}} >Machine ID</Typography>
          <TextField
            select
            name="machineID"
            value={formData.machineID}
            onChange={handleChange}
            fullWidth
            label="Select Machine ID"
          >
            {machines.length > 0 ? (
              machines.map((machineID) => (
                <MenuItem key={machineID.id} value={machineID.id}>
                  {machineID.label}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="">No Machines Available</MenuItem>
            )}
          </TextField>
        </Box>

        {["maintenanceName", "maintenanceDetails", "nextMaintenance"].map((field) => (
          <Box key={field} sx={{ marginBottom: 2 }}>
            <Typography sx={{mb:1}}>{field.replace(/([A-Z])/g, " $1").charAt(0).toUpperCase() + field.slice(1)}</Typography>
            <TextField
              name={field}
              value={formData[field]}
              onChange={handleChange}
              fullWidth
              type={field === "nextMaintenance" ? "date" : "text"}
            />
          </Box>
        ))}

        <Box sx={{ marginBottom: 2 }}>
          <Typography sx={{mb:1}} >Status</Typography>
          <TextField
            name="status"
            value={formData.status}
            onChange={handleChange}
            fullWidth
            select
            label="Status"
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>
        </Box>
      </Box>

      <Stack direction="row" justifyContent="flex-end">
        <Button sx={{ backgroundColor: "#15294E" }} variant="contained" onClick={handleAddMaintenance}>
          Add Maintenance
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

export default AddMaintenance;
