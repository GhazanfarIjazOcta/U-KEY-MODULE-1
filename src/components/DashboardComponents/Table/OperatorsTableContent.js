import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import Paper from "@mui/material/Paper";
import { Box, Stack, Switch, Typography } from "@mui/material";
import { TableStyles } from "../../UI/Styles";

import CheckIcon from '@mui/icons-material/Check';
import Edit from "../../../assets/Table/Edit.png";
import Delete from "../../../assets/Table/Delete.png";

import { getDatabase, ref, get, set, update, remove } from "firebase/database";
import { getAuth, deleteUser } from "firebase/auth"; // Import deleteUser from Firebase Authentication
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase"; // Firebase auth instance

import { useUser } from "../../../Context/UserContext";

import { MenuItem, Modal, TextField } from "@mui/material";

import { getApp } from "firebase/app"; // for admin reference
import { getAuth as getAdminAuth } from "firebase/auth";

import { onValue } from "firebase/database";

import CustomAlert from "../../UI/CustomAlert";

export default function OperatorsTableContent() {


  

  const { user } = useUser(); // Destructure user data from context
  const CurrentOrganizationID = user?.organizationID;

   const [alert, setAlert] = useState({
      open: false,
      severity: "success",
      message: "",
    });
    
      const handleAlertClose = () => {
        setAlert({ ...alert, open: false });
      };
  

  console.log(
    "current organisation in operators is [][][] ",
    CurrentOrganizationID
  );

  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOperators = () => {
      const db = getDatabase();
      const usersRef = ref(db, "users"); // Path to the 'users' node in Firebase

      onValue(
        usersRef,
        (snapshot) => {
          const usersData = snapshot.val();

          if (usersData) {
            // Filter users by matching organizationID and role
            const filteredOperators = Object.values(usersData).filter(
              (user) =>
                user.organizationID === CurrentOrganizationID && // Match the current organization
                user.role === "operator" // Ensure role is 'operator'
              // user.status === "active" // Optional: Check if status exists (if necessary)
            );

            console.log(
              "here is the filtered datasssssssss ",
              filteredOperators
            );

            if (filteredOperators.length > 0) {
              setOperators(filteredOperators);
            } else {
              setError("No operators found for this organization.");
            }
          } else {
            setError("No users data found.");
          }
          setLoading(false);
        },
        (err) => {
          setError(err.message); // Handle Firebase errors
          setLoading(false);
        }
      );
    };

    // Fetch operators when the user is authenticated
    if (user && CurrentOrganizationID) {
      fetchOperators(); // Only call fetch if user and organization ID are valid
    } else {
      setError(
        "You must be logged in with a valid organization ID to view this page."
      );
      setLoading(false);
    }

    // No need to unsubscribe if onValue is used because it is a listener
  }, [user, CurrentOrganizationID]); // Rerun effect when user or organization ID changes

  
  const handleStatusToggle = (operatorId, currentStatus) => {
    // Determine new status
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    console.log("here is the operator id sssss", operatorId);

    // Update status in the database
    const db = getDatabase();
    const operatorRef = ref(db, `users/${operatorId}`); // Path to the specific user

    update(operatorRef, { status: newStatus })
      .then(() => {
        console.log(`Operator ${operatorId} status updated to ${newStatus}`);
        // Update state locally to reflect changes
        setOperators((prevOperators) =>
          prevOperators.map((op) =>
            op.userID === operatorId ? { ...op, status: newStatus } : op
          )
        );
        setAlert({
          open: true,
          severity: "success",
          message: "Operator Status Updated!",
        });
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        setAlert({
          open: true,
          severity: "error",
          message: "Operator Status is not Updated!",
        });
      });
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

// const handleAssignMachineIP = (operatorId) => {
//   if (!selectedMachineIP) {
//     setAlert({
//       open: true,
//       severity: "error",
//       message: "Please select a valid Machine IP.",
//     });
//     return;
//   }

//   const db = getDatabase();
//   const operatorRef = ref(db, `users/${operatorId}`);
//   const updatedData = {
//     machineIP: selectedMachineIP, // Assign selected machine IP
//   };

//   // Step 1: Check the machine codes and remove the user's tempIp from the codes field
//   const machineRef = ref(db, `machines/${selectedMachineIP}`);
  
//   get(machineRef)
//     .then((snapshot) => {
//       if (snapshot.exists()) {
        
//         const machineData = snapshot.val();
//         console.log("Machine found:", snapshot.val());

//         const tempSerial  = operators.find(op => op.userID === operatorId).tempSerial;

//         //================================================================================================

//          // Function to traverse and update machines
//       const updateMachines = (data) => {
//         // return data.map(machine => {
//           // Find and move the reference from codes to operators dynamically
//           for (const [key, value] of Object.entries(data.codes)) {
//             if (value === tempSerial) {
//               data.operators[key] = { userID: operatorId };
//               delete data.codes[key];
//             }
//           }
//           return data;
//       //  });
//       };

//       const updatedMachines = updateMachines(machineData);
//       // Update machines in Firebase
//       // updatedMachines.forEach(async (machine) => {
//       //   const machineRef = db.collection('machines').doc(machine.machineID);
//       //   await machineRef.update({ operators: machine.operators });
//       // });

//       // setMachines(updatedMachines);


//         //================================================================================================

        
// // if (machineData.codes[tempSerial]) {  
// //   // If operators object does not exist, initialize it
// //   if (!machineData.operators) {
// //     machineData.operators = {};
// //   }  
// //   // Add the tempSerial to operators with the operatorId
// //   machineData.operators[`-${tempSerial}`] = { userID: operatorId };
  
  

// //   // Remove the tempIp from codes
// //  // Remove the tempSerial from codes, ensuring exact match
// //  if (machineData.codes[tempSerial] === tempSerial) {
// //   delete machineData.codes[tempSerial]; // Ensure the tempSerial is deleted only if the value matches
// // }
// // }


        
//         // Update machine with the userID and new data
//         update(machineRef, {
//           operators: {
//             ...machineData.codes,  [tempSerial]: {
//               userID: operatorId
//             }
//           },
//           // codes: machineData.codes
//         });

//         // Update operator with the selected machine IP
//         update(operatorRef, updatedData)
//           .then(() => {
//             console.log(`Machine IP ${selectedMachineIP} assigned to operator ${operatorId}`);
//             setOperators((prevOperators) =>
//               prevOperators.map((op) =>
//                 op.id === operatorId ? { ...op, machineIP: selectedMachineIP } : op
//               )
//             );
//             setAlert({
//               open: true,
//               severity: "success",
//               message: "Machine IP assigned successfully!",
//             });
//           })
//           .catch((error) => {
//             console.error("Error assigning Machine IP:", error);
//             setAlert({
//               open: true,
//               severity: "error",
//               message: "Failed to assign Machine IP.",
//             });
//           });
//       } else {
//         console.error("Machine not found!");
//         setAlert({
//           open: true,
//           severity: "error",
//           message: "Machine not found!",
//         });
//       }
//     })
//     .catch((error) => {
//       console.error("Error retrieving machine:", error);
//       setAlert({
//         open: true,
//         severity: "error",
//         message: "Failed to retrieve machine details.",
//       });
//     });
// };

const handleAssignMachineIP = (operatorId) => {
  if (!selectedMachineIP) {
    setAlert({
      open: true,
      severity: "error",
      message: "Please select a valid Machine IP.",
    });
    return;
  }

  const db = getDatabase(); // Initialize the database
  const operatorRef = ref(db, `users/${operatorId}`);
  const machineRef = ref(db, `machines/${selectedMachineIP}`);

  // Get operator data
  get(ref(db, `users/${operatorId}`)).then((operatorSnapshot) => {
    const operatorData = operatorSnapshot.val();
    const tempSerial = operatorData.tempSerial;

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
        

        // Add tempSerial to operators
        if (!machineData.operators) {
          machineData.operators = {};
        }
        machineData.operators[tempSerial] = { userID: operatorId };

        // Update machine and operator in Firebase
        update(machineRef, {
          operators: machineData.operators,
          codes: machineData.codes, // Ensure codes remain updated
        });

        update(operatorRef, {
          machineIP: selectedMachineIP,
        });



        update(operatorRef, {
          serialNumbers: {
            ...operatorData.serialNumbers,  // Spread existing serialNumbers if they exist
            [selectedMachineIP]: {
              ip: selectedMachineIP,
              serial: tempSerial,
            },
          },
        });

        console.log(`Machine IP ${selectedMachineIP} assigned to operator ${operatorId}`);
        setOperators((prevOperators) =>
          prevOperators.map((op) =>
            op.id === operatorId ? { ...op, machineIP: selectedMachineIP } : op
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







  if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

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
                  Operator Name/ID
                </Typography>
              </Stack>
            </TableCell>
            <TableCell align="center">
              <Stack
                direction={"row"}
                gap={1}
                sx={{ width: "100%", justifyContent: "center" }}
              >
                <Typography sx={TableStyles.headingStyle}>
                  Assigned Machine
                </Typography>
              </Stack>
            </TableCell>

            <TableCell align="center">
              <Stack
                direction={"row"}
                gap={1}
                sx={{ width: "100%", justifyContent: "center" }}
              >
                <Typography sx={TableStyles.headingStyle}>
                  Company Name
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
                sx={{ width: "100%", justifyContent: "center" }}
              >
                <Typography sx={TableStyles.headingStyle}>Phone</Typography>
              </Stack>
            </TableCell>

            <TableCell align="center">
              <Stack
                direction={"row"}
                gap={1}
                sx={{ width: "100%", justifyContent: "center" }}
              >
                <Typography sx={TableStyles.headingStyle}>
                  Login time
                </Typography>
              </Stack>
            </TableCell>

            <TableCell align="center">
              <Stack
                direction={"row"}
                gap={1}
                sx={{ width: "100%", justifyContent: "center" }}
              >
                <Typography sx={TableStyles.headingStyle}>Actions</Typography>
              </Stack>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {operators.length > 0 ? (
            operators.map((operator) => (
              <TableRow key={operator.id}>
                <TableCell align="center">{operator.name}</TableCell>
                <TableCell align="center">
                  {operator.serialNumbers 
                    ? Object.keys(operator.serialNumbers).join(", ") 
                    : "No Machine IPs"}
                </TableCell>
                <TableCell align="center">{operator.organizationID}</TableCell>
                <TableCell align="center">
                  <Box
                    sx={{
                      width: "80px",
                      height: "25px",
                      backgroundColor:
                        operator.status === "active" ? "#ECFDF3" : "#F2F4F7",
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
                          operator.status === "active" ? "#28A745" : "#6C757D"
                      }}
                    />
                    <Typography
                      fontWeight={500}
                      fontSize={"14px"}
                      sx={{
                        color:
                          operator.status === "active" ? "#037847" : "#364254"
                      }}
                      fontFamily={"Inter"}
                    >
                      {operator.status}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">{operator.phone}</TableCell>
                <TableCell align="center">
                  {operator.lastLogin
                    ? new Date(operator.lastLogin).toLocaleString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        // timeZoneName: "short"
                      })
                    : "N/A"}
                </TableCell>

               

                
                <TableCell align="center">
   <Stack direction={"row"} gap={1} sx={{ width: "100%", justifyContent: "center" }}>
     {/* <Typography sx={TableStyles.headingStyle}>Assign Machine IP</Typography> */}
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
   </Stack>
 </TableCell>


 <TableCell align="center">
  <Stack direction={"row"} justifyContent="center">
    <Switch
      checked={operator.status === "active"}
      onChange={() => handleStatusToggle(operator.userID, operator.status)}
      color="success"
    />
    {/* <img
      src={Edit} // Use your Edit icon
      width="40px"
      height="30px"
      style={{ cursor: "pointer" }}
      alt="Edit"
      onClick={() => handleAssignMachineIP(operator.userID)} // Trigger IP assignment
    /> */}
    <CheckIcon
  width="40px"
  height="30px"
  style={{ cursor: "pointer" }}
  onClick={() => handleAssignMachineIP(operator.userID)} // Trigger IP assignment
  alt="Confirm Update"
/>
  </Stack>
</TableCell>


              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                align="center"
                sx={{ color: "#666", fontSize: "18px", padding: "20px 0" }}
              >
                No operators present in this organisation for now
              </TableCell>
            </TableRow>
          )}
        </TableBody>
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
