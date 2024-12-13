// import * as React from "react";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
// import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
// import Paper from "@mui/material/Paper";
// import { Box, Stack, Typography } from "@mui/material";
// import MachinesIcon from "../../../assets/Sidebar/MachinesIconSelected.svg";
// import { TableStyles } from "../../UI/Styles";

// import Edit from "../../../assets/Table/Edit.png";
// import Delete from "../../../assets/Table/Delete.png";
// import { useState } from "react";
// import { useEffect } from "react";

// import { rtdb, ref, get, child } from "../../../firebase";
// import { useUser } from "../../../Context/UserContext";
// // import { getDatabase, ref, get, set, update, remove } from "firebase/database";

// import Tooltip from '@mui/material/Tooltip';
// import OpenInNewIcon from '@mui/icons-material/OpenInNew';



// export default function MachineLogsTable() {
//   const { user, updateUserData } = useUser(); // Destructure user data from context
//   console.log("user organization id in ", user.organizationID);

//   let mapLink = ``;


//   const CurrentUserID = user.userID;

//   console.log("user current id in ", CurrentUserID);
//   const CurrentOrganizationID = user.organizationID;

//   const [logs, setLogs] = useState([]);

//   console.log("here are the engine logs ..,.,.,.,., ", logs);

//   useEffect(() => {
//     const machinesRef = ref(rtdb, "machines");

//     // Fetch machines data
//     get(machinesRef)
//       .then((snapshot) => {
//         if (snapshot.exists()) {
//           const machines = snapshot.val();

//           // Filter machines by current organizationID
//           const orgMachines = Object.values(machines).filter(
//             (machine) => machine.organizationID === CurrentOrganizationID
//           );

//           const allLogs = [];

//           orgMachines.forEach((machine) => {
//             // Iterate over operator IDs
//             for (const serial in machine.operators) {
//               const userID = machine.operators[serial]?.userID;

//               if (userID) {
//                 // Check if the user exists in the database
//                 const userRef = ref(rtdb, `users/${userID}`);
//                 get(userRef)
//                   .then((userSnapshot) => {
//                     if (userSnapshot.exists()) {
//                       const userData = userSnapshot.val();
//                       const userName = userData.name; // Ensure correct fetching of userName
//                       const machineIP = machine.machineID; // Assuming you want machine IP
//                       const userPort = Object.values(userData.serialNumbers).map(
//                         (entry) => entry.serial
//                       );
//                       const organizationID = userData.organizationID;
//                       console.log(
//                         "we get the user data u hue hue  <><><><> ",
//                         userData
//                       );
//                       // Collect logs
//                       const logs = {
//                         userID,
//                         userName,
//                         machineIP,

//                         organizationID,
//                           userPort,
//                         engineLogs: userData["Engine Logs"],
//                         routeLogs: userData["Route Logs"]
//                       };

//                       allLogs.push(logs);

//                       // Update logs state
//                       setLogs([...allLogs]);
//                     } else {
//                       console.warn(`User ID ${userID} does not exist.`);
//                     }
//                   })
//                   .catch((error) => {
//                     console.error(
//                       `Error fetching user data for ${userID}:`,
//                       error
//                     );
//                   });
//               }
//             }
//           });
//         }
//       })
//       .catch((error) => console.error("Error fetching data:", error));
//   }, [CurrentOrganizationID]);

//   const data = logs.map((log) => ({
//     userID: log.userID,
//     userName: log.userName || "Unknown", // Fallback if userName doesn't exist
//     machineIP: log.machineIP,
//     lastOperation: log.engineLogs
//       ? log.engineLogs[Object.keys(log.engineLogs)[0]]
//       : {} // First log as an example
//   }));

//   return (
//     <Box
//       sx={{
//         padding: "1rem 2rem 1rem 1rem",
//         marginRight: "0rem",
//         background: "#FFF"
//       }}
//     >
//       <Box sx={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
//         <Box
//           sx={{
//             width: 44,
//             height: 40,
//             background: "#FEF2E5",
//             borderRadius: "0.7rem",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center"
//           }}
//         >
//           {" "}
//           <img src={MachinesIcon} />{" "}
//         </Box>
//         <Typography
//           sx={{ fontFamily: "Poppins", fontSize: "0.8rem", color: "#909097" }}
//         >
//           Machine Route Logs
//         </Typography>
//       </Box>
//       <TableContainer
//         sx={{
//           borderRadius: 0,
//           elevation: 0,
//           borderTop: "1px solid #EAECF0",
//           marginTop: "2.5rem",
//           background: "#FFF",
//           height: "60%",
//           minWidth: "300px",
//           width: "100%"
//           // overflowX: "auto",
//         }}
//       >
//         <Table>

