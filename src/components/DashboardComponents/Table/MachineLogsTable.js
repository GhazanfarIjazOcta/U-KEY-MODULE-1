import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { Box, Stack, Typography } from "@mui/material";
import MachinesIcon from "../../../assets/Sidebar/MachinesIconSelected.svg";
import { TableStyles } from "../../UI/Styles";


import { useState, useEffect } from "react";

import { rtdb, ref, get } from "../../../firebase";
import { onValue } from "firebase/database";
import { useUser } from "../../../Context/UserContext";
// import { getDatabase, ref, get, set, update, remove } from "firebase/database";

import Tooltip from "@mui/material/Tooltip";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function MachineLogsTable() {
  const { user, updateUserData } = useUser(); // Destructure user data from context
  console.log("user organization id in ", user.organizationID);

  const CurrentUserID = user.userID;
  const CurrentOrganizationID = user.organizationID;

  const [logs, setLogs] = useState([]);

  let allLogs = [];

  console.log("here are the engine logs ..,.,.,.,., ", logs);

  useEffect(() => {
    const loguserRef = ref(rtdb, "users");  
  
    // Setup real-time listener for the users data
    const unsubscribe = onValue(loguserRef, (snapshot) => {
      if (snapshot.exists()) {
        const logusers = snapshot.val();
        const orgUsers = Object.values(logusers).filter(
          (user) => user.organizationID === CurrentOrganizationID
        );
  
       
  
        orgUsers.forEach((user) => {
          const userID = "M5YXpZpmehgWRmlyYPwzFpbK6qU2"; // Replace with actual logic if needed
  
          if (userID) {
            const userRef = ref(rtdb, `users/${userID}`);
            
            get(userRef)
              .then((userSnapshot) => {
                if (userSnapshot.exists()) {
                  const userData = userSnapshot.val();
                  const userName = userData.name; // Ensure correct fetching of userName
                  const machineIP = user.machineID; // Assuming you want machine IP
                  const userPorts = Object.values(userData.serialNumbers).map(
                    (entry) => entry.serial
                  );
                  const organizationID = userData.organizationID;
  
                  // Collect logs
                  const logs = {
                    userID,
                    userName,
                    machineIP,
                    organizationID,
                    userPorts,
                    engineLogs: userData["Engine Logs"],
                    routeLogs: userData["Route Logs"],
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
        });
      } else {
        console.warn("No users found for the current organization ID.");
      }
    });
  
    // Cleanup function to stop listening to real-time updates
    return () => unsubscribe();
  }, [CurrentOrganizationID]);
  
 

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

        // const allLogs = [];

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
                  <Typography sx={TableStyles.headingStyle}>
                    Start time
                  </Typography>
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
              logs.some(
                (log) =>
                  log.routeLogs && Object.values(log.routeLogs).length > 0
              ) ? (
                logs.map((log) => {
                  const routeLogs =
                    log.routeLogs && typeof log.routeLogs === "object"
                      ? Object.values(log.routeLogs)
                      : [];
                  return (
                    <React.Fragment key={log.userID}>
                      {routeLogs.map((routeLog, index) => (
                        <TableRow
                          key={`${log.userID}-${index}`}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 }
                          }}
                        >
                          {/* <TableCell
                            align="center"
                            sx={{ margin: "0px", padding: "15px" }}
                          >
                            <Typography sx={TableStyles.textStyle}>
                              {log.machineIP}
                            </Typography>
                          </TableCell> */}
                          <TableCell
                            align="center"
                            sx={{ margin: "0px", padding: "15px" }}
                          >
                            <Typography sx={{ fontSize: "14px" }}>
                              <Tooltip
                                title={`Lat: ${routeLog.Lat}, Long: ${routeLog.long}`}
                                arrow
                              >
                                {routeLog.Lat && routeLog.long ? (
                                  <span
                                    style={{
                                      // cursor: "pointer",
                                      // color: "blue",
                                      // textDecoration: "underline",
                                      color: "#F38712",
                                      fontSize: "0.9rem",
                                      fontFamily: "Inter",
                                      textDecoration: "underline",
                                      cursor: "pointer",
                                      whiteSpace: "nowrap",
                                      fontWeight: "bold"
                                    }}
                                    onClick={() =>
                                      window.open(
                                        `https://www.google.com/maps/search/?api=1&query=${routeLog.Lat},${routeLog.long}`,
                                        "_blank"
                                      )
                                    }
                                  >
                                    {`${routeLog.Lat || "NA"}, ${
                                      routeLog.long || "NA"
                                    }`}{" "}
                                    <OpenInNewIcon fontSize="small" />
                                  </span>
                                ) : (
                                  "NA"
                                )}
                              </Tooltip>
                            </Typography>
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ margin: "0px", padding: "15px" }}
                          >
                            <Typography sx={TableStyles.textStyle}>
                              {routeLog.date || "NA"}
                            </Typography>
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ margin: "0px", padding: "15px" }}
                          >
                            <Typography sx={TableStyles.textStyle}>
                              {routeLog.start_time || "NA"}
                            </Typography>
                          </TableCell>
                          {/* <TableCell align="center" sx={{ margin: "0px", padding: "15px" }}>
                            <Typography sx={TableStyles.textStyle}>{routeLog.end_time || "NA"}</Typography>
                          </TableCell> */}
                          <TableCell
                            align="center"
                            sx={{ margin: "0px", padding: "15px" }}
                          >
                            <Typography sx={TableStyles.textStyle}>
                              {log.userPort || "NA"}
                            </Typography>
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ margin: "0px", padding: "15px" }}
                          >
                            <Typography sx={TableStyles.textStyle}>
                              {log.organizationID || "NA"}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={7}>
                    <Typography sx={TableStyles.textStyle}>
                      No logs found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={7}>
                  <Typography sx={TableStyles.textStyle}>
                    Loading logs...
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
