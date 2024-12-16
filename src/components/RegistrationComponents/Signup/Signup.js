// import {
//     Box,
//     Button,
//     Checkbox,
//     Stack,
//     TextField,
//     Typography,
// } from "@mui/material";
// import React, { useState } from "react";
// import LoginImg from "../../../assets/Registration/Login.png";

// import Ukeylogo from "../../../assets/Registration/UkeyLogoRegistration.png";
// import GoogleLogo from "../../../assets/Registration/Google.svg";
// import { useNavigate } from "react-router-dom";
// import { RegistrationStyles } from "../../UI/Styles";
// import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
// import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';


// import {auth} from "../../../firebase"
// import { getAuth } from "firebase/auth";
// import { createUserWithEmailAndPassword } from "firebase/auth";

// function Signup() {
//     const navigate = useNavigate();
//     const [passwordVisible, setPasswordVisible] = useState(false);
//     const [slideLeft, setSlideLeft] = useState(false);
//     const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

//     const togglePasswordVisibility = () => {
//         setPasswordVisible(!passwordVisible);
//     };

//     const toggleConfirmPasswordVisibility = () => {
//         setConfirmPasswordVisible(!confirmPasswordVisible);
//     };

//     const loginNavigation = () => {
//         setSlideLeft(true); // Start the slide animation

//         // Introduce a delay of 500ms (0.5 seconds) before navigating to the next route
//         setTimeout(() => {
//             navigate("/login"); // Perform the navigation after the animation completes
//         }, 500); // Delay matches the CSS animation duration
//     };

//     return (
//         <Box sx={{
//             backgroundImage: `url(${LoginImg})`,
//             backgroundSize: "cover", // Ensures the image covers the whole area
//             backgroundPosition: "center", // Centers the image
//             backgroundRepeat: "no-repeat", // Prevents tiling the image
//             display: "flex",
//             justifyContent: "flex-end",
//             height: "100%",
//             minHeight: "100vh", // Ensures the box takes full viewport height
//             width: "100vw"
//         }} >
//             <Box
//                 className={`sliding-box ${slideLeft ? 'slide-left' : ''}`}
//                 display="flex"
//                 flexDirection="column"
//                 alignItems="center"
//                 justifyContent="center"
//                 sx={{ width: { lg: "45%", md: "50%", sm: "100%", xs: "100%" }, opacity: "95%", background: "#F5F7F9", height: "100vh" }}

//             >
//                 <Box sx={{ paddingBottom: { md: "1.5rem", sm: "1rem", xs: "0.5rem" }, paddingTop: "0rem" }}>
//                     <img src={Ukeylogo} height={"70px"} width={"143px"} />
//                 </Box>

//                 <Typography
//                     variant="h1"
//                     mt={"1em"}
//                     sx={{ fontWeight: 600, fontSize: "1.675rem", fontFamily: "Inter", color: "#14181F", }}
//                 >
//                     Register
//                 </Typography>
//                 <Stack direction={{ xs: "column", sm: "row" }} gap={"3px"} mt={1}>
//                     <Typography
//                         sx={{
//                             fontFamily: "Inter",
//                             color: "#14181F",
//                             textAlign: "center",
//                         }}
//                     >
//                         Already have an account?
//                     </Typography>
//                     <Typography
//                         color={"#F38712"}
//                         style={{
//                             fontWeight: 600,
//                             fontFamily: "Inter",
//                             cursor: "pointer",
//                             textAlign: "center",
//                         }}
//                         onClick={loginNavigation}
//                     >
//                         Login here
//                     </Typography>
//                 </Stack>
//                 <Box sx={{ width: { xs: "80%", sm: "60%" }, maxWidth: "370px", pt: "1.5rem" }}>
//                     <Typography
//                         variant="subtitle1"
//                         sx={{
//                             fontWeight: 500,
//                             fontSize: "0.8rem",
//                             fontFamily: "Inter",
//                             color: "#14181F",
//                         }}
//                     >
//                         Full Name
//                     </Typography>
//                     <TextField
//                         sx={RegistrationStyles.textField}
//                         fullWidth
//                         size="small"
//                         placeholder="Enter your full name"
//                     />
//                 </Box>
//                 <Box sx={{ width: { xs: "80%", sm: "60%" }, maxWidth: "370px" }}>
//                     <Typography
//                         variant="subtitle1"
//                         sx={{
//                             fontWeight: 500, fontSize: "0.8rem",
//                             fontFamily: "Inter",
//                             color: "#14181F",
//                         }}
//                     >
//                         E-mail
//                     </Typography>
//                     <TextField sx={RegistrationStyles.textField} fullWidth size="small" placeholder="Enter your email" />
//                 </Box>
//                 <Box sx={{ width: { xs: "80%", sm: "60%" }, maxWidth: "370px" }}>
//                     <Typography
//                         variant="subtitle1"
//                         sx={{
//                             fontWeight: 500, fontSize: "0.8rem",
//                             fontFamily: "Inter",
//                             color: "#14181F",
//                         }}
//                     >
//                         Phone Number
//                     </Typography>
//                     <TextField sx={RegistrationStyles.textField} fullWidth size="small" placeholder="Enter your Phone number" />
//                 </Box>
//                 <Box sx={{ width: { xs: "80%", sm: "60%" }, maxWidth: "370px", position: "relative" }}>
//                     <Typography
//                         variant="subtitle1"
//                         sx={{
//                             fontWeight: 500, fontSize: "0.8rem",
//                             fontFamily: "Inter",
//                             color: "#14181F",
//                         }}
//                     >
//                         Password
//                     </Typography>


