
import React, { useState } from "react";
import { Box, Button, Stack, TextField, Typography, Grid, IconButton } from "@mui/material";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import GoogleIcon from '@mui/icons-material/Google'; // Add Google icon
import { useNavigate } from "react-router-dom";
import { auth, rtdb } from "../../../firebase";
import { createUserWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { ref, set } from "firebase/database";
import LoginImg from "../../../assets/Registration/Login.png";
import Ukeylogo from "../../../assets/Registration/UkeyLogoRegistration.png";

function SuperAdminSignup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        organizationName: "",
        organizationAddress: "",
        password: "",
        confirmPassword: "",
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
    const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // const handleRegister = async () => {
    //     const { name, email, phone, organizationName, organizationAddress, password, confirmPassword } = formData;
    
    //     if (!name || !email || !phone || !organizationName || !organizationAddress || !password) {
    //         setError("All fields are required.");
    //         return;
    //     }
    
    //     if (password !== confirmPassword) {
    //         setError("Passwords do not match.");
    //         return;
    //     }
    
    //     setLoading(true);
    //     try {
    //         // Set session persistence
    //         await setPersistence(auth, browserSessionPersistence);
    
    //         // Register user in Firebase Authentication
    //         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    //         const uid = userCredential.user.uid;
    
    //         // Generate organizationID
    //         const organizationID = Math.random().toString(36).substring(2, 15);
    
    //         // User data
    //         const userData = {
    //             email,
    //             name,
    //             lastLogin: new Date().toISOString().slice(0, 19).replace('T', ' '),
    //             organizationID, // Link user to their organization
    //             phone,
    //             role: "admin",
    //             status: "inactive",              
    //             userID: uid,
    //         };
    
    //         // Save organization data first
    //         const organizationRef = ref(rtdb, `organizations/${organizationID}`);
    //         await set(organizationRef, {
    //             name: organizationName,
    //             address: organizationAddress,
    //             organizationID: organizationID,
    //             users: { [uid]: userData },
    //             machines: {},
    //             status: "inactive",
    //             subscriptionStatus: "inactive"
    //         });
    
    //         // Save user data within the organization
    //         const userRef = ref(rtdb, `organizations/${organizationID}/users/${uid}`);
    //         await set(userRef, userData);
    
    //         alert("Registration successful!");
    //         navigate("/login");
    //     } catch (err) {
    //         setError("Registration failed. Please try again.");
    //         console.error("Registration error:", err);
    //     } finally {
    //         setLoading(false);
    //     }
    // };




    // const handleRegister = async () => {
    //     const { name, email, phone, organizationName, organizationAddress, password, confirmPassword } = formData;
    
    //     if (!name || !email || !phone || !organizationName || !organizationAddress || !password) {
    //         setError("All fields are required.");
    //         return;
    //     }
    
    //     if (password !== confirmPassword) {
    //         setError("Passwords do not match.");
    //         return;
    //     }
    
    //     setLoading(true);
    //     try {
    //         // Set session persistence
    //         await setPersistence(auth, browserSessionPersistence);
    
    //         // Register user in Firebase Authentication
    //         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    //         const uid = userCredential.user.uid;
    
    //         // Generate organizationID (unique random ID)
    //         const organizationID = Math.random().toString(36).substring(2, 15);
    
    //         // User data
    //         const userData = {
    //             email,
    //             name,
    //             lastLogin: new Date().toISOString(),
    //             organizationID,
    //             phone,
    //             role: "operator",
    //             status: "active",
    //             userID: uid,
    //             serialNumbers: {
    //                 "123": "67896",
    //                 "IP4560": "34567"
    //             }
    //         };
    
    //         // Organization data
    //         const organizationData = {
    //             name: organizationName,
    //             address: organizationAddress,
    //             organizationID,
    //             status: "inactive",
    //             subscriptionStatus: "inactive"
    //         };
    
    //         // Save organization data
    //         const organizationRef = ref(rtdb, `organizations/${organizationID}`);
    //         await set(organizationRef, organizationData);
    
    //         // Save user data under global 'users' and link in organization
    //         const userRef = ref(rtdb, `users/${uid}`);
    //         await set(userRef, userData);
    
    //         // Link user in organization's user list
    //         const orgUserRef = ref(rtdb, `organizations/${organizationID}/users/${uid}`);
    //         await set(orgUserRef, userData);
    
    //         alert("Registration successful!");
    //         navigate("/login");
    //     } catch (err) {
    //         setError("Registration failed. Please try again.");
    //         console.error("Registration error:", err);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    

    const handleRegister = async () => {
        const { name, email, phone, organizationName, organizationAddress, password, confirmPassword } = formData;
    
        if (!name || !email || !phone || !organizationName || !organizationAddress || !password) {
            setError("All fields are required.");
            return;
        }
    
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
    
        setLoading(true);
        try {
            // Set session persistence
            await setPersistence(auth, browserSessionPersistence);
    
            // Register user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;
    
            // Generate organizationID (unique random ID)
            const organizationID = Math.random().toString(36).substring(2, 15);
    
            // User data
            const userData = {
                email,
                name,
                organizationID: organizationID,
                lastLogin: new Date().toISOString(),
                phone,
                role: "superAdmin",
                status: "active",
                userID: uid,
                // serialNumbers: {
                //     "123": "67896",
                //     "IP4560": "34567"
                // }
            };
    
            // Organization data with minimal user information
            const organizationData = {
                name: organizationName,
                address: organizationAddress,
                organizationID,
                status: "active",
                subscriptionStatus: "active",
             
            };
    
            // Save organization data
            const organizationRef = ref(rtdb, `organizations/${organizationID}`);
            await set(organizationRef, organizationData);
    
            // Save user data under global 'users' node
            const userRef = ref(rtdb, `users/${uid}`);
            await set(userRef, userData);
    
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
        <Box sx={{ 
            backgroundImage: `url(${LoginImg})`,
            backgroundSize: "cover", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            height: "100vh",
        }}>
            <Box sx={{
                width: "700px", 
                height: "100%",
                padding: "2rem", 
                backgroundColor: "rgba(255, 255, 255, 0.9)", // Fixed camelCase and string format
                // backdropFilter: "blur(10px)", // Fixed camelCase
                // WebkitBackdropFilter: "blur(10px)", // Fixed camelCase and Safari prefix
                borderRadius: "8px", 
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", 
                position: "absolute", 
                right: "0px" // Position box to the right
            }}>

                <Box 
                
                sx={{

                    width: "400px", 
                    
                    margin: "0 auto", // Centers the box horizontally
                    textAlign: "center", // Centers inline or text content

                }}
                
                >
                <Box sx={{ paddingBottom: "2.5rem",

                marginTop: 5,

                    alignItems:"center",
                justifyContent:"center",
                 }}>
                    <img src={Ukeylogo} height={"70px"} width={"143px"} alt="Logo" />
                </Box>
               

                <Typography variant="h5" textAlign="center" mb={2}>
                    Register
                </Typography>
                 {/* Already have an account text */}
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
                    <TextField label="Organization Name" name="organizationName" value={formData.organizationName} onChange={handleChange} fullWidth />
                    <TextField label="Organization Address" name="organizationAddress" value={formData.organizationAddress} onChange={handleChange} fullWidth />
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
                <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleRegister}>
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

export default SuperAdminSignup;
