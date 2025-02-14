// Mui imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import OutlinedCard from "../Card/Card";
import UserLogo from "../../../assets/Card/user.png";
import AdminLogo from "../../../assets/Card/adminIcon.png";
import DriverLogo from "../../../assets/Card/DriversLogo.png";
import GuestLogo from "../../../assets/Card/GuestLogo.png";
import TableHeader from "../TableHeader/TableHeader";
import TableContent from "../Table/UserManagmentTableContent";
import TablePagination from "../Pagination/TablePagination";

// React imports
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// fire base imports
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase";
import { getDatabase, ref, get, set, update, remove } from "firebase/database";
import { getAuth, deleteUser } from "firebase/auth"; // Import deleteUser from Firebase Authentication
import { onValue } from "firebase/database"; // Import onValue

// components imports
import { useUser } from "../../../Context/UserContext";
import { userManagement } from "../../UI/Main";

export default function UserManagment() {
  const { user, updateUserData } = useUser(); // Destructure user data from context
  const sidebarWidth = 12; // Adjust this based on your sidebar's width

  console.log("here is the user info", auth.currentUser);
  console.log("user organization id", user.organizationID);
  const CurrentUserID = user.uid;
  console.log("user current id", CurrentUserID);
  const CurrentOrganizationID = user.organizationID;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [totalUsers, setTotalUsers] = useState(0);
  const [adminUsers, setAdminUsers] = useState(0);
  const [operatorUsers, setOperatorUsers] = useState(0);
  const [employeeUsers, setEmployeeUsers] = useState(0);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // Check if the user is authenticated
        try {
          const db = getDatabase();
          const usersRef = ref(db, `users`); // Adjusted to fetch all users, not under a specific organization

          // Use onValue for real-time updates
          const unsubscribeDB = onValue(usersRef, (snapshot) => {
            if (snapshot.exists()) {
              const allUsers = snapshot.val();

              // Convert the users object to an array
              const filteredUsers = Object.keys(allUsers)
                .map((key) => ({
                  id: key,
                  ...allUsers[key]
                }))
                .filter(
                  (user) => user.organizationID === CurrentOrganizationID
                ); // Filter users by organizationID

              // Set filtered users in state
              setUsers(filteredUsers);

              // Count total users
              const totalUsers = filteredUsers.length;

              // Count users with 'admin' role
              const adminUsers = filteredUsers.filter(
                (user) => user.role === "admin"
              ).length;

              // Count users with 'operator' role
              const operatorUsers = filteredUsers.filter(
                (user) => user.role === "operator"
              ).length;

              // Count users with 'employee' role
              const employeeUsers = filteredUsers.filter(
                (user) => user.role === "employee"
              ).length;

              // Set the counts in state
              setTotalUsers(totalUsers);
              setAdminUsers(adminUsers);
              setOperatorUsers(operatorUsers);
              setEmployeeUsers(employeeUsers);
            } else {
              setError("No users found.");
            }
          });

          // Cleanup the database listener when the component unmounts
          return () => unsubscribeDB();
        } catch (err) {
          setError(err.message);
        }
      } else {
        setError("You must be logged in to view this page.");
        // navigate("/login"); // Optional redirect to login if the user is not authenticated
      }
      setLoading(false); // Set loading to false after fetching data
    });

    // Cleanup the auth listener when the component unmounts
    return () => unsubscribeAuth();
  }, [navigate, CurrentOrganizationID]); // Add CurrentOrganizationID to dependency array

  return (
    <Box
      sx={{
        ...userManagement.mainboxUserManagement
      }}
    >
      <Grid
        container
        spacing={2}
        a
        sx={{
          flexGrow: 1,
          flexWrap: "wrap"
        }}
      >
        {/* Allow the cards to shrink when zoomed in */}
        <Grid item xs={13} sm={6} md={2.98} sx={{ flexShrink: 1 }}>
          <OutlinedCard
            text={"All Users"}
            icon={UserLogo}
            secText={totalUsers}
          />
        </Grid>

        <Grid item xs={13} sm={6} md={2.98} sx={{ flexShrink: 1 }}>
          <OutlinedCard text={"Admin"} icon={AdminLogo} secText={adminUsers} />
        </Grid>
        <Grid item xs={13} sm={6} md={2.98} sx={{ flexShrink: 1 }}>
          <OutlinedCard
            text={"Operators"}
            icon={DriverLogo}
            secText={operatorUsers}
          />
        </Grid>
        <Grid item xs={13} sm={6} md={2.98} sx={{ flexShrink: 1 }}>
          <OutlinedCard
            text={"Employee"}
            icon={GuestLogo}
            secText={employeeUsers}
          />
        </Grid>
      </Grid>

      <Box sx={{ width: "100%" }}>
        <Box mt={2}>
          <TableHeader
            text={"User Management"}
            searchText={"User name"}
            buttonText={"Add Admin"}
            route={"add-user"}
          />
        </Box>

        <Box sx={{ overflowX: "none", width: "100%" }}>
          <TableContent />
        </Box>

        <TablePagination />
      </Box>
    </Box>
  );
}
