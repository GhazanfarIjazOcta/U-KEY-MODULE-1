import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ArrowDown from "../../../assets/Table/arrow-down.png";
import smallArrow from "../../../assets/Table/smallArrow.png";
import { Box, Stack, Typography } from "@mui/material";
import Edit from "../../../assets/Table/Edit.png";
import Delete from "../../../assets/Table/Delete.png";

import { getDatabase, ref, get, set, update, remove } from "firebase/database";
import { getAuth, deleteUser } from "firebase/auth"; // Import deleteUser from Firebase Authentication
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase"; // Firebase auth instance

import { useUser } from "../../../Context/UserContext";

import { MenuItem, Modal, Button, TextField } from "@mui/material";

import { onValue } from "firebase/database";

import { getApp } from "firebase/app"; // for admin reference
import { getAuth as getAdminAuth } from "firebase/auth";

import CustomAlert from "../../UI/CustomAlert";

import { userManagement } from "../../UI/Main";

function createData(
  UserID,
  Name,
  Email,
  Phone_number,
  Role,
  Status,
  Last_Login,
  Action
) {
  return {
    UserID,
    Name,
    Email,
    Phone_number,
    Role,
    Status,
    Last_Login,
    Action
  };
}

export default function TableContent() {
  const { user, updateUserData } = useUser(); // Destructure user data from context
  console.log("user organization id in ", user.organizationID);

  const CurrentUserID = user.userID;

  console.log("user current id in ", CurrentUserID);
  const CurrentOrganizationID = user.organizationID;

  // const CurrentOrganizationID = user.organizationID;

  // const { user } = useUser(); // Destructure user data from context
  const navigate = useNavigate();


  const [alert, setAlert] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  
    const handleAlertClose = () => {
      setAlert({ ...alert, open: false });
    };



  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("all userssssssss", users);

  

  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, "users"); // Reference to all users node

    // Real-time listener for any changes in the users node
    const unsubscribe = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const allUsers = snapshot.val();
        const filteredUsers = [];

        for (const userKey in allUsers) {
          const user = allUsers[userKey];
          if (user.organizationID === CurrentOrganizationID) {
            filteredUsers.push({
              ...user,
              userID: user.userID
            });
          }
        }

        setUsers(filteredUsers); // Update the state with real-time data
      } else {
        setError("No users found.");
      }
    });

    return () => unsubscribe(); // Cleanup listener when component unmounts
  }, [CurrentOrganizationID]);

  const handleDeleteUser = async (userId) => {
    try {
      const db = getDatabase();
      const authInstance = getAuth();

      // 1. Delete user from the 'users' node
      const userRef = ref(db, `users/${userId}`);
      await remove(userRef);

      // 2. If the logged-in user is being deleted, delete from Firebase Authentication
      const currentUser = authInstance.currentUser;
      if (currentUser && currentUser.uid === userId) {
        try {
          await deleteUser(currentUser);
          console.log(
            `User with UID: ${userId} deleted from Firebase Authentication.`
          );
        } catch (authError) {
          console.error(
            `Error deleting user from Firebase Authentication: ${authError.message}`
          );
        }
      }

      // 3. Update the local UI state by removing the deleted user
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

      // alert("User and associated data have been deleted successfully.");
      setAlert({
        open: true,
        severity: "success",
        message: "User and associated data have been deleted successfully.",
      });
    } catch (error) {
      console.error(`Error deleting user: ${error.message}`);
      setError("Error deleting user and their data.");
    }
  };

  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // State for edit fields
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editRole, setEditRole] = useState("");

  // Load user details into edit form
  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phone);
    setEditStatus(user.status);
    setEditRole(user.role);
    setOpenEditModal(true);

   
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedUser(null);
  };

  const handleSaveChanges = async () => {
    if (!selectedUser) return;

    try {
      const db = getDatabase();

      // Access the users directly
      const usersRef = ref(db, "users");
      const usersSnapshot = await get(usersRef);

      if (usersSnapshot.exists()) {
        const usersData = usersSnapshot.val();

        // Loop through the users to find the user by userID
        for (const userId in usersData) {
          if (userId === selectedUser.userID) {
            const updatedData = {
              name: editName,
              email: editEmail,
              phone: editPhone,
              status: editStatus,
              role: editRole
            };

            // Update the user's data in the users node
            const userRef = ref(db, `users/${userId}`);
            await update(userRef, updatedData);

            

            // Update the UI by updating the users list in local state
            setUsers((prevUsers) =>
              prevUsers.map((user) =>
                user.userID === selectedUser.userID
                  ? { ...user, ...updatedData }
                  : user
              )
            );

            handleAssignMachineIP(selectedUser.userID);

            // alert("User data updated successfully.");
            setAlert({
              open: true,
              severity: "success",
              message: "User data updated successfully.",
            });
            handleCloseEditModal(); // Close modal
            return; // Exit after updating the first matching user
          }
        }
      }
    } catch (error) {
      console.error(`Error updating user: ${error.message}`);
      setError("Failed to update user data.");
    }
  };

  const [availableMachineIPs, setAvailableMachineIPs] = useState([]);
