import React, { useEffect, useState } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import AlertIcon from '../../../assets/Sidebar/AlertIcon.svg';
import CircleSharpIcon from '@mui/icons-material/CircleSharp';
import MachinesIcon from "../../../assets/Sidebar/MachinesIconSelected.svg";
import { getDatabase, ref, query, onValue, orderByChild, equalTo } from 'firebase/database';
import { useUser } from "../../../Context/UserContext";

function AlertsCard() {
    const [alertsData, setAlertsData] = useState([]);
    const [newAlerts, setNewAlerts] = useState([]);
    const [previousAlerts, setPreviousAlerts] = useState([]);

    const { user } = useUser(); // Destructure user data from context
    const CurrentUserID = user.userID;
    const userOrganizationID = user.organizationID;

    useEffect(() => {
        const db = getDatabase();
        const alertsRef = query(ref(db, 'machines'), orderByChild('organizationID'), equalTo(userOrganizationID));

        const unsubscribe = onValue(alertsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const formattedData = Object.entries(data).flatMap(([machineID, machine]) => {
                    if (Array.isArray(machine.maintenance)) {
                        return machine.maintenance.map((alert) => ({
                            ...alert,
                            machineID, // Include machine ID for reference
                        }));
                    }
                    return []; // Return an empty array if maintenance is not an array
                });
                

                // Separate alerts based on status
                const pendingAlerts = formattedData.filter(alert => alert.status === 'Pending');
                const completedAlerts = formattedData.filter(alert => alert.status === 'Completed');

                setNewAlerts(pendingAlerts);
                setPreviousAlerts(completedAlerts);
            } else {
                setNewAlerts([]);
                setPreviousAlerts([]);
            }
        });

        return () => unsubscribe();
    }, [userOrganizationID]);

    const renderAlert = (alert, statusColor) => (
        <Box
            key={alert.id}
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "0.5rem",
                paddingRight: "1rem",
            }}
        >
            <Box sx={{ display: "flex", gap: "1rem" }}>
                <img src={MachinesIcon} width={17} alt="Machine Icon" />
                <Typography sx={{ fontFamily: "Poppins", fontSize: "0.75rem", color: "#373737" }}>
                    (Machine ID: {alert.machineID}) requires {alert.maintenanceDetails}
                </Typography>
            </Box>
            <CircleSharpIcon sx={{ color: statusColor, fontSize: "0.5rem" }} />
        </Box>
    );

    return (
        <Box
            sx={{
                background: "#FFF",
                padding: "1rem 1rem",
                gap: "1.5rem",
                display: "flex",
                flexDirection: "column",
                height: 250,
                overflowY: "auto",
            }}
        >
            {/* Alerts Header */}
            <Box sx={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                <Box
                    sx={{
                        width: 44,
                        height: 40,
                        background: "#FEF2E5",
                        borderRadius: "0.7rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                    }}
                >
                    <img src={AlertIcon} alt="Alert Icon" />
                    <Box
                        sx={{
                            position: "absolute",
                            borderRadius: "50%",
                            width: 13,
                            height: 13,
                            background: "#F75151",
                            top: -5,
                            right: -5,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <span style={{ fontSize: "0.6rem", color: "#FFF" }}>{newAlerts.length}</span>
                    </Box>
                </Box>
                <Typography sx={{ fontFamily: "Poppins", fontSize: "0.8rem", color: "#909097" }}>
                    Alerts
                </Typography>
            </Box>

            {/* New Alerts */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "0.5rem",
                    paddingRight: "0.5rem",
                }}
            >
                <Typography sx={{ fontFamily: "Poppins", fontSize: "0.6rem", color: "#7C7C7C" }}>New</Typography>
                <Divider sx={{ background: "1px #7C7C7C", width: "90%" }} />
            </Box>
            {newAlerts.length > 0 ? (
                newAlerts.map((alert) => renderAlert(alert, "#FE9B10"))
            ) : (
                <Typography
                    sx={{
                        fontFamily: "Poppins",
                        fontSize: "0.75rem",
                        color: "#909097",
                        textAlign: "center",
                    }}
                >
                    No new alerts
                </Typography>
            )}

            {/* Previous Alerts */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "0.5rem",
                    paddingRight: "0.5rem",
                }}
            >
                <Typography sx={{ fontFamily: "Poppins", fontSize: "0.6rem", color: "#7C7C7C" }}>Previous</Typography>
                <Divider sx={{ background: "1px #7C7C7C", width: "90%" }} />
            </Box>
            {previousAlerts.length > 0 ? (
                previousAlerts.map((alert) => renderAlert(alert, "#4CAF50"))
            ) : (
                <Typography
                    sx={{
                        fontFamily: "Poppins",
                        fontSize: "0.75rem",
                        color: "#909097",
                        textAlign: "center",
                    }}
                >
                    No previous alerts
                </Typography>
            )}
        </Box>
    );
}

export default AlertsCard;