//           <TableHead sx={{ backgroundColor: "#FCFCFD" }}>
//             <TableRow>
//               <TableCell align="right">
//                 <Stack
//                   direction={"row"}
//                   gap={1}
//                   sx={{ width: "100%", justifyContent: "center" }}
//                 >
//                   <Typography sx={TableStyles.headingStyle}>
//                     Machine ID/ Name
//                   </Typography>
//                 </Stack>
//               </TableCell>

//               <TableCell align="center">
//                 <Stack
//                   direction={"row"}
//                   gap={1}
//                   sx={{ width: "100%", justifyContent: "center" }}
//                 >
//                   <Typography sx={TableStyles.headingStyle}>
//                     Last Location
//                   </Typography>
//                 </Stack>
//               </TableCell>
//               <TableCell align="center">
//                 <Stack
//                   direction={"row"}
//                   gap={1}
//                   sx={{ width: "100%", justifyContent: "center" }}
//                 >
//                   <Typography sx={TableStyles.headingStyle}>
//                     (Time/Date)
//                   </Typography>
//                 </Stack>
//               </TableCell>

//               <TableCell align="center">
//                 <Stack
//                   direction={"row"}
//                   gap={1}
//                   sx={{ width: "100%", justifyContent: "center" }}
//                 >
//                   <Typography sx={TableStyles.headingStyle}>
//                     Start time
//                   </Typography>
//                 </Stack>
//               </TableCell>
//               <TableCell align="center">
//                 <Stack
//                   direction={"row"}
//                   gap={1}
//                   sx={{ width: "100%", justifyContent: "center" }}
//                 >
//                   <Typography sx={TableStyles.headingStyle}>
//                     End time
//                   </Typography>
//                 </Stack>
//               </TableCell>

//               <TableCell align="center">
//                 <Stack
//                   direction={"row"}
//                   gap={1}
//                   sx={{ width: "100%", justifyContent: "center" }}
//                 >
//                   <Typography sx={TableStyles.headingStyle}>
//                   Recent Users (4-digit PIN)	
//                   </Typography>
//                 </Stack>
//               </TableCell>
//               <TableCell align="center">
//                 <Stack
//                   direction={"row"}
//                   gap={1}
//                   sx={{ width: "100%", justifyContent: "center" }}
//                 >
//                   <Typography sx={TableStyles.headingStyle}>
//                     Organisation ID
//                   </Typography>
//                 </Stack>
//               </TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//   {logs.length > 0 ? (
//     logs.some((log) => log.routeLogs && Object.values(log.routeLogs).length > 0) ? (
//       logs.map((log) => {
//         const routeLogs = log.routeLogs && typeof log.routeLogs === 'object' ? Object.values(log.routeLogs) : [];
        
//         return (
//           <React.Fragment key={log.userID}>
//             {routeLogs.map((routeLog, index) => (
//               <TableRow
//                 key={`${log.userID}-${index}`}
//                 sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
//               >
//                 <TableCell align="center" sx={{ margin: "0px", padding: "15px" }}>
//                   <Typography sx={TableStyles.textStyle}>{log.machineIP}</Typography>
//                 </TableCell>

//                 <TableCell align="center" sx={{ margin: "0px", padding: "15px" }}>
//                   <Typography sx={{ fontSize: "14px" }}>
//                     <Tooltip title={`Lat: ${routeLog.Lat}, Long: ${routeLog.long}`} arrow>
//                       {routeLog.Lat && routeLog.long ? (
//                         <span
//                           style={{
//                             cursor: "pointer",
//                             color: "blue",
//                             textDecoration: "underline",
//                           }}
//                           onClick={() =>
//                             window.open(
//                               `https://www.google.com/maps/search/?api=1&query=${routeLog.Lat},${routeLog.long}`,
//                               "_blank"
//                             )
//                           }
//                         >
//                           {`${routeLog.Lat || "NA"}, ${routeLog.long || "NA"}`} <OpenInNewIcon fontSize="small" />
//                         </span>
//                       ) : (
//                         "NA"
//                       )}
//                     </Tooltip>
//                   </Typography>
//                 </TableCell>

//                 <TableCell align="center" sx={{ margin: "0px", padding: "15px" }}>
//                   <Typography sx={TableStyles.textStyle}>{routeLog.date || "NA"}</Typography>
//                 </TableCell>

//                 <TableCell align="center" sx={{ margin: "0px", padding: "15px" }}>
//                   <Typography sx={TableStyles.textStyle}>{routeLog.start_time || "NA"}</Typography>
//                 </TableCell>