const [selectedMachineIP, setSelectedMachineIP] = useState("");
  useEffect(() => {
    // Fetch machine IPs from Firebase
    const fetchMachineIPs = async () => {
      const db = getDatabase();
      const machinesRef = ref(db, "machines"); // Path to machines node in Firebase
      onValue(machinesRef, (snapshot) => {
        const machineData = snapshot.val();
        if (machineData) {
          setAvailableMachineIPs(Object.keys(machineData)); // Get machine IPs
        }
      });
    };
  
    fetchMachineIPs();
  }, []);

  const handleAssignMachineIP = (user_id) => {
    if (!selectedMachineIP) {
      setAlert({
        open: true,
        severity: "error",
        message: "Please select a valid Machine IP.",
      });
      return;
    }
  
    const db = getDatabase(); // Initialize the database
    const userRef = ref(db, `users/${user_id}`);
    const machineRef = ref(db, `machines/${selectedMachineIP}`);
  
    // Get operator data
    get(ref(db, `users/${user_id}`)).then((userSnapshot) => {
      const userData = userSnapshot.val();
      const tempSerial = userData.tempSerial;
  
      // Fetch the machine data
      get(machineRef).then((machineSnapshot) => {
        if (machineSnapshot.exists()) {
          const machineData = machineSnapshot.val();
  
        
          for (const key in machineData.codes) {
            if (typeof machineData.codes[key] === 'string' && !isNaN(machineData.codes[key])) {
              if (machineData.codes[key] === tempSerial) {
                delete machineData.codes[key];  // Deletes the key-value pair where tempSerial matches
                break;  // Exit loop once deleted
              }
            }
          }
          
  
          // Add tempSerial to foreman
          if (!machineData.foreman) {
            machineData.foreman = {};
          }
          machineData.foreman[tempSerial] = { userID: user_id };
  
          // Update machine and operator in Firebase
          update(machineRef, {
            foreman: machineData.foreman,
            codes: machineData.codes, // Ensure codes remain updated
          });
  
         
  
  
          update(userRef, {
            serialNumbers: {
              ...userData.serialNumbers,  // Spread existing serialNumbers if they exist
              [selectedMachineIP]: {
                ip: selectedMachineIP,
                serial: tempSerial,
              },
            },
            machineIP: selectedMachineIP,
          });
  
          console.log(`Machine IP ${selectedMachineIP} assigned to operator ${user_id}`);
          setUsers((prevforeman) =>
            prevforeman.map((op) =>
              op.id === user_id ? { ...op, machineIP: selectedMachineIP } : op
            )
          );
  
          setAlert({
            open: true,
            severity: "success",
            message: "Machine IP assigned successfully!",
          });
        } else {
          console.error("Machine not found!");
          setAlert({
            open: true,
            severity: "error",
            message: "Machine not found!",
          });
        }
      }).catch((error) => {
        console.error("Error retrieving machine:", error);
        setAlert({
          open: true,
          severity: "error",
          message: "Failed to retrieve machine details.",
        });
      });
    }).catch((error) => {
      console.error("Error retrieving operator:", error);
      setAlert({
        open: true,
        severity: "error",
        message: "Failed to retrieve operator details.",
      });
    });
  };
  
  
  
  
  
  
  
    // if (loading) return <div>Loading...</div>;

 

  return (
    <TableContainer
      component={Paper}
      sx={{
        ...userManagement.usermanagementTablecontainer
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead sx={{ backgroundColor: "#FCFCFD" }}>
          <TableRow>
            <TableCell align="right">
              <Stack
                direction={"row"}
                gap={1}
                sx={{ width: "100%", justifyContent: "start" }}
              >
                <Typography
                  fontWeight={500}
                  fontSize={"12px"}
                  sx={{ color: "#667085" }}
                  fontFamily={"Inter"}
                >
                  User ID
                </Typography>
                <img src={ArrowDown} height={"16px"} width={"16px"} />
              </Stack>
            </TableCell>
            <TableCell align="start">
              <Stack
                direction={"row"}
                gap={1}
                sx={{ width: "100%", justifyContent: "start" }}
              >
                <Typography
                  fontWeight={500}
                  fontSize={"12px"}
                  sx={{ color: "#667085" }}
                  fontFamily={"Inter"}
                >
                  Name
                </Typography>
                <img src={ArrowDown} height={"16px"} width={"16px"} />
              </Stack>
            </TableCell>
            <TableCell align="start">
              <Stack
                direction={"row"}
                gap={1}
                sx={{ width: "100%", justifyContent: "start" }}
              >
                <Typography
                  fontWeight={500}
                  fontSize={"12px"}
                  sx={{ color: "#667085" }}
                  fontFamily={"Inter"}
                >
                  Email
                </Typography>
                <img src={ArrowDown} height={"16px"} width={"16px"} />
              </Stack>
            </TableCell>
            <TableCell align="start">
              <Stack
                direction={"row"}
                gap={1}
                sx={{ width: "100%", justifyContent: "start" }}
              >
                <Typography
                  fontWeight={500}
                  fontSize={"12px"}
                  sx={{ color: "#667085" }}
                  fontFamily={"Inter"}
                >
                  Phone Number
                </Typography>
                <img src={ArrowDown} height={"16px"} width={"16px"} />
              </Stack>
            </TableCell>
            <TableCell align="start">
              <Stack
                direction={"row"}
                gap={1}
                sx={{ width: "100%", justifyContent: "start" }}
              >
                <Typography
                  fontWeight={500}
                  fontSize={"12px"}
                  sx={{ color: "#667085" }}
                  fontFamily={"Inter"}
                >
                  Role
                </Typography>
                <img src={ArrowDown} height={"16px"} width={"16px"} />
              </Stack>
            </TableCell>
            <TableCell align="start">
              <Stack
                direction={"row"}
                gap={1}
                sx={{ width: "100%", justifyContent: "start" }}
              >
                <Typography
                  fontWeight={500}
                  fontSize={"12px"}
                  sx={{ color: "#667085" }}
                  fontFamily={"Inter"}
                >
                  Status
                </Typography>
                <img src={ArrowDown} height={"16px"} width={"16px"} />
              </Stack>
            </TableCell>
            <TableCell align="start">
              <Stack
                direction={"row"}
                gap={1}
                sx={{ width: "100%", justifyContent: "start" }}
              >
                <Typography
                  fontWeight={500}
                  fontSize={"12px"}
                  sx={{ color: "#667085" }}
                  fontFamily={"Inter"}
                >
                  Last Login
                </Typography>
                <img src={ArrowDown} height={"16px"} width={"16px"} />
              </Stack>
            </TableCell>
            <TableCell align="start">
              <Stack
                direction={"row"}
                gap={1}
                sx={{ width: "100%", justifyContent: "start" }}
              >
                <Typography
                  fontWeight={500}
                  fontSize={"12px"}
                  sx={{ color: "#667085" }}
                  fontFamily={"Inter"}
                >
                  Action
                </Typography>
              </Stack>
            </TableCell>
          </TableRow>
        </TableHead>



        <TableBody>
  {users.filter(user => user.role === 'admin' || user.role === 'superAdmin').map((user) => (
    <TableRow key={user.id}>
      <TableCell align="start">{user.userID}</TableCell>
      <TableCell align="start">{user.name}</TableCell>
      <TableCell align="start">{user.email}</TableCell>
      <TableCell align="start">{user.phone}</TableCell>
      <TableCell align="start">{user.role}</TableCell>

      <TableCell align="start">
        <Box
          sx={{
            width: "80px",
            height: "25px",
            backgroundColor: user.status === "active" ? "#ECFDF3" : "#F2F4F7",
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
              backgroundColor: user.status === "active" ? "#28A745" : "#6C757D"
            }}
          />
          <Typography
            fontWeight={500}
            fontSize={"14px"}
            sx={{
              color: user.status === "active" ? "#037847" : "#364254"
            }}
            fontFamily={"Inter"}
          >
            {user.status}
          </Typography>
        </Box>
      </TableCell>

      <TableCell align="start">
        {user.lastLogin
          ? new Date(user.lastLogin).toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true // For AM/PM format, set to false for 24-hour format
            })
          : "N/A"}
      </TableCell>
      <TableCell align="start">
        {user.role === "superAdmin" ? (
          <Box
            sx={{
              padding: "4px 8px",
              backgroundColor: "#E3F2FD",
              color: "#0D47A1",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "14px"
            }}
            // onClick={handleSuperAdminAction}
            style={{ cursor: "pointer" }}
          >
            Super Admin
          </Box>
        ) : user.userID === CurrentUserID ? (
          <Box
            sx={{
              padding: "4px 8px",
              backgroundColor: "#E3F2FD",
              color: "#0D47A1",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "14px"
            }}
            // onClick={handleAdminAction}
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
              onClick={() => handleEdit(user)}
              style={{ cursor: "pointer" }}
              alt="Edit"
            />
            <img
              src={Delete}
              width="24px"
              height="24px"
              onClick={() => handleDeleteUser(user.userID, user.users)}
              style={{ cursor: "pointer" }}
              alt="Delete"
            />
          </Stack>
        )}
      </TableCell>
    </TableRow>
  ))}
</TableBody>


        

        {/* Edit Modal */}
        <Modal open={openEditModal} onClose={handleCloseEditModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 400 }, // 90% width on extra-small screens, 400px on larger screens
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: { xs: 2, sm: 4 } // Adjust padding for smaller screens
            }}
          >
            <Typography variant="h6" component="h2">
              Edit User
            </Typography>
            {selectedUser && (
              <>
                <TextField
                  fullWidth
                  label="Name"
                  margin="normal"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                {/* <TextField
                  fullWidth
                  label="Email"
                  margin="normal"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                /> */}
                <TextField
                  fullWidth
                  label="Phone Number"
                  margin="normal"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                />
                <TextField
                       select
                       label="Select Machine IP"
                       value={selectedMachineIP}
                       onChange={(e) => setSelectedMachineIP(e.target.value)}
                       fullWidth
                       SelectProps={{
                         native: true,
                       }}
                     >
                       <option value=""></option>
                       {availableMachineIPs.map((ip, index) => (
                         <option key={index} value={ip}>
                           {ip}
                         </option>
                       ))}
                     </TextField>
                <TextField
                  fullWidth
                  label="Status"
                  margin="normal"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  select
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  label="Role"
                  margin="normal"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  select
                >
                  <MenuItem value="employee">Emplyee</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </TextField>
                <Button
                  variant="contained"
                  // color="primary"
                  style={{ backgroundColor: "#15294E" }}
                  sx={{ mt: 2 }}
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </Button>
              </>
            )}
          </Box>
        </Modal>
      </Table>

      <CustomAlert
        open={alert.open}
        onClose={handleAlertClose}
        severity={alert.severity}
        message={alert.message}
      />


    </TableContainer>
  );
}
