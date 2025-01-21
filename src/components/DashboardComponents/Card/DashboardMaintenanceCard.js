import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { Button, Divider, Grid, Stack, Typography, Modal } from "@mui/material";
import MaintenanceIcon from "../../../assets/Sidebar/MaintenanceIconSelected.svg";
import { useUser } from "../../../Context/UserContext";
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  onValue // Import onValue to listen for real-time changes
} from "firebase/database"; // Firebase imports

export default function DashboardMaintenanceCard() {
  const { user } = useUser(); // Destructure user data from context
  const CurrentUserID = user.userID;
  const userOrganizationID = user.organizationID;

  const [activeTab, setActiveTab] = useState("history");
  const [currentPage, setCurrentPage] = useState(1);
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  console.log("here is the maintenance dataaaaa [][ ", maintenanceData);

  const dataPerPage = 100; // Adjust the number of items per page

  // Fetch maintenance data from Firebase with real-time updates
  useEffect(() => {
    const db = getDatabase();
    const maintenanceRef = ref(db, "machines");

    // Query to get maintenance data for the specific organization
    const queryRef = query(
      maintenanceRef,
      orderByChild("organizationID"),
      equalTo(userOrganizationID)
    );

    // Real-time listener
    const unsubscribe = onValue(queryRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Process data to fit the structure expected
        const formattedData = Object.values(data).flatMap(
          (machine) => machine.maintenance || []
        );
        setMaintenanceData(formattedData);
      } else {
        console.log("No data found");
        setMaintenanceData([]); // Ensure state is reset when no data
      }
      setLoading(false); // Stop loading after data is fetched
    });

    // Clean up listener on component unmount
    return () => unsubscribe();
  }, [userOrganizationID]);

  // Fallback if maintenanceData is undefined
  const data = maintenanceData || [];

  // Filter the data based on the active tab
  const filteredData =
    activeTab === "history"
      ? data.filter(
          (item) => item.status === "Completed" && item.status !== undefined
        )
      : data.filter(
          (item) => item.status === "Pending" && item.status !== undefined
        );

  // Pagination logic
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);

  const totalPages = Math.ceil(filteredData.length / dataPerPage);

  // Modal Content
  const renderModal = () => {
    const upcomingData = filteredData.filter(
      (item) => item.status === "Pending"
    );
    const historyData = filteredData.filter(
      (item) => item.status === "Completed"
    );

    let modalUseData = [null];

    if (activeTab == "history") {
      modalUseData = historyData;
    } else {
      modalUseData = upcomingData;
    }

    return (
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: "0.75rem",
            boxShadow: 24,
            padding: "2rem",
            width: "45%",
            maxHeight: "65vh",
            overflow: "auto"
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontFamily: "Poppins", marginBottom: "1rem" }}
          >
            Maintenance Details
          </Typography>
          <Divider sx={{ marginY: "2rem" }} />
          <Typography
            variant="h6"
            sx={{ fontFamily: "Poppins", marginBottom: "1rem" }}
          >
            {activeTab === "history"
              ? "Completed Maintenance"
              : "Upcoming Maintenance"}
          </Typography>

          {modalUseData.length > 0 ? (
            <Grid container spacing={2}>
              {modalUseData.map((maintenance, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Box sx={{ marginBottom: "1.5rem" }}>
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontSize: "1rem",
                        color: "#202020",
                        fontWeight: 600,
                        marginBottom: "0.5rem"
                      }}
                    >
                      {maintenance.maintenanceName}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Inter",
                        fontSize: "0.9rem",
                        color: "#7E939A",
                        marginBottom: "0.5rem"
                      }}
                    >
                      Machine ID: {maintenance.machineID}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Inter",
                        fontSize: "0.9rem",
                        color: "#7E939A"
                      }}
                    >
                      Next Maintenance: {maintenance.nextMaintenance}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography sx={{ fontFamily: "Inter", color: "#7E939A" }}>
              No upcoming maintenance.
            </Typography>
          )}

          <Divider sx={{ marginY: "2rem" }} />
        </Box>
      </Modal>
    );
  };

  return (
    <Box sx={{ mt: { xs: 1, md: 0 } }}>
      <Card
        variant="outlined"
        sx={{
          border: "none",
          boxShadow: "none",
          height: "350px",
          overflowY: "auto",
          padding: "0.5rem 0.5rem"
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "1.5rem",
            alignItems: "start",
            justifyContent: "space-between",
            marginBottom: "0rem",
            padding: "1rem 2rem 0.5rem 1rem",
            flexFlow: "wrap"
          }}
        >
          <Box sx={{ display: "flex", gap: "1.5rem", alignItems: "start" }}>
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
              <img src={MaintenanceIcon} alt="Maintenance Icon" />
            </Box>
            <Box pt={"0.4rem"}>
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontSize: "0.8rem",
                  color: "#909097"
                }}
              >
                Maintenance Status
              </Typography>
              <Box
                sx={{
                  border: "1px solid #F3F3F3",
                  marginTop: "1rem",
                  borderRadius: "0.2rem",
                  boxShadow: "0px 1px 8px 0px #00000005",
                  width: 120,
                  padding: "0.3rem",
                  display: "flex",
                  gap: "0.5rem",
                  flexFlow: "wrap",
                  alignItems: "center"
                }}
              >
                <Typography
                  onClick={() => setActiveTab("upcoming")}
                  sx={{
                    fontFamily: "Inter",
                    fontSize: "0.75rem",
                    color: activeTab === "upcoming" ? "#F38712" : "#7E939A",
                    cursor: "pointer"
                  }}
                >
                  Upcoming
                </Typography>
                <Divider
                  orientation="vertical"
                  sx={{ border: "1px solid #E2E2E2", height: "1.2rem" }}
                />
                <Typography
                  onClick={() => setActiveTab("history")}
                  sx={{
                    fontFamily: "Inter",
                    fontSize: "0.75rem",
                    color: activeTab === "history" ? "#F38712" : "#7E939A",
                    cursor: "pointer"
                  }}
                >
                  History
                </Typography>
              </Box>
            </Box>
          </Box>
          <Button
            variant="text"
            sx={{
              color: "#F38712",
              textTransform: "none",
              fontWeight: 500,
              fontFamily: "Poppins",
              fontSize: "0.75rem",
              display: "flex",
              alignItems: "center",
              "&:hover": {
                backgroundColor: ""
              }
            }}
            onClick={() => setShowModal(true)} // Open modal on button click
          >
            View More
          </Button>
        </Box>

        <Box>
          <Stack
            spacing={2} // Increased spacing for better separation
            divider={<Divider flexItem sx={{ borderColor: "#E0E0E0" }} />} // Styled divider for a subtle look
            sx={{
              padding: "1.5rem",
              backgroundColor: "#FFFFFF", // Clean white background
              borderRadius: "0.75rem",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Modern shadow effect
              maxWidth: "80%", // Restrict width for a centered layout
              margin: "auto", // Center the stack
              transition: "box-shadow 0.3s ease-in-out", // Smooth hover effect
              "&:hover": {
                boxShadow: "0px 8px 18px rgba(0, 0, 0, 0.1)" // Enhanced hover styling
              }
            }}
          >
            {currentData.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  padding: "2rem",
                  backgroundColor: "#FAFAFA",
                  borderRadius: "0.75rem",
                  boxShadow: "0px 4px 10.2px 0px #0000000F"
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    color: "#202020",
                    lineHeight: "1.2"
                  }}
                >
                  No maintenance in this category for the organization
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontSize: "1rem",
                    color: "#7E939A",
                    marginTop: "1rem",
                    lineHeight: "1.4"
                  }}
                >
                  It seems like there are no scheduled or recent maintenance
                  records. Check back later or contact your administrator.
                </Typography>
              </Box>
            ) : (
              currentData.map((maintenance, index) => (
                <Box
                  key={index}
                  sx={{
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    backgroundColor: "#FAFAFA", // Subtle background for each item
                    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.05)" // Subtle item shadow
                  }}
                >
                  {/* Maintenance Name */}
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: "1.2rem",
                      color: "#202020",
                      fontWeight: 600,
                      textAlign: "center", // Center-align for better readability
                      marginBottom: "0.5rem"
                    }}
                  >
                    {maintenance.maintenanceName}
                  </Typography>

                  {/* Machine ID */}
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontSize: "1rem",
                      color: "#7E939A",
                      textAlign: "center",
                      marginBottom: "0.5rem"
                    }}
                  >
                    Machine ID: {maintenance.machineID}
                  </Typography>

                  {/* Maintenance Details */}
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontSize: "1rem",
                      color: "#7E939A",
                      textAlign: "center",
                      marginBottom: "0.5rem"
                    }}
                  >
                    Maintenance Details: {maintenance.maintenanceDetails}
                  </Typography>

                  {/* Maintenance Timing */}
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontSize: "1rem",
                      color: "#7E939A",
                      textAlign: "center",
                      lineHeight: "1.6"
                    }}
                  >
                    {activeTab === "upcoming"
                      ? `Next Maintenance: ${maintenance.nextMaintenance}`
                      : `Recent Maintenance: ${maintenance.recentMaintenance}`}
                  </Typography>
                </Box>
              ))
            )}
          </Stack>
        </Box>
      </Card>
      {renderModal()}
    </Box>
  );
}