//                 <TableCell align="center" sx={{ margin: "0px", padding: "15px" }}>
//                   <Typography sx={TableStyles.textStyle}>{routeLog.end_time || "NA"}</Typography>
//                 </TableCell>

//                 <TableCell align="center" sx={{ margin: "0px", padding: "15px" }}>
//                   <Typography sx={TableStyles.textStyle}>{log.userPort || "NA"}</Typography>
//                 </TableCell>

//                 <TableCell align="center" sx={{ margin: "0px", padding: "15px" }}>
//                   <Typography sx={TableStyles.textStyle}>{log.organizationID || "NA"}</Typography>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </React.Fragment>
//         );
//       })
//     ) : (
//       <TableRow>
//         <TableCell colSpan={7} align="center" sx={{ padding: "20px" }}>
//           <Typography
//             variant="h6"
//             sx={{
//               color: "gray",
//               fontStyle: "italic",
//               fontWeight: "bold",
//             }}
//           >
//             No Machine Routes logs so far
//           </Typography>
//         </TableCell>
//       </TableRow>
//     )
//   ) : (
//     <TableRow>
//       <TableCell colSpan={7} align="center" sx={{ padding: "20px" }}>
//         <Typography
//           variant="h6"
//           sx={{
//             color: "gray",
//             fontStyle: "italic",
//             fontWeight: "bold",
//           }}
//         >
//           No Machine Routes logs so far
//         </Typography>
//       </TableCell>
//     </TableRow>
//   )}
// </TableBody>



          
//           <Table></Table>;
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// }


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
import { Box, Stack, Typography } from "@mui/material";
import MachinesIcon from "../../../assets/Sidebar/MachinesIconSelected.svg";
import { TableStyles } from "../../UI/Styles";

import Edit from "../../../assets/Table/Edit.png";
import Delete from "../../../assets/Table/Delete.png";
import { useState, useEffect } from "react";

import { rtdb, ref,  get, child } from "../../../firebase";
import { onValue } from "firebase/database";
import { useUser } from "../../../Context/UserContext";
// import { getDatabase, ref, get, set, update, remove } from "firebase/database";

