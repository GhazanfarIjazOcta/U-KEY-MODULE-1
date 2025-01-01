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

import { getDatabase, ref, get, onValue } from "firebase/database";

import { auth } from "../../../firebase"; // Firebase auth instance

import {dashboardStylesAdmin} from "../../UI/Main"


export default function AdminMain() {
  const { user, updateUserData } = useUser(); // Destructure user data from context
  const CurrentOrganizationID = user.organizationID || [];




  const [userCounts, setUserCounts] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  useEffect(() => {
    const fetchUsers = () => {
      const db = getDatabase();
      const usersRef = ref(db, "users"); // Reference to all users

      onValue(usersRef, (snapshot) => {
        const usersData = snapshot.val();

        if (usersData) {
          let total = 0;
          let activeCount = 0;
          let inactiveCount = 0;

          // Loop through all users and filter by organizationID
          Object.values(usersData).forEach((user) => {
            if (user.organizationID === CurrentOrganizationID) {
              total += 1;
              if (user.status === "active") {
                activeCount += 1;
              } else if (user.status === "inactive") {
                inactiveCount += 1;
              }
            }
          });

          setUserCounts({
            total,
            active: activeCount,
            inactive: inactiveCount,
          });
        } else {
          setUserCounts({ total: 0, active: 0, inactive: 0 });
        }
      });
    };

    fetchUsers();
  }, [CurrentOrganizationID]); // Re-run effect when the organization ID changes




  const [machineCounts, setMachineCounts] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  useEffect(() => {
    const fetchMachines = () => {
      const db = getDatabase();
      const machinesRef = ref(db, "machines"); // Reference to all machines

      onValue(machinesRef, (snapshot) => {
        const machinesData = snapshot.val();

        if (machinesData) {
          let total = 0;
          let activeCount = 0;
          let inactiveCount = 0;

          // Loop through all machines and filter by organizationID
          Object.values(machinesData).forEach((machine) => {
            if (machine.organizationID === CurrentOrganizationID) {
              total += 1;
              if (machine.status === "active") {
                activeCount += 1;
              } else if (machine.status === "inactive") {
                inactiveCount += 1;
              }
            }
          });

          setMachineCounts({
            total,
            active: activeCount,
            inactive: inactiveCount,
          });
        } else {
          setMachineCounts({ total: 0, active: 0, inactive: 0 });
        }
      });
    };

    fetchMachines();
  }, [CurrentOrganizationID]); // Re-run effect when the organization ID changes

  

  return (
    <Box
      sx={{
               ...dashboardStylesAdmin.mainbox
      }}
    >
      <Grid2
        container
        spacing={1}
        mt={1}
        pr={{ lg: 2 }}
        columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
      >
        <Grid2 container size={{ xs: 12, sm: 12, md: 6.5 }}>
          <Grid2 container spacing={1} style={{ display: 'flex', alignItems: 'stretch', margin: 0 }}>
            <Grid2 item size={{ xs: 12, sm: 5, md: 5 }} style={{ display: 'flex', padding: 0 }}>
              <TotalCard
                icon={"CompaniesIcon"}
                title={"Total Users"}
                totalNumber={userCounts.total}
                activeNumber={userCounts.active}
                inactiveNumber={userCounts.inactive}
                maintenanceNumber={null}
              />
            </Grid2>
            <Grid2 item size={{ xs: 12, sm: 7, md: 7 }} style={{ display: 'flex', padding: 0 }}>
              <TotalCard
                icon={"MachinesIcon"}
                title={"Total Machines"}
                totalNumber={machineCounts.total}
                activeNumber={machineCounts.active}
                inactiveNumber={machineCounts.inactive}
                maintenanceNumber={"0"}
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
          <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
            <AlertsCard />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
            <AllOperatorsTable />
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
            <DashboardMaintenanceCard />
          </Grid2>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 12 }}>
          <MachineLogsTable />
        </Grid2>
      </Grid2>
    </Box>
  );
}
