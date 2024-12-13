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
            op.id === operatorId ? { ...op, status: newStatus } : op
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
                <TableCell align="center">{operator.name}</TableCell>
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
                        timeZoneName: "short"
                      })
                    : "N/A"}
                </TableCell>
                <TableCell align="start">
                  <Stack direction={"row"} justifyContent="center">
                    <Switch
                      checked={operator.status === "active"} // Determines if the toggle is ON
                      onChange={() =>
                        handleStatusToggle(operator.userID, operator.status)
                      } // Handle toggle action
                      color="success" // Optional: Green toggle for "active"
                      inputProps={{
                        "aria-label": `Toggle status for ${operator.name}`
                      }} // Accessibility
                    />
                    {/* <img
                      src={Delete}
                      width="40px"
                      height="30px"
                      style={{ cursor: "pointer" }}
                      alt="Delete"
                    /> */}
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
