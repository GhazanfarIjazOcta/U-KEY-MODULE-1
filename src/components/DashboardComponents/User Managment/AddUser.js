
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
import {
  auth,
  rtdb,
  createUserWithEmailAndPassword,
  ref,
  set,
  get,
  remove
} from "../../../firebase";
import { useUser } from "../../../Context/UserContext";

import CustomAlert from "../../UI/CustomAlert";


function AddUser() {
  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    email: "",
    phone: "",
    role: "admin", // Default role
    status: "inactive", // Default status
    password: "", // Password field
    serialNumbers: {}, // Store all serial numbers
    tempIp: "", // Temporary IP for adding a new serial
    tempSerial: "" // Temporary serial for adding a new IP
  });

  const [availableIPs, setAvailableIPs] = useState([]); // State to store IPs

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
  

  useEffect(() => {
    // Fetch available machine IPs from Firebase
    const fetchIPs = async () => {
      const machinesRef = ref(rtdb, "machines");
      const snapshot = await get(machinesRef);
      if (snapshot.exists()) {
        const machines = snapshot.val();
        const ips = Object.keys(machines);
        setAvailableIPs(ips);
      } else {
        console.log("No machines found.");
      }
    };

    fetchIPs();
  }, []);

  // Handle input changes for all fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };



  const handleAddUser = async () => {
    const { serialNumbers, ...userData } = formData;
  
    // Step 1: Add the temporary serial and IP if they are provided
    // if (tempIp && tempSerial) {
    //   serialNumbers[tempIp] = { ip: tempIp, serial: tempSerial }; // Add to serialNumbers
    // }
  
    try {
      // Step 2: Create the new user in Firebase Auth
      const newUser = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const newUserUID = newUser.user.uid;
  
      const assignedMachines = {};
  
      // Step 3: Process serial numbers
      for (const ip in serialNumbers) {
        const { serial } = serialNumbers[ip];
        const machineRef = ref(rtdb, `machines/${ip}`);
        const machineSnapshot = await get(machineRef);
  
        if (!machineSnapshot.exists()) {
          console.log(`Machine with IP ${ip} does not exist.`);
          continue;
        }
  
        const machineData = machineSnapshot.val();
        const codes = machineData.codes || {};
  
        // Find the key for the serial code and remove it
        const codeKey = Object.keys(codes).find((key) => codes[key] === serial);
        if (codeKey) {
          const codeFieldRef = ref(rtdb, `machines/${ip}/codes/${codeKey}`);
          await remove(codeFieldRef);
          console.log(`Removed serial code ${serial} from machine ${ip}.`);
        }
  
        // Assign the machine to the user
        const roleType = serial.length === 4 ? "operators" : "foreman"; // Determine role
        const userFieldRef = ref(rtdb, `machines/${ip}/${roleType}/${serial}`);
        await set(userFieldRef, { userID: newUserUID });
  
        assignedMachines[ip] = { serial, role: roleType };
      }
  
      // Step 4: Save user data to Firebase Database
      const userDocRef = ref(rtdb, `users/${newUserUID}`);
      await set(userDocRef, {
        ...userData,
        userID: newUserUID,
        organizationID: CurrentOrganizationID,
        lastLogin: new Date().toISOString(),
        assignedMachines, // Save assigned machines
        serialNumbers
      });
  
      // alert("User added successfully!");
      setAlert({
        open: true,
        severity: "success",
        message: "User added successfully!.",
      });
  
      // Reset the form
      setFormData({
        userId: "",
        name: "",
        email: "",
        phone: "",
        // role: "employee",
        role: "employee",   
        statadminus: "inactive",
        password: "",
        serialNumbers: {},
        tempIp: "",
        tempSerial: ""
      });
    } catch (error) {
      console.error("Error adding user:", error.message);
      alert("Failed to add user: " + error.message);
    }
  };

  return (
    <Paper sx={{ padding: 3 }}>
      <Box>
        {["name", "email", "phone", "password"].map((field) => (
          <Box key={field} sx={{ marginBottom: 2 }}>
            <Typography sx={{ marginBottom: 1 }}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </Typography>
            <TextField
              name={field}
              type={field === "password" ? "password" : "text"}
              value={formData[field]}
              onChange={handleChange}
              fullWidth
            />
          </Box>
        ))}

        <Box sx={{ marginBottom: 2 }}>
          <Typography sx={{ marginBottom: 1 }}>Status</Typography>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Status"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* <Box sx={{ marginBottom: 2 }}>Add Serial Number
          <Typography sx={{ marginBottom: 1 }}>Role</Typography>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Role"
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="operator">Operator</MenuItem>
              <MenuItem value="employee">Employee</MenuItem>
            </Select>
          </FormControl>
        </Box> */}

        <Box sx={{ marginBottom: 2 }}>
          <Typography sx={{ marginBottom: 1 }}>Assign Serial 5-digit Foreman Code:</Typography>
          {/* <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Machine IP</InputLabel>
            <Select
              name="tempIp"
              value={formData.tempIp}
              onChange={handleChange}
              label="Machine IP"
            >
              {availableIPs.map((ip) => (
                <MenuItem key={ip} value={ip}>
                  {ip}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
          <TextField
            label="Serial Code"
            name="tempSerial"
            value={formData.tempSerial}
            onChange={handleChange}
            fullWidth
          />
        </Box>
        
      </Box>

      <Stack direction="row" justifyContent="flex-end">
        <Button sx={{ backgroundColor: "#15294E" }} variant="contained" onClick={handleAddUser}>
          Add User
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

export default AddUser;