//                     <TextField sx={RegistrationStyles.textField} fullWidth size="small" placeholder="Enter your password" type={passwordVisible ? 'text' : 'password'} />
//                     <Box
//                         sx={RegistrationStyles.passwordEyeBox}
//                         onClick={togglePasswordVisibility}
//                     >
//                         {passwordVisible ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
//                     </Box>
//                 </Box>
//                 <Box sx={{ width: { xs: "80%", sm: "60%" }, maxWidth: "370px", position: "relative" }}>
//                     <Typography
//                         variant="subtitle1"
//                         sx={{
//                             fontWeight: 500, fontSize: "0.8rem",
//                             fontFamily: "Inter",
//                             color: "#14181F",
//                         }}
//                     >
//                         Confirm Password
//                     </Typography>

//                     <TextField sx={RegistrationStyles.textField} fullWidth size="small" placeholder="Confirm your password" type={confirmPasswordVisible ? 'text' : 'password'} />
//                     <Box
//                         sx={RegistrationStyles.passwordEyeBox}
//                         onClick={toggleConfirmPasswordVisibility}
//                     >
//                         {confirmPasswordVisible ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
//                     </Box>
//                 </Box>

//                 <Button
//                     variant="contained"
//                     sx={{
//                         width: { xs: "80%", sm: "60%" },
//                         maxWidth: "370px",
//                         height: "3.1rem",
//                         backgroundColor: "#212122;",
//                         color: "white",
//                         marginTop: "1.8em",
//                         textTransform: "none",
//                         "&:hover": {
//                             backgroundColor: "#212122",
//                         },
//                     }}
//                     onClick={() => navigate("/dashboard")}
//                 >
//                     Register
//                 </Button>
//                 <Typography
//                     variant="body1"
//                     mt={2}
//                     mb={1}
//                     color={"#6F7C8E"}
//                     sx={{
//                         fontWeight: 500,
//                         fontSize: "1rem",
//                         fontFamily: "Poppins",
//                         cursor: "pointer",
//                         marginTop: { md: "1.5rem", sm: "1rem", xs: "0.5rem" }
//                     }}
//                 >
//                     or continue with
//                 </Typography>
//                 <Stack mt={1} >
//                     <img src={GoogleLogo} />
//                 </Stack>
//             </Box>
//         </Box>
//     );
// }

// export default Signup;



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



function Signup() {
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
                role: "admin",
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
                status: "inactive",
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
    width: "100vw",
}}>
<Box
  sx={{
    width: { xs: "90%", sm: "600px", md: "700px" }, // Adjust width
    maxWidth: "100%", // Prevent overflow
    padding: "2rem",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    position: { xs: "static", md: "absolute" }, // Change position for smaller screens
    right: { xs: "auto", md: "0px" },
    height: { xs: "auto", md: "90vh" , lg: "100vh" }, // Ensure height adjusts dynamically
    maxHeight: "100vh", // Prevent exceeding the viewport
    overflowY: "auto", // Allow scrolling for content overflow
    boxSizing: "border-box", // Ensures padding doesn't add to the box size
  }}
>
  <Box
    sx={{
      width: { xs: "100%", sm: "400px" },
      margin: "0 auto",
      textAlign: "center",
    }}
  >
    <Box sx={{ paddingBottom: "2.5rem", marginTop: 5 }}>
      <img src={Ukeylogo} height={"70px"} width={"143px"} alt="Logo" />
    </Box>
    <Typography variant="h5" textAlign="center" mb={2}>
      Register
    </Typography>
    <Box sx={{ textAlign: "center", mb: 2 }}>
      <Typography
        variant="body2"
        color="primary"
        onClick={() => navigate("/login")}
        sx={{ cursor: "pointer" }}
      >
       

         
      </Typography>
      <Typography
                                color={"#F38712"}
                                style={{ fontWeight: 600, fontSize: "1rem", fontFamily: "Inter", cursor: "pointer" }}
                                onClick={() => navigate("/login")}
                            >
                  Already have an account?    Login here!
                            </Typography>
    </Box>
    <Stack spacing={2}>
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
    <Button
      variant="contained"
      fullWidth
      sx={{
        mt: 2,
        backgroundColor: "#14181F",
        "&:hover": {
          backgroundColor: "#0F1419", // Hover color
        },
      }}
      onClick={handleRegister}
    >
      Register
    </Button>
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

export default Signup;