import Tooltip from '@mui/material/Tooltip';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function MachineLogsTable() {
  const { user, updateUserData } = useUser(); // Destructure user data from context
  console.log("user organization id in ", user.organizationID);

  const CurrentUserID = user.userID;
  const CurrentOrganizationID = user.organizationID;

  const [logs, setLogs] = useState([]);

  console.log("here are the engine logs ..,.,.,.,., ", logs);

  useEffect(() => {
    const machinesRef = ref(rtdb, "machines");

    // Setup real-time listener for the machines data
    const unsubscribe = onValue(machinesRef, (snapshot) => {
      if (snapshot.exists()) {
        const machines = snapshot.val();

        // Filter machines by current organizationID
        const orgMachines = Object.values(machines).filter(
          (machine) => machine.organizationID === CurrentOrganizationID
        );

        const allLogs = [];

        orgMachines.forEach((machine) => {
          // Iterate over operator IDs
          for (const serial in machine.operators) {
            const userID = machine.operators[serial]?.userID;

            if (userID) {
              // Check if the user exists in the database
              const userRef = ref(rtdb, `users/${userID}`);
              get(userRef)
                .then((userSnapshot) => {
                  if (userSnapshot.exists()) {
                    const userData = userSnapshot.val();
                    const userName = userData.name; // Ensure correct fetching of userName
                    const machineIP = machine.machineID; // Assuming you want machine IP
                    const userPort = Object.values(userData.serialNumbers).map(
                      (entry) => entry.serial
                    );
                    const organizationID = userData.organizationID;
                    console.log(
                      "we get the user data u hue hue  <><><><> ",
                      userData
                    );
                    // Collect logs
                    const logs = {
                      userID,
                      userName,
                      machineIP,
                      organizationID,
                      userPort,
                      engineLogs: userData["Engine Logs"],
                      routeLogs: userData["Route Logs"]
                    };

                    allLogs.push(logs);

                    // Update logs state
                    setLogs([...allLogs]);
                  } else {
                    console.warn(`User ID ${userID} does not exist.`);
                  }
                })
                .catch((error) => {
                  console.error(
                    `Error fetching user data for ${userID}:`,
                    error
                  );
                });
            }
          }
        });
      } else {
        console.warn("No machines found for the current organization ID.");
      }
    });

    // Cleanup function to stop listening to real-time updates
    return () => unsubscribe();
  }, [CurrentOrganizationID]);

  const data = logs.map((log) => ({
    userID: log.userID,
    userName: log.userName || "Unknown", // Fallback if userName doesn't exist
    machineIP: log.machineIP,
    lastOperation: log.engineLogs
      ? log.engineLogs[Object.keys(log.engineLogs)[0]]
      : {} // First log as an example
  }));

  return (
    <Box
      sx={{
        padding: "1rem 2rem 1rem 1rem",
        marginRight: "0rem",
        background: "#FFF"
      }}
    >
      <Box sx={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <Box
          sx={{
            width: 44,
            height: 40,
            background: "#FEF2E5",
            borderRadius: "0.7rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {" "}
          <img src={MachinesIcon} alt="Machines Icon" />{" "}
        </Box>
        <Typography
          sx={{ fontFamily: "Poppins", fontSize: "0.8rem", color: "#909097" }}
        >
          Machine Route Logs
        </Typography>
      </Box>
      <TableContainer
        sx={{
          borderRadius: 0,
          elevation: 0,
          borderTop: "1px solid #EAECF0",
          marginTop: "2.5rem",
          background: "#FFF",
          height: "60%",
          minWidth: "300px",
          width: "100%"
        }}
      >
        <Table>
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
                  <Typography sx={TableStyles.headingStyle}>
                    Last Location
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
                    (Time/Date)
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell align="center">
                <Stack
                  direction={"row"}
                  gap={1}
                  sx={{ width: "100%", justifyContent: "center" }}
                >
                  <Typography sx={TableStyles.headingStyle}>Start time</Typography>
                </Stack>
              </TableCell>
              {/* <TableCell align="center">
                <Stack
                  direction={"row"}
                  gap={1}
                  sx={{ width: "100%", justifyContent: "center" }}
                >
                  <Typography sx={TableStyles.headingStyle}>End time</Typography>
                </Stack>
              </TableCell> */}
              <TableCell align="center">
                <Stack
                  direction={"row"}
                  gap={1}
                  sx={{ width: "100%", justifyContent: "center" }}
                >
                  <Typography sx={TableStyles.headingStyle}>
                    Recent Users (4-digit PIN)
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
                    Organization ID
                  </Typography>
                </Stack>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.length > 0 ? (
              logs.some((log) => log.routeLogs && Object.values(log.routeLogs).length > 0) ? (
                logs.map((log) => {
                  const routeLogs = log.routeLogs && typeof log.routeLogs === "object" ? Object.values(log.routeLogs) : [];
                  return (
                    <React.Fragment key={log.userID}>
                      {routeLogs.map((routeLog, index) => (
                        <TableRow
                          key={`${log.userID}-${index}`}
                          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                        >
                          <TableCell align="center" sx={{ margin: "0px", padding: "15px" }}>
                            <Typography sx={TableStyles.textStyle}>{log.machineIP}</Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ margin: "0px", padding: "15px" }}>
                            <Typography sx={{ fontSize: "14px" }}>
                              <Tooltip title={`Lat: ${routeLog.Lat}, Long: ${routeLog.long}`} arrow>
                                {routeLog.Lat && routeLog.long ? (
                                  <span
                                    style={{
                                      cursor: "pointer",
                                      color: "blue",
                                      textDecoration: "underline",
                                    }}
                                    onClick={() =>
                                      window.open(
                                        `https://www.google.com/maps/search/?api=1&query=${routeLog.Lat},${routeLog.long}`,
                                        "_blank"
                                      )
                                    }
                                  >
                                    {`${routeLog.Lat || "NA"}, ${routeLog.long || "NA"}`} <OpenInNewIcon fontSize="small" />
                                  </span>
                                ) : (
                                  "NA"
                                )}
                              </Tooltip>
                            </Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ margin: "0px", padding: "15px" }}>
                            <Typography sx={TableStyles.textStyle}>{routeLog.date || "NA"}</Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ margin: "0px", padding: "15px" }}>
                            <Typography sx={TableStyles.textStyle}>{routeLog.start_time || "NA"}</Typography>
                          </TableCell>
                          {/* <TableCell align="center" sx={{ margin: "0px", padding: "15px" }}>
                            <Typography sx={TableStyles.textStyle}>{routeLog.end_time || "NA"}</Typography>
                          </TableCell> */}
                          <TableCell align="center" sx={{ margin: "0px", padding: "15px" }}>
                            <Typography sx={TableStyles.textStyle}>{log.userPort || "NA"}</Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ margin: "0px", padding: "15px" }}>
                            <Typography sx={TableStyles.textStyle}>{log.organizationID || "NA"}</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={7}>
                    <Typography sx={TableStyles.textStyle}>No logs found.</Typography>
                  </TableCell>
                </TableRow>
              )
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={7}>
                  <Typography sx={TableStyles.textStyle}>Loading logs...</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

