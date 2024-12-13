import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import Paper from "@mui/material/Paper";
import { Stack, Typography } from "@mui/material";
import { getDatabase, ref, query, equalTo, orderByChild, onValue, update } from "firebase/database"; // Import Firebase utilities
import { useUser } from "../../../Context/UserContext";
import CustomAlert from "../../UI/CustomAlert";

const MaintenanceTableContent = () => {
  const [maintenanceData, setMaintenanceData] = useState([]);
  const { user } = useUser(); // Get user data from context
  const CurrentOrganizationID = user?.organizationID;


  const [alert, setAlert] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  useEffect(() => {
    if (!CurrentOrganizationID) return;

    // Initialize Firebase database
    const db = getDatabase();
    const machinesRef = ref(db, "machines"); // Pointing to the machines node

    // Query machine data by organizationID
    const machinesQuery = query(
      machinesRef,
      orderByChild("organizationID"), // Order by organizationID
      equalTo(CurrentOrganizationID) // Filter by current organizationID
    );

    onValue(
      machinesQuery,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log("Fetched data: ", data); // Debugging log

          const parsedData = Object.keys(data).map((key) => {
            const machine = data[key];
            const maintenanceInfo = Array.isArray(machine.maintenance)
              ? machine.maintenance
              : []; // Ensure maintenanceInfo is always an array

            // Create a new object to include the machine data and its maintenance info
            return {
              machineID: machine.machineID,
              machineName: machine.machineName || "Unknown", // Handle missing machine name
              maintenanceData: maintenanceInfo,
            };
          });

          setMaintenanceData(parsedData);
        } else {
          console.log("No machines found for this organization."); // Debugging log
          setMaintenanceData([]);
        }
      },
      (error) => {
        console.error("Error fetching data: ", error); // Debugging log
      }
    );
  }, [CurrentOrganizationID]);

  const handleStatusChange = (machineID, maintenanceIndex, newStatus) => {
    const db = getDatabase();
    const machineRef = ref(db, `machines/${machineID}/maintenance/${maintenanceIndex}`);
    update(machineRef, {
      status: newStatus,
    }).then(() => {
      setMaintenanceData((prevData) => {
        return prevData.map((record) => {
          if (record.machineID === machineID) {
            
            const updatedMaintenance = [...record.maintenanceData];
            updatedMaintenance[maintenanceIndex] = {
              ...updatedMaintenance[maintenanceIndex],
              status: newStatus,
            };
            setAlert({
              open: true,
              severity: "success",
              message: "Maintenance Status Updated!",
            });
            return { ...record, maintenanceData: updatedMaintenance };
          }
          
          return record;
        });
      });
    }).catch((error) => {
      console.error("Error updating maintenance status:", error); // Debugging log
      setAlert({
        open: true,
        severity: "error",
        message: "Error updating maintenance status: see console",
      });
    });
  };



 

  return (
    <TableContainer
      sx={{
        borderRadius: 0,
        borderTop: "1px solid #EAECF0",
        marginTop: "2.5rem",
        background: "#FFF",
        height: "60%",
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="Maintenance Table">
        <TableHead sx={{ backgroundColor: "#FCFCFD" }}>
          <TableRow>
            <TableCell align="center">Machine ID/Name</TableCell>
            <TableCell align="center">Maintenance Name</TableCell>
            <TableCell align="center">Next Maintenance</TableCell>
            <TableCell align="center">Recent Maintenance</TableCell>
            <TableCell align="center">Maintenance Details</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {maintenanceData.length > 0 ? (
            maintenanceData.map((record) =>
              Array.isArray(record.maintenanceData) ? (
                record.maintenanceData.map((maintenance, index) => (
                  <TableRow key={`${record.machineID}-${maintenance.nextMaintenance}`}>
                    <TableCell align="center">{maintenance.machineID || "N/A"}</TableCell>
                    {/* <TableCell align="center">{record.machineName || "N/A"}</TableCell> */}
                    <TableCell align="center">{maintenance.maintenanceName || "N/A"}</TableCell>
                    <TableCell align="center">{maintenance.nextMaintenance || "N/A"}</TableCell>
                    <TableCell align="center">{maintenance.recentMaintenance || "N/A"}</TableCell>
                    <TableCell align="center">{maintenance.maintenanceDetails || "None"}</TableCell>
                    <TableCell align="center">
                      <Typography
                        sx={{
                          color: maintenance.status === "Completed" ? "#28A745" : "#DC3545",
                        }}
                      >
                        {maintenance.status || "Unknown"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
  <Stack direction="row" gap={2} justifyContent="center">
    {/* Show Done icon only if status is 'Pending' */}
    {maintenance.status === 'Pending' && (
      <DoneOutlinedIcon
        sx={{ color: "#28A745", cursor: "pointer" }}
        onClick={() => handleStatusChange(record.machineID, index, "Completed")}
      />
    )}

    {/* Show Clear icon only if status is 'Completed' */}
    {maintenance.status === 'Completed' && (
      <ClearOutlinedIcon
        sx={{ color: "#DC3545", cursor: "pointer" }}
        onClick={() => handleStatusChange(record.machineID, index, "Pending")}
      />
    )}
  </Stack>
</TableCell>

                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={6}>
                    No maintenance records found.
                  </TableCell>
                </TableRow>
              )
            )
          ) : (
            <TableRow>
              <TableCell align="center" colSpan={6}>
                No machines found for this organization.
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
};

export default MaintenanceTableContent;
