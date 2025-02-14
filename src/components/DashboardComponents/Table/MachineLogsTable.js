// REACT IMPORTS
import * as React from "react";
import { useState, useEffect } from "react";

// MUI IMPORTS
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Stack, Typography } from "@mui/material";
import MachinesIcon from "../../../assets/Sidebar/MachinesIconSelected.svg";
import { TableStyles } from "../../UI/Styles";

// FIREBASE IMPORTS
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
  const [logusersID, setLogUsersID] = useState([]);
  const [logusers, setLogUsers] = useState([]);

  console.log("users id for logs >>>>>>>>>", logusersID);
  console.log("users for logs >>>>>>>>>", logusers);

  const [engineLogs, setEngineLogs] = useState([]);
  const [routeLogs, setRouteLogs] = useState([]);

  console.log("engine logs }}}}}}}}}}}}}>>>>>>>>>", engineLogs);
  console.log("route logs }}}}}}}}}}}}}}>>>>>>>>>", routeLogs);

  let allLogs = [];

  console.log("here are the engine logs ..,.,.,.,., ", logs);

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
                console.log(
                  "User ID: ____________________________________",
                  userID
                );
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
                        userPort: Object.values(
                          userData.serialNumbers || {}
                        ).map((entry) => entry.serial),
                        engineLogs: engineLogs || "No Engine Logs",
                        routeLogs: routeLogs || "No Engine Logs"
                      };

                      // Update logs
                      allLogs.push(logs);
                      setLogs([...allLogs]);
                      console.log("Collected Logs:>>>>>>>>>>>>>", logs);
                    } else {
                      console.warn(
                        `User ID ${userID} does not exist in the database.`
                      );
                    }
                  })
                  .catch((error) =>
                    console.error(
                      `Error fetching user data for ${userID}:`,
                      error
                    )
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
              </TableCell>  */}
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
                          <TableCell
                            align="center"
                            sx={{ margin: "0px", padding: "15px" }}
                          >
                            <Typography sx={TableStyles.textStyle}>
                              {log.machineIP}
                            </Typography>
                          </TableCell>
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
