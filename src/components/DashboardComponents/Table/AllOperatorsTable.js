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
import { Box, Button, Stack, Typography } from "@mui/material";
import OperatorsIcon from "../../../assets/Sidebar/OperatorsIconSelected.svg";
import Edit from "../../../assets/Table/Edit.png";
import Delete from "../../../assets/Table/Delete.png";
import { TableStyles } from "../../UI/Styles";
import { getDatabase, ref, get, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase"; // Firebase auth instance
import { useUser } from "../../../Context/UserContext";
import { useNavigate } from "react-router-dom";

export default function AllOperatorsTable() {

 const route = 'add-maintenance'; // Define it if it's dynamic

  const navigate = useNavigate();


  const { user } = useUser(); // Destructure user data from context
  const CurrentOrganizationID = user.organizationID;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOperators = () => {
      const db = getDatabase();
      const usersRef = ref(db, "users"); // Correct path to users node

      onValue(
        usersRef,
        (snapshot) => {
          const usersData = snapshot.val();

          if (usersData) {
            // Filter users by matching organizationID and role
            const filteredUsers = Object.values(usersData).filter(
              (user) =>
                user.organizationID === CurrentOrganizationID && // Match current organization
                user.role === "operator" && // Ensure role is exactly 'operator'
                user.status // Optional: Check if status field exists to avoid errors
            );

            setUsers(filteredUsers);
          } else {
            setUsers([]); // No users found, set empty array
            setError("No users found for this organization.");
          }
          setLoading(false);
        },
        (err) => {
          setError(err.message); // Handle Firebase-related errors
          setLoading(false);
        }
      );
    };

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        fetchOperators(); // Fetch data when the user is authenticated
      } else {
        setError("You must be logged in to view this page.");
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, [CurrentOrganizationID]); // Rerun when organization ID changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box
      sx={{
        padding: "1rem 2rem 0.5rem 1rem",
        marginRight: "0rem",
        background: "#FFF",
        height: 350
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "1.5rem",
          alignItems: "center",
          justifyContent: "space-between"
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
            <img src={OperatorsIcon} />
          </Box>
          <Typography
            sx={{ fontFamily: "Poppins", fontSize: "0.8rem", color: "#909097" }}
          >
            All Operators
          </Typography>
        </Box>
        <Button
          variant="text"
          sx={{
            color: "#F38712",
            fontWeight: 500,
            fontFamily: "Poppins",
            textTransform: "none",
            fontSize: "0.75rem"
          }}

          onClick={()=> navigate("operators")}
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
          height: "60%"
        }}
      >
        <Table aria-label="simple table">
          <TableHead sx={{ backgroundColor: "#FCFCFD" }}>
            <TableRow>
              <TableCell align="right">
                <Typography sx={TableStyles.headingStyle}>
                  Operator Name/ID
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography sx={TableStyles.headingStyle}>
                  Assigned Machine
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography sx={TableStyles.headingStyle}>
                  Last Login
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography sx={TableStyles.headingStyle}>Status</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No operator in this organization
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.userID}>
                  <TableCell align="center">{user.name}</TableCell>
                  <TableCell align="center">{user.email || "N/A"}</TableCell>
                  <TableCell align="start">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true
                        })
                      : "N/A"}
                  </TableCell>
                  <TableCell align="center">{user.status || "N/A"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
