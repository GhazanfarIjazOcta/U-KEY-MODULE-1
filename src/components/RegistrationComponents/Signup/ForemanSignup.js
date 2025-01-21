import React, { useState, useEffect } from "react";
import { Box, Button, Stack, TextField, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from "react-router-dom";
import { auth, rtdb } from "../../../firebase";
import { createUserWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { ref, set, onValue } from "firebase/database";
import Ukeylogo from "../../../assets/Registration/UkeyLogoRegistration.png";
import { SignupUI } from "../../UI/Main";

function ForemanSignup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        organizationID: "", // Selected organization ID
        machineIp: "", // Selected machine IP
        serialCode: "", // 5-digit serial code
        password: "",
        confirmPassword: "",
    });
    const [organizations, setOrganizations] = useState([]); // List of organizations
    const [machines, setMachines] = useState([]); // List of machines
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch organizations from Firebase Realtime Database
    useEffect(() => {
        const organizationsRef = ref(rtdb, "organizations");
        onValue(organizationsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const orgList = Object.keys(data).map((key) => ({
                    id: key,
                    name: data[key].name,
                }));
                setOrganizations(orgList);
            }
        });
    }, []);

    // Fetch machines from Firebase Realtime Database
    useEffect(() => {
        const machinesRef = ref(rtdb, "machines");
        onValue(machinesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const machineList = Object.keys(data).map((key) => ({
                    ip: key, // Machine IP
                    name: data[key].machineID, // Machine name or ID
                }));
                setMachines(machineList);
            }
        });
    }, []);

    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
    const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async () => {
        const { name, email, phone, organizationID, machineIp, serialCode, password, confirmPassword } = formData;
    
        if (!name || !email || !phone || !organizationID || !machineIp || !serialCode || !password) {
            setError("All fields are required.");
            return;
        }
    
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
    
        if (serialCode.length !== 5 || !/^\d+$/.test(serialCode)) {
            setError("Serial code must be a 5-digit number.");
            return;
        }
    
        setLoading(true);
        try {
            // Set session persistence
            await setPersistence(auth, browserSessionPersistence);
    
            // Register user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;
    
            // User data
            const userData = {
                email,
                name,
                organizationID, // Selected organization ID
                lastLogin: new Date().toISOString(),
                phone,
                role: "admin",
                status: "inactive",
                userID: uid,
                serialNumbers: {
                    [machineIp]: { // Selected machine IP
                        ip: machineIp,
                        serial: serialCode, // 5-digit serial code
                    },
                },
            };
    
            // Save user data under global 'users' node
            const userRef = ref(rtdb, `users/${uid}`);
            await set(userRef, userData);
    
            // Add user to the `inactive_web_users` node in the selected machine
            const inactiveUserRef = ref(rtdb, `machines/${machineIp}/inactive_web_users/${serialCode}`);
            await set(inactiveUserRef, {
                userID: uid,
                name: name,
            });
    
            alert("Registration successful!");
            navigate("/login");
        } catch (err) {
            setError("Registration failed. Please try again.");
            console.error("Registration error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = () => {
        // Handle Google signup logic here
        alert("Google signup is not implemented yet.");
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Box sx={{ ...SignupUI.signupMainBox }}>
            <Box sx={{ ...SignupUI.signupSecondWhiteBox }}>
                <Box sx={{ ...SignupUI.signupThirdBox }}>
                    <Box sx={{ paddingBottom: "2.5rem", marginTop: 5, alignItems: "center", justifyContent: "center" }}>
                        <img src={Ukeylogo} height={"70px"} width={"143px"} alt="Logo" />
                    </Box>

                    <Typography variant="h5" textAlign="center" mb={2}>
                        Register
                    </Typography>
                    <Box sx={{ textAlign: "center", mb: 2 }}>
                        <Typography variant="body2" color="primary" onClick={() => navigate("/login")} sx={{ cursor: "pointer" }}>
                            Already have an account? Login here
                        </Typography>
                    </Box>
                    <Stack spacing={2}>
                        {/* Form fields */}
                        <TextField label="Full Name" name="name" value={formData.name} onChange={handleChange} fullWidth />
                        <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth />
                        <TextField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} fullWidth />

                        {/* Organization Dropdown */}
                        <FormControl fullWidth>
                            <InputLabel>Select Organization</InputLabel>
                            <Select
                                name="organizationID"
                                value={formData.organizationID}
                                onChange={handleChange}
                                label="Select Organization"
                            >
                                {organizations.map((org) => (
                                    <MenuItem key={org.id} value={org.id}>
                                        {org.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Machine IP Dropdown */}
                        <FormControl fullWidth>
                            <InputLabel>Select Machine IP</InputLabel>
                            <Select
                                name="machineIp"
                                value={formData.machineIp}
                                onChange={handleChange}
                                label="Select Machine IP"
                            >
                                {machines.map((machine) => (
                                    <MenuItem key={machine.ip} value={machine.ip}>
                                        {machine.name} ({machine.ip})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Serial Code Input */}
                        <TextField
                            label="Serial Code (5 digits)"
                            name="serialCode"
                            value={formData.serialCode}
                            onChange={handleChange}
                            fullWidth
                            inputProps={{ maxLength: 5 }}
                        />

                        <TextField
                            label="Password"
                            name="password"
                            type={passwordVisible ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <VisibilityOutlinedIcon onClick={togglePasswordVisibility} style={{ cursor: "pointer" }} />
                                ),
                            }}
                        />
                        <TextField
                            label="Confirm Password"
                            name="confirmPassword"
                            type={confirmPasswordVisible ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <VisibilityOutlinedIcon onClick={toggleConfirmPasswordVisibility} style={{ cursor: "pointer" }} />
                                ),
                            }}
                        />
                    </Stack>
                    {error && (
                        <Typography color="error" mt={2} textAlign="center">
                            {error}
                        </Typography>
                    )}
                    <Button variant="contained" fullWidth sx={{ ...SignupUI.signupRegisterButton }} onClick={handleRegister}>
                        Register
                    </Button>

                    {/* Google Signup Option */}
                    <Box sx={{ mt: 2, textAlign: "center" }}>
                        <Button
                            variant="outlined"
                            fullWidth
                            sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                            onClick={handleGoogleSignup}
                        >
                            <GoogleIcon sx={{ mr: 1 }} />
                            <Typography variant="body2">or sign up with Google</Typography>
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default ForemanSignup;