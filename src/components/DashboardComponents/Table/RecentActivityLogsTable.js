import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import Paper from "@mui/material/Paper";
import { Box, Button, Stack, Typography } from "@mui/material";
import MachinesIcon from "../../../assets/Sidebar/MachinesIconSelected.svg";
import { TableStyles } from "../../UI/Styles";


import Edit from "../../../assets/Table/Edit.png";
import Delete from "../../../assets/Table/Delete.png";

import { onValue } from "firebase/database";



import { useState } from "react";
import { useEffect } from "react";

import { rtdb, ref, get, child } from "../../../firebase";
import { useUser } from "../../../Context/UserContext";
// import { getDatabase, ref, get, set, update, remove } from "firebase/database";



export default function RecentActivityLogsTable() {


    const { user, updateUserData } = useUser(); // Destructure user data from context
    console.log("user organization id in ", user.organizationID);
  
    const CurrentUserID = user.userID;

    console.log("userid => " , CurrentUserID)
  
    console.log("user current id in ", CurrentUserID);
    const CurrentOrganizationID = user.organizationID;
  
    const [logs, setLogs] = useState([]);
     const [logusersID, setLogUsersID] = useState([]);
      const [logusers, setLogUsers] = useState([]);

        const [engineLogs, setEngineLogs] = useState([]);
      const [routeLogs, setRouteLogs] = useState([]);
      
  
    console.log("here are the engine logs ..,.,.,.,., ", logs);


     let allLogs = [];
    
      console.log("here are the engine logs ..,.,.,.,., ", logs);
    
    
  
//=============Dummy with sooman=============================================================================

    // useEffect(() => {
    //     const machinesRef = ref(rtdb, "machines");
      
    //     // Listen to real-time updates
    //     const unsubscribe = onValue(machinesRef, (snapshot) => {
    //       if (snapshot.exists()) {
    //         const machines = snapshot.val();
    //         const orgMachines = Object.values(machines).filter(
    //           (machine) => machine.organizationID === CurrentOrganizationID
    //         );
      
    //         // const allLogs = [];
      
    //         orgMachines.forEach((machine) => {
    //           for (const serial in machine.operators) {
    //             // const userID = machine.operators[serial]?.userID;

    //             const userID = "M5YXpZpmehgWRmlyYPwzFpbK6qU2"; // Replace with actual logic if needed
  
      
    //             if (userID) {
    //               const userRef = ref(rtdb, `users/${userID}`);
    //               get(userRef)
    //                 .then((userSnapshot) => {
    //                   if (userSnapshot.exists()) {
    //                     const userData = userSnapshot.val();
    //                     const userName = userData.name; 
    //                     const organizationID = userData.organizationID;
    //                     const machineIP = machine.machineID; 
    //                     const userPort = Object.values(userData.serialNumbers).map(
    //                       (entry) => entry.serial
    //                     );
      
    //                     const logs = {
    //                       userID,
    //                       userName,
    //                       machineIP,
    //                       organizationID,
    //                       userPort,
    //                       engineLogs: userData["Engine Logs"],
    //                       routeLogs: userData["Route Logs"],
    //                     };
      
    //                     allLogs.push(logs);
    //                     setLogs([...allLogs]);
    //                   } else {
    //                     console.warn(`User ID ${userID} does not exist.`);
    //                   }
    //                 })
    //                 .catch((error) => {
    //                   console.error(
    //                     `Error fetching user data for ${userID}:`,
    //                     error
    //                   );
    //                 });
    //             }
    //           }
    //         });
    //       }
    //     }, (error) => {
    //       console.error("Error fetching data:", error);
    //     });
      
    //     // Cleanup to unsubscribe from the listener
    //     return () => unsubscribe();
    //   }, [CurrentOrganizationID]);

//==========================================================================================

        useEffect(() => {
          const machinesRef = ref(rtdb, "machines");
          const usersRef = ref(rtdb, "users");
        
          // Function to fetch and filter users with logs
          const fetchUsersWithLogs = () => {
            const unsubscribeLoguser = onValue(usersRef, (snapshot) => {
              if (snapshot.exists()) {
                const users = snapshot.val();
        
                // Filter users by organization ID and ensure they have logs
                const filteredUsers = Object.values(users).filter(
                  (user) =>
                    user.organizationID === CurrentOrganizationID &&
                    user["Engine Logs"] &&
                    user["Route Logs"]
                );
      
                const extractLogs = () => {
                  const engineLogsArray = [];
                  const routeLogsArray = [];
                
                  filteredUsers.forEach((user) => {
                    // Extracting engine logs
                    if (user["Engine Logs"]) {
                      const engineLogsData = Object.values(user["Engine Logs"]);
                      engineLogsArray.push(...engineLogsData);
                    }
                
                    // Extracting route logs
                    if (user["Route Logs"]) {
                      const routeLogsData = Object.values(user["Route Logs"]);
                      routeLogsArray.push(...routeLogsData);
                    }
                  });
                
                  setEngineLogs(engineLogsArray);
                  setRouteLogs(routeLogsArray);
                };
                
                // Call the extractLogs function
                extractLogs();
      
                setLogUsers(filteredUsers);
      
        
                // Extract user IDs
                const userIds = filteredUsers.map((user) => user.userID || user.id); // Use `user.id` if `user.userID` is not available
                setLogUsersID(userIds);
        
                console.log("Filtered User IDs:", userIds);
                console.log("Filtered Users with Logs:", filteredUsers);
              } else {
                console.warn("No users found for the current organization ID.");
              }
            });
        
            return unsubscribeLoguser;
          };
        
          // Function to fetch machines and associate logs with users
          const fetchMachinesAndLogs = (userIds) => {
            const unsubscribeMachines = onValue(machinesRef, (snapshot) => {
              if (snapshot.exists()) {
                const machines = snapshot.val();
        
                // Filter machines by organization ID
                const orgMachines = Object.values(machines).filter(
                  (machine) => machine.organizationID === CurrentOrganizationID
                );
        
                console.log("Filtered Machines:", orgMachines);
        
                const allLogs = [];
        
                orgMachines.forEach((machine) => {
                  // Iterate over operators and match with user IDs
                  Object.keys(machine.operators || {}).forEach((operatorKey) => {
                    const userID = machine.operators[operatorKey]?.userID;
        
                    if (userID) {
                      const userRef = ref(rtdb, `users/${userID}`);
                      console.log("User ID: ____________________________________", userID);
                      get(userRef)
                        .then((userSnapshot) => {
                          if (userSnapshot.exists()) {
                            const userData = userSnapshot.val();
                          
      
                            const logusers = userData["Route Logs"];
                            
                            const logs = {
                              userID,
                              userName: userData.name || "Unknown",
                              machineIP: machine.machineID || "Unknown",
                              organizationID: userData.organizationID,
                              userPort: Object.values(userData.serialNumbers || {}).map(
                                (entry) => entry.serial
                              ),
                              engineLogs: engineLogs || "No Engine Logs",
                              routeLogs: routeLogs|| "No Engine Logs",
                           
                            };
        
                            // Update logs
                            allLogs.push(logs);
                            setLogs([...allLogs]);
                            console.log("Collected Logs:>>>>>>>>>>>>>", logs);
        
                            
                          } else {
                            console.warn(`User ID ${userID} does not exist in the database.`);
                          }
                        })
                        .catch((error) =>
                          console.error(`Error fetching user data for ${userID}:`, error)
                        );
                    }
                  });
                });
      
      
              } else {
                console.warn("No machines found for the current organization ID.");
              }
      
            });
        
            return unsubscribeMachines;
          };
        
          // Manage listeners
          const unsubscribeLoguser = fetchUsersWithLogs();
        
          let unsubscribeMachines;
          if (logusersID.length > 0) {
            unsubscribeMachines = fetchMachinesAndLogs(logusersID);
          }
        
          // Cleanup listeners
          return () => {
            if (unsubscribeLoguser) unsubscribeLoguser();
            if (unsubscribeMachines) unsubscribeMachines();
          };
        }, [CurrentOrganizationID, logusersID]);
        
  
    const data = logs.map((log) => ({
      userID: log.userID || "1234",
      userName: log.userName || "Unknown", // Fallback if userName doesn't exist
      machineIP: log.machineIP,
      organizationID:  log.organizationID,
      userPort: log.userPort,
      lastOperation: log.engineLogs
        ? log.engineLogs[Object.keys(log.engineLogs)[0]]
        : {} // First log as an example
    }));

    console.log("the data here " , data)


    



    return (
        <Box sx={{ padding: "1rem 2rem 1rem 1rem", marginRight: "0rem", background: "#FFF", height: "410px", }}>
            <Box sx={{ display: "flex", gap: "1.5rem", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                    <Box sx={{ width: 44, height: 40, background: "#FEF2E5", borderRadius: "0.7rem", display: "flex", justifyContent: "center", alignItems: "center" }}> <img src={MachinesIcon} /> </Box>
                    <Typography sx={{ fontFamily: "Poppins", fontSize: "0.8rem", color: "#909097" }}>
                        Recent Activity Logs
                    </Typography>
                </Box>
                <Button
                    variant="text"
                    sx={{
                        color: "#F38712",
                        textTransform: "none",
                        fontWeight: 500,
                        fontFamily: "Poppins",
                        fontSize: "0.75rem",
                        display: "flex",
                        alignItems: "center",
                        "&:hover": {
                            backgroundColor: "",
                        },
                    }}
                >
                    View More
                </Button>
            </Box>
            <TableContainer
                sx={{
                    borderRadius: 0,
                    elevation: 0,
                    borderTop: "1px solid #EAECF0",
                    marginTop: "2.5rem",
                    background: "#FFF",
                    height: "60%",
                    overflowX: "auto",
                }}
            >
                <Table sx={{}} aria-label="simple table">


                    <TableHead sx={{ backgroundColor: "#FCFCFD" }}>
                        <TableRow>
                            {/* <TableCell align="right">
                                <Stack
                                    direction={"row"}
                                    gap={1}
                                    sx={{ width: "100%", justifyContent: "center" }}
                                >
                                    <Typography sx={TableStyles.headingStyle}>

                                        Machine ID/ Name
                                    </Typography>
                                </Stack>
                            </TableCell> */}

                            <TableCell align="center">
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
                                    <Typography sx={TableStyles.headingStyle}>

                                        User
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

                                        Login Time
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

                                        Logout Time
                                    </Typography>
                                </Stack>
                            </TableCell> */}

                            <TableCell align="center">
                                <Stack
                                    direction={"row"}
                                    gap={1}
                                    sx={{ width: "100%", justifyContent: "center" }}
                                >
                                    <Typography sx={TableStyles.headingStyle}>

                                        Duration
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

                                        Date
                                    </Typography>
                                </Stack>
                            </TableCell>

                        </TableRow>
                    </TableHead>



<TableBody>
  {logs.length > 0 ? (
    logs.map((log) => {
      const engineLogs = log.engineLogs && typeof log.engineLogs === 'object' ? Object.values(log.engineLogs) : [];
      
      return (
        <React.Fragment key={log.userID}>
          {engineLogs.map((engineLog, index) => (
            <TableRow
              key={`${log.userID}-${index}`}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {/* <TableCell align="center" sx={{ margin: "0px", padding: "15px" }}>
                <Typography sx={TableStyles.textStyle}>{log.machineIP}</Typography>
              </TableCell> */}

              <TableCell align="center" sx={{ margin: "0px", padding: "15px" }}>
                <Typography sx={TableStyles.textStyle}>{log.userName}</Typography>
              </TableCell>

              <TableCell align="center" sx={{ margin: "0px", padding: "15px" }}>
                <Typography sx={TableStyles.textStyle}>{log.organizationID}</Typography>
              </TableCell>

              <TableCell align="center" sx={{ margin: "0px", padding: "15px" }}>
                <Typography sx={TableStyles.textStyle}>{log.userPort}</Typography>
              </TableCell>

              <TableCell align="center" sx={{ margin: "0px", padding: "15px" }}>
                <Typography sx={TableStyles.textStyle}>
                  {engineLog.start_time || "NA"}
                </Typography>
              </TableCell>

              {/* <TableCell align="center" sx={{ margin: "0px", padding: "15px" }}>
                <Typography sx={TableStyles.textStyle}>{engineLog.end_time || "NA"}</Typography>
              </TableCell> */}

              <TableCell align="center" sx={{ margin: "0px", padding: "15px" }}>
                <Typography sx={TableStyles.textStyle}>{engineLog.lift_duration || "NA"}</Typography>
              </TableCell>

              <TableCell align="center" sx={{ margin: "0px", padding: "15px" }}>
                <Typography sx={TableStyles.textStyle}>{engineLog.date || "NA"}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </React.Fragment>
      );
    })
  ) : (
    <TableRow>
      <TableCell colSpan={8} align="center" sx={{ padding: "20px" }}>
        <Typography
          variant="h6"
          sx={{
            color: "gray",
            fontStyle: "italic",
            fontWeight: "bold",
          }}
        >
          No Recent Activity so far
        </Typography>
      </TableCell>
    </TableRow>
  )}
</TableBody>




                </Table>
            </TableContainer>
        </Box>
    );
}
