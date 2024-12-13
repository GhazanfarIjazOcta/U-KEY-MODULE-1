import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import Paper from "@mui/material/Paper";
import { Box, Stack, Typography, IconButton, Dialog } from "@mui/material";
import { TableStyles } from "../../UI/Styles";

import Edit from "../../../assets/Table/Edit.png";
import Delete from "../../../assets/Table/Delete.png";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase"; // Firebase auth instance

import {
  getDatabase,
  ref,
  get,
  set,
  update,
  remove,
  onValue
} from "firebase/database";
import { getAuth, deletemachine } from "firebase/auth"; // Import deletemachine from Firebase Authentication
import { useNavigate } from "react-router-dom";

import { useUser } from "../../../Context/UserContext";
import { useState } from "react";

import { useEffect } from "react";

import Slider from "react-slick";

import CloseIcon from "@mui/icons-material/Close";

export default function MachinesTableContent() {
  const { user, updatemachineData } = useUser(); // Destructure machine data from context
  console.log("machine organization id in ", user.organizationID);

  const CurrentmachineID = user.uid;

  console.log("machine current id in ", CurrentmachineID);

  const CurrentOrganizationID = user.organizationID;
  const [machines, setmachines] = useState([]);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("the machines getting here are ", machines);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authmachine) => {
      if (authmachine) {
        try {
          const db = getDatabase();
          const machinesRef = ref(db, "machines"); // Reference to all machines directly

          // Using onValue for real-time updates
          const machinesListener = onValue(machinesRef, (snapshot) => {
            if (snapshot.exists()) {
              const allMachines = snapshot.val();
              const filteredMachines = [];

              // Loop through machines and filter them based on the current organization ID
              for (const machineKey in allMachines) {
                const machine = allMachines[machineKey];
                if (machine.organizationID === CurrentOrganizationID) {
                  filteredMachines.push({
                    ...machine, // Spread to include machine details
                    machineID: machine.machineID
                  });
                }
              }

              setmachines(filteredMachines); // Update state with the filtered machines
            } else {
              setError("No machines found.");
            }
            setLoading(false); // Set loading to false after fetching data
          });

          // Cleanup listener when the component unmounts
          return () => {
            machinesListener(); // Unsubscribe from the real-time listener
          };
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      } else {
        setError("You must be logged in to view this page.");
        setLoading(false);
      }
    });

    // Cleanup on auth state change
    return () => unsubscribe(); // Cleanup auth listener
  }, [CurrentOrganizationID]); // Ensure the effect re-runs if the organization ID changes

  const handleDeletemachine = async (machineId) => {
    try {
      const db = getDatabase();
      const authInstance = getAuth();

      // 1. Delete the machine from the 'machines' node
      const machineRef = ref(db, `machines/${machineId}`);
      await remove(machineRef);

      // 2. Update the organization data (if necessary) to remove references to the deleted machine
      const machineSnapshot = await get(machineRef);
      if (machineSnapshot.exists()) {
        const machineData = machineSnapshot.val();
        const organizationID = machineData.organizationID;

        if (organizationID) {
          // Find the organization node and remove the machine reference (if needed)
          const orgRef = ref(db, `organizations/${organizationID}`);
          const orgSnapshot = await get(orgRef);

          if (orgSnapshot.exists()) {
            const orgData = orgSnapshot.val();

            // If the organization has machine references, remove this machine
            const updatedOrgMachines = { ...orgData.machines };
            delete updatedOrgMachines[machineId];

            // Update the organization node without the deleted machine
            await update(orgRef, { machines: updatedOrgMachines });
          }
        }
      }

      // 3. Update the 'users' node to remove the machine from users' 'serialNumbers' (if relevant)
      const usersRef = ref(db, "users");
      const usersSnapshot = await get(usersRef);

      if (usersSnapshot.exists()) {
        const usersData = usersSnapshot.val();

        // Loop through users and remove the machine ID from their serialNumbers (if exists)
        for (const userId in usersData) {
          const user = usersData[userId];
          if (user.serialNumbers && user.serialNumbers[machineId]) {
            const updatedSerialNumbers = { ...user.serialNumbers };
            delete updatedSerialNumbers[machineId];

            // Update the user's serialNumbers to remove the machine
            const userRef = ref(db, `users/${userId}`);
            await update(userRef, { serialNumbers: updatedSerialNumbers });
          }
        }
      }

      // 4. Optionally delete the machine from Firebase Authentication (if it's linked to the machineId)
      const currentmachine = authInstance.currentUser;
      if (currentmachine && currentmachine.uid === machineId) {
        try {
          // Perform any needed actions related to the logged-in machine here
          console.log(
            `Machine with UID: ${machineId} deleted from Firebase Authentication.`
          );
        } catch (authError) {
          console.error(
            `Error deleting machine from Firebase Authentication: ${authError.message}`
          );
        }
      }

      // 5. Update local state by removing the deleted machine from the UI (if needed)
      setmachines((prevmachines) =>
        prevmachines.filter((machine) => machine.machineID !== machineId)
      );

      alert("Machine and associated data have been deleted successfully.");
    } catch (error) {
      console.error(`Error deleting machine: ${error.message}`);
      setError("Error deleting machine and its associated data.");
    }
  };

  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedmachine, setSelectedmachine] = useState(null);

  // State for edit fields
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editStatus, setEditStatus] = useState("");

  // Load machine details into edit form
  const handleEdit = (machine) => {
    setSelectedmachine(machine);
    setEditName(machine.name);
    setEditEmail(machine.email);
    setEditPhone(machine.phone);
    setEditStatus(machine.status);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedmachine(null);
  };

  const handleSaveChanges = async () => {
    if (!selectedmachine) return;

    try {
      const db = getDatabase();
      const orgsRef = ref(db, "organizations");
      const orgSnapshot = await get(orgsRef);

      if (orgSnapshot.exists()) {
        const orgData = orgSnapshot.val();

        for (const orgId in orgData) {
          const machineList = orgData[orgId].machines;

          if (machineList) {
            // Loop through the machineList object to find the machine by machineID
            for (const machineId in machineList) {
              if (machineId === selectedmachine.machineID) {
                const updatedData = {
                  name: editName,
                  email: editEmail,
                  phone: editPhone,
                  status: editStatus
                };

                // Update the machine's data in this organization
                const orgmachineRef = ref(
                  db,
                  `organizations/${orgId}/machines/${machineId}`
                );
                await update(orgmachineRef, updatedData);

                // Update the UI by updating the machines list in local state
                setmachines((prevmachines) =>
                  prevmachines.map((machine) =>
                    machine.machineID === selectedmachine.machineID
                      ? { ...machine, ...updatedData }
                      : machine
                  )
                );

                alert("machine data updated successfully.");
                handleCloseEditModal(); // Close modal
                return; // Exit after updating the first matching machine
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error updating machine: ${error.message}`);
      setError("Failed to update machine data.");
    }
  };

  const [open, setOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const handleOpenImages = (images) => {
    setSelectedImages(Object.values(images)); // Convert images object to array
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false); // Ensure this line is correctly resetting the state
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true
  };

  return (
    <TableContainer
      sx={{
        borderRadius: 0,
        elevation: 0,
        borderTop: "1px solid #EAECF0",
        marginTop: "2.5rem",
        background: "#FFF",
        height: "60%"
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead sx={{ backgroundColor: "#FCFCFD" }}>
          <TableRow>
            <TableCell align="right">
              <Stack
                direction={"row"}
                gap={1}
                sx={{ width: "100%", justifyContent: "center" }}
              >
                <Typography sx={TableStyles.headingStyle}>
                  Machine ID/ Name
                </Typography>
              </Stack>
            </TableCell>

            <TableCell align="center">
              <Stack
                direction={"row"}
                gap={1}
                sx={{ width: "100%", justifyContent: "center" }}
              >
                <Typography sx={TableStyles.headingStyle}>Images</Typography>
              </Stack>
            </TableCell>

            <TableCell align="center">
              <Stack
                direction={"row"}
                gap={1}
                sx={{ width: "100%", justifyContent: "start" }}
              >
                <Typography sx={TableStyles.headingStyle}>
                  Last Location
                </Typography>
              </Stack>
            </TableCell>
            <TableCell align="center">
              <Stack
                direction={"row"}
                gap={1}
                sx={{ width: "100%", justifyContent: "start" }}
              >
                <Typography sx={TableStyles.headingStyle}>
                  Last Operation (Time/Date){" "}
                </Typography>
              </Stack>
            </TableCell>

            <TableCell align="center">
              <Stack
                direction={"row"}
                gap={1}
                sx={{ width: "100%", justifyContent: "start" }}
              >
                <Typography sx={TableStyles.headingStyle}>
                  Recent machines (4-digit PIN)
                </Typography>
              </Stack>
            </TableCell>

            <TableCell align="center">
              <Stack
                direction={"row"}
                gap={1}
                sx={{ width: "100%", justifyContent: "center" }}
              >
                <Typography sx={TableStyles.headingStyle}>Status</Typography>
              </Stack>
            </TableCell>

            <TableCell align="center">
              <Stack
                direction={"row"}
                gap={1}
                sx={{ width: "100%", justifyContent: "start" }}
              >
                <Typography sx={TableStyles.headingStyle}>
                  Company ID
                </Typography>
              </Stack>
            </TableCell>

            <TableCell align="start">
              <Stack
                direction={"row"}
                gap={1}
                sx={{ width: "100%", justifyContent: "start" }}
              >
                <Typography sx={TableStyles.headingStyle}>
                  Connection
                </Typography>
              </Stack>
            </TableCell>

            {/* <TableCell align="center">
                            <Stack
                                direction={"row"}
                                gap={1}
                                sx={{ width: "100%", justifyContent: "center" }}
                            >
                                <Typography sx={TableStyles.headingStyle}>

                                    Lubricant Details
                                </Typography>
                            </Stack>
                        </TableCell> */}

            <TableCell align="start">
              <Stack
                direction={"row"}
                gap={1}
                sx={{ width: "100%", justifyContent: "start" }}
              >
                <Typography sx={TableStyles.headingStyle}>
                  Operator Codes
                </Typography>
              </Stack>
            </TableCell>

            <TableCell align="start">
              <Stack
                direction={"row"}
                gap={1}
                sx={{ width: "100%", justifyContent: "start" }}
              >
                <Typography sx={TableStyles.headingStyle}>
                  Foreman Codes
                </Typography>
              </Stack>
            </TableCell>

            {/* <TableCell align="center">
              <Stack
                direction={"row"}
                gap={1}
                sx={{ width: "100%", justifyContent: "center" }}
              >
                <Typography sx={TableStyles.headingStyle}>Actions</Typography>
              </Stack>
            </TableCell> */}
          </TableRow>
        </TableHead>

        <TableBody>
          {machines.length > 0 ? (
            machines.map((machine) => (
              <TableRow key={machine.id}>
                <TableCell align="center">{machine.machineID}</TableCell>
                <TableCell align="center">
                  <Stack
                    direction={"row"}
                    gap={1}
                    sx={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Typography
                      sx={{
                        color: "#F38712",
                        fontSize: "0.9rem",
                        fontFamily: "Inter",
                        textDecoration: "underline",
                        cursor: "pointer",
                        whiteSpace: "nowrap"
                      }}
                      onClick={() => handleOpenImages(machine.image)} // Trigger popup
                    >
                      View Images
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell align="start">{machine.lastLocation}</TableCell>
                <TableCell align="start">
                  {machine.maintenance[0]?.recentMaintenance}
                </TableCell>
                <TableCell align="start">
                  {machine.maintenance[0]?.nextMaintenance}
                </TableCell>
                <TableCell align="start">
                  <Box
                    sx={{
                      width: "80px",
                      height: "25px",
                      backgroundColor:
                        machine.status === "active" ? "#ECFDF3" : "#F2F4F7",
                      borderRadius: "40%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px"
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor:
                          machine.status === "active" ? "#28A745" : "#6C757D"
                      }}
                    />
                    <Typography
                      fontWeight={500}
                      fontSize={"14px"}
                      sx={{
                        color:
                          machine.status === "active" ? "#037847" : "#364254"
                      }}
                      fontFamily={"Inter"}
                    >
                      {machine.status}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="start">{machine.organizationID}</TableCell>
                <TableCell align="start">
                  {machine.connected || "not defined"}
                </TableCell>
                <TableCell align="start">
                  {machine.operators
                    ? Object.keys(machine.operators).join(", ")
                    : "None"}
                </TableCell>
                <TableCell align="start">
                  {machine.foreman
                    ? Object.keys(machine.foreman).join(", ")
                    : "None"}
                </TableCell>
                {/* <TableCell align="start">
                  {machine.role === "superAdmin" ? (
                    <Box
                      sx={{
                        padding: "4px 8px",
                        backgroundColor: "#E3F2FD",
                        color: "#0D47A1",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        fontSize: "14px"
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      Super Admin
                    </Box>
                  ) : machine.id === CurrentmachineID ? (
                    <Box
                      sx={{
                        padding: "4px 8px",
                        backgroundColor: "#E3F2FD",
                        color: "#0D47A1",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        fontSize: "14px"
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      You
                    </Box>
                  ) : (
                    <Stack direction={"row"} gap={2} justifyContent="start">
                      <img
                        src={Edit}
                        width="24px"
                        height="24px"
                        onClick={() => handleEdit(machine)}
                        style={{ cursor: "pointer" }}
                        alt="Edit"
                      />
                      <img
                        src={Delete}
                        width="24px"
                        height="24px"
                        onClick={() =>
                          handleDeletemachine(machine.id, machine.machines)
                        }
                        style={{ cursor: "pointer" }}
                        alt="Delete"
                      />
                    </Stack>
                  )}
                </TableCell> */}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={12}
                align="center"
                sx={{ color: "#666", fontSize: "18px", padding: "20px 0" }}
              >
                No machines present in the organisation for now
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        {/* Popup Modal */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <Box sx={{ position: "relative", p: 4 }}>
            <IconButton
              sx={{ position: "absolute", top: 8, right: 8, cursor: "pointer" }}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>

            {/* Image Slider */}
            <Slider {...sliderSettings}>
              {selectedImages.map((imageUrl, index) => (
                <Box key={index} sx={{ textAlign: "center" }}>
                  <img
                    src={imageUrl} // Replace with actual URL logic if needed
                    alt={`Image ${index + 1}`}
                    style={{
                      width: "100%",
                      maxHeight: "400px",
                      objectFit: "contain"
                    }}
                  />
                </Box>
              ))}
            </Slider>
          </Box>
        </Dialog>
      </Table>
    </TableContainer>
  );
}
