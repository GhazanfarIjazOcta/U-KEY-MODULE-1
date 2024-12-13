import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Stack, Typography } from "@mui/material";
import { TableStyles } from "../../UI/Styles";
import { getDatabase, ref, get, update, remove } from "firebase/database";
import { getAuth, deleteUser } from "firebase/auth"; // Import deleteUser from Firebase Authentication
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase"; // Firebase auth instance

import Edit from "../../../assets/Table/Edit.png";
import Delete from "../../../assets/Table/Delete.png";

import Switch from "@mui/material/Switch"; // For default export
import { onValue } from "firebase/database"; // Import onValue
import CustomAlert from "../../UI/CustomAlert";

export default function CompaniesTableContent() {
  const [organizations, setOrganizations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  console.log("these are my organisations ", organizations);

    const [alert, setAlert] = useState({
      open: false,
      severity: "success",
      message: "",
    });
  
    const handleAlertClose = () => {
      setAlert({ ...alert, open: false });
    };

  useEffect(() => {
    const db = getDatabase();

    // Fetch organizations
    const organizationsRef = ref(db, "organizations");
    setLoading(true);

    const unsubscribe = onValue(
      organizationsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const orgData = snapshot.val();
          // Convert nested objects into array
          const orgList = Object.keys(orgData).map((key) => ({
            id: key,
            ...orgData[key]
          }));
          setOrganizations(orgList);
          setError(null);
          console.log("organization list is ", orgList);
        } else {
          setOrganizations([]);
          setError("No organizations found.");
        }
      },
      (error) => {
        setError("Error fetching data: " + error.message);
      }
    );

    // Fetch users
    const usersRef = ref(db, "users");
    onValue(
      usersRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          const userList = Object.keys(userData).map((key) => ({
            userID: key,
            ...userData[key]
          }));
          setUsers(userList);
        }
      },
      (error) => {
        setError("Error fetching users: " + error.message);
      }
    );

    return () => {
      unsubscribe();
      console.log("Listener unsubscribed");
    };
  }, []);

  // Activate/Deactivate Organization
  const handleActivateDeactivate = async (organizationId, status) => {
    try {
      const db = getDatabase();
      const orgRef = ref(db, `organizations/${organizationId}`);
      await update(orgRef, {
        status: status === "active" ? "inactive" : "active"
      });

      setOrganizations((prev) =>
        prev.map((org) =>
          org.id === organizationId
            ? { ...org, status: status === "active" ? "inactive" : "active" }
            : org
        )
      );
      setAlert({
        open: true,
        severity: "success",
        message: "Organization Status Updated!",
      });
    } catch (err) {
      setError("Error updating status: " + err.message);
    }
  };

  // Delete Organization and Associated Users & Machines
  const handleDeleteOrganization = async (organizationId) => {
    try {
      const db = getDatabase();
      const authInstance = getAuth();
      const orgRef = ref(db, `organizations/${organizationId}`);

      const orgSnapshot = await get(orgRef); // Fetch organization to access nested users
      if (orgSnapshot.exists()) {
        const { users } = orgSnapshot.val();

        // Delete users from Authentication and Database
        if (users) {
          const userIDs = Object.keys(users);
          for (const userId of userIDs) {
            const userRef = ref(
              db,
              `users/${userId}` // Update to fetch from users node
            );
            await remove(userRef); // Remove user node

            try {
              const currentUser = authInstance.currentUser;
              if (currentUser && currentUser.uid === userId) {
                await deleteUser(currentUser); // Delete authenticated user
                console.log(`User ${userId} deleted from Authentication`);
              }
            } catch (authError) {
              console.log(`Error deleting user: ${authError.message}`);
            }
          }
        }
      }

      // Remove entire organization node
      await remove(orgRef);
      setOrganizations((prev) =>
        prev.filter((org) => org.id !== organizationId)
      );
      // alert("Organization and users deleted.");
      setAlert({
        open: true,
        severity: "success",
        message: "Organization and users deleted.",
      });
    } catch (err) {
      // setError("Error deleting organization: " + err.message);
      setAlert({
        open: true,
        severity: "error",
        message: "Error deleting organization: " + err.message,
      });
    }
  };

  // // Render states
  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
            <TableCell align="start">
              <Typography sx={TableStyles.headingStyle}>
                Company Name
              </Typography>
            </TableCell>
            <TableCell align="start">
              <Typography sx={TableStyles.headingStyle}>
                Company Address
              </Typography>
            </TableCell>
            <TableCell align="start">
              <Typography sx={TableStyles.headingStyle}>
                Creator Name
              </Typography>
            </TableCell>
            <TableCell align="start">
              <Typography sx={TableStyles.headingStyle}>
                Total Operators
              </Typography>
            </TableCell>
            <TableCell align="start">
              <Typography sx={TableStyles.headingStyle}>Machines</Typography>
            </TableCell>
            <TableCell align="start">
              <Typography sx={TableStyles.headingStyle}>Users</Typography>
            </TableCell>
            <TableCell align="start">
              <Typography sx={TableStyles.headingStyle}>
                Subscription Status
              </Typography>
            </TableCell>
            <TableCell align="start">
              <Typography sx={TableStyles.headingStyle}>Action</Typography>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {organizations.map((organization) => {
            // Get users for the current organization
            const orgUsers = users.filter(
              (user) => user.organizationID === organization.id
            );

            return (
              <TableRow key={organization.id}>
                <TableCell align="start">{organization.name}</TableCell>
                <TableCell align="start">{organization.address}</TableCell>
                <TableCell align="start">
                  {orgUsers.filter((user) => user.role === "admin" || user.role === "superAdmin").map((user) => user.name).join(", ")}
                </TableCell>
                <TableCell align="start">
                  {orgUsers.filter((user) => user.role === "operator").length}
                </TableCell>
                <TableCell align="start">{orgUsers.length}</TableCell>
                <TableCell align="start">
                  {orgUsers.length}
                </TableCell>
                <TableCell align="start">
                  <Box
                    sx={{
                      width: "80px",
                      height: "25px",
                      backgroundColor:
                        organization.status === "active" ? "#ECFDF3" : "#F2F4F7",
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
                          organization.status === "active" ? "#28A745" : "#6C757D"
                      }}
                    />
                    <Typography
                      fontWeight={500}
                      fontSize={"14px"}
                      sx={{
                        color:
                          organization.status === "active" ? "#037847" : "#364254"
                      }}
                      fontFamily={"Inter"}
                    >
                      {organization.status}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="start">
                  <Stack direction={"row"} justifyContent="start">
                    <Switch
                      checked={organization.status === "active"}
                      onChange={() =>
                        handleActivateDeactivate(
                          organization.id,
                          organization.status
                        )
                      }
                      color={organization.status === "active" ? "success" : "error"}
                      inputProps={{ "aria-label": "toggle organization status" }}
                    />
                    <img
                      src={Delete}
                      width="40px"
                      height="30px"
                      onClick={() => handleDeleteOrganization(organization.id)}
                      style={{ cursor: "pointer" }}
                      alt="Delete"
                    />
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
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
