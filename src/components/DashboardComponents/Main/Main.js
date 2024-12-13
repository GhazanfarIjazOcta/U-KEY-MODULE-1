import React, { useState, useEffect } from "react";
import {
    Box,
    Grid2,
} from "@mui/material";

import DashboardCard from "../Card/DashboardCard";
import DevicesCard from "../Card/DevicesCard";
import DevicesLogo from "../../../assets/Card/DevicesLogo.png";
import VehicleLogo from "../../../assets/Card/VehicleLogo.png";
import DriversLogo from "../../../assets/Card/DriversLogo.png";
import user from "../../../assets/Card/user.png";
import DashboardMaintenanceCard from "../Card/DashboardMaintenanceCard";
import DashboardLocationCard from "../Card/DashboardLocationCard";
import MachineLogsTable from "../Table/MachineLogsTable";
import RecentActivityLogsTable from "../Table/RecentActivityLogsTable";
import AllOperatorsTable from "../Table/AllOperatorsTable";
import TotalCard from "../Card/TotalCard";
import AlertsCard from "../Card/AlertsCard";

import Switch from '@mui/material/Switch'; // For default export
import { useUser } from "../../../Context/UserContext";

import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { getDatabase, ref, get, update, remove } from "firebase/database";

import { auth } from "../../../firebase"; // Firebase auth instance

import { onValue } from "firebase/database"; // Import onValue

export default function Main() {



    const { user, updateUserData } = useUser(); // Destructure user data from context
    console.log("user role in organisation table is  " , user.organizationID)
  
  
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [organizationCounts, setOrganizationCounts] = useState({
        total: 0,
        active: 0,
        inactive: 0
      });
      



      useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
          if (user) {
            try {
              const db = getDatabase();
              const organizationsRef = ref(db, "organizations");
      
              // Use onValue for real-time updates
              const unsubscribeDB = onValue(organizationsRef, (snapshot) => {
                if (snapshot.exists()) {
                  const orgData = snapshot.val();
                  const orgList = Object.keys(orgData).map((key) => ({
                    id: key,
                    ...orgData[key],
                  }));
      
                  // Counting total, active, and inactive organizations
                  const totalOrganizations = orgList.length;
                  const activeOrganizations = orgList.filter((org) => org.status === 'active').length;
                  const inactiveOrganizations = orgList.filter((org) => org.status === 'inactive').length;
      
                  setOrganizations(orgList);
                  setOrganizationCounts({
                    total: totalOrganizations,
                    active: activeOrganizations,
                    inactive: inactiveOrganizations,
                  });
                } else {
                  setError("No organizations found.");
                }
              });
      
              // Cleanup the database listener when the component unmounts
              return () => unsubscribeDB();
            } catch (err) {
              setError(err.message);
            }
          } else {
            setError("You must be logged in to view this page.");
            navigate("/login");
          }
          setLoading(false);
        });
      
        // Cleanup the auth listener when the component unmounts
        return () => unsubscribeAuth();
      }, [navigate]);
      




    return (

        <Box sx={{
            flexGrow: 1, position: 'absolute',
            mt: { xs: 0, sm: 0, md: 0, lg: 5 },
            overflowY: "auto",
            height: "85vh",
            background: "#F4F7F7",
            gap: "0.5rem",
            width: { lg: "82%", xs: "100%" },// Prevent overflowing horizontally and vertically
        }} >

            <Grid2
                container
                spacing={1}
                mt={1}
                pr={{ lg: 2 }}
                columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
            >


                <Grid2 container size={{ xs: 12, sm: 12, md: 6.5 }}>
                    <Grid2 container spacing={1} style={{ display: 'flex', alignItems: 'stretch', margin: 0, }}>
                        <Grid2 item size={{ xs: 12, sm: 5, md: 5 }} style={{ display: 'flex', padding: 0, }}>
                            <TotalCard
                                icon={"CompaniesIcon"}
                                title={"Total Companies"}
                                totalNumber={organizationCounts.total}
                                activeNumber={organizationCounts.active}
                                inactiveNumber={organizationCounts.inactive}
                                maintenanceNumber={null}
                            />
                        </Grid2>
                        <Grid2 item size={{ xs: 12, sm: 7, md: 7 }} style={{ display: 'flex', padding: 0, }}>
                            <TotalCard
                                icon={"MachinesIcon"}
                                title={"Total Machines"}
                                totalNumber={"06"}
                                activeNumber={"13"}
                                inactiveNumber={"13"}
                                maintenanceNumber={"12"}
                            />
                        </Grid2>
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                        <DashboardLocationCard />
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                        <RecentActivityLogsTable />
                    </Grid2>
                </Grid2>


                <Grid2 container spacing={1} size={{ xs: 12, sm: 12, md: 5.5 }}>
                    <Grid2 size={{ xs: 12, sm: 12, md: 12 }} >
                        <AlertsCard />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                        <AllOperatorsTable />
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                        <DashboardMaintenanceCard />
                    </Grid2>
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 12 }} >
                    <MachineLogsTable />
                </Grid2>


            </Grid2>
        </Box >

    );
}

