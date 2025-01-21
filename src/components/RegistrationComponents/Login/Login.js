import React, { useState, useEffect } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  auth,
  signInWithEmailAndPassword,
  rtdb,
  ref,
  get,
  onAuthStateChanged
} from "../../../firebase";
import Ukeylogo from "../../../assets/Registration/UkeyLogoRegistration.png";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { RegistrationStyles } from "../../UI/Styles";
import "../../UI/Styles.css";
import { signOut, getAuth } from "firebase/auth";
import { useUser } from "../../../Context/UserContext"; // Import your UserContext

import { LoginUI } from "../../UI/Main";

import Loader from "../../UI//Loader";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { updateUserData } = useUser(); // Context to manage user data
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  // Restore session on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const storedData = localStorage.getItem("user");
        if (storedData) {
          const userData = JSON.parse(storedData);
          redirectToDashboard(userData.role);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // If no user is logged in, clear session and redirect to login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        localStorage.removeItem("user");
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, []);

  const getUserData = async (userId) => {
    const userRef = ref(rtdb, `users/${userId}`);
    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        console.log("User Data:", snapshot.val());
        return snapshot.val();
      } else {
        console.error("User data does not exist for ID:", userId);
        setError("User data does not exist.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error); // Log full error
      setError("Failed to fetch user data.");
      return null;
    }
  };

  const handleLogin = async () => {
    await signOut(auth); // Ensure no previous session exists
    setLoading(true);
    setError(null); // Clear previous errors

    try {
      // Authenticate user with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Fetch user-specific data
      const userData = await getUserData(user.uid);

      if (userData) {
        const { role, organizationID } = userData;

        // Optional: Fetch organization details if needed
        const orgRef = ref(rtdb, `organizations/${organizationID}`);
        const orgSnapshot = await get(orgRef);

        if (orgSnapshot.exists()) {
          const orgData = orgSnapshot.val();

          // Check organization status and subscription
          if (orgData.status !== "active") {
            setError("Your organization is inactive. Contact OEM Super Admin.");
            return;
          }
          if (orgData.subscriptionStatus !== "active") {
            setError("Your organization subscription is inactive.");
            return;
          }

          // Save data and redirect
          localStorage.setItem("user", JSON.stringify(userData));
          updateUserData(userData); // Context update
          redirectToDashboard(role);
        } else {
          setError("Organization details not found.");
        }
      }
    } catch (error) {
      handleFirebaseErrors(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFirebaseErrors = (error) => {
    console.error("Firebase Error:", error); // Log the error object
    let errorMessage = "";
    switch (error.code) {
      case "auth/invalid-email":
        errorMessage = "Invalid email format.";
        break;
      case "auth/user-not-found":
        errorMessage = "No user found with this email.";
        break;
      case "auth/wrong-password":
        errorMessage = "Incorrect password. Please try again.";
        break;
      case "auth/network-request-failed":
        errorMessage = "Network error. Check your connection.";
        break;
      default:
        errorMessage = "An unknown error occurred. Please try again.";
    }
    setError(errorMessage);
  };

  const redirectToDashboard = (role) => {
    if (role === "admin") navigate("/admin-dashboard");
    else if (role === "operator" || role === "employee")
      navigate("/employee-dashboard");
    else if (role === "superAdmin") navigate("/dashboard");
    else navigate("/dashboard");
  };

  const signupNavigation = () => navigate("/signup");

  if (loading) {
    return <div>{loading && <Loader />}</div>;
  }

  return (
    <Box
      sx={{
        ...LoginUI.loginmainBox
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          ...LoginUI.loginSecondBox
        }}
      >
        <Box sx={{ paddingBottom: "2.5rem" }}>
          <img src={Ukeylogo} height={"70px"} width={"143px"} alt="Logo" />
        </Box>

        <Typography
          variant="h1"
          mt={"1em"}
          sx={{
            fontWeight: 600,
            fontSize: "1.675rem",
            fontFamily: "Inter",
            color: "#14181F"
          }}
        >
          Login
        </Typography>
        <Typography
          mt="1.6em"
          sx={{
            fontSize: "1rem",
            fontFamily: "Inter",
            color: "#14181F",
            textAlign: "center"
          }}
        >
          If you don't have an account register
        </Typography>
        <Stack direction={"row"} gap={2}>
          <Typography
            color={"#F38712"}
            style={{
              fontWeight: 600,
              fontSize: "1rem",
              fontFamily: "Inter",
              cursor: "pointer"
            }}
            onClick={signupNavigation}
          >
            Register here!
          </Typography>
        </Stack>

        <Box
          sx={{
            width: { xs: "80%", sm: "60%" },
            maxWidth: "370px",
            pt: "1.5rem"
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 500,
              fontSize: "0.8rem",
              fontFamily: "Inter",
              color: "#14181F"
            }}
          >
            E-mail/Phone Number
          </Typography>
          <TextField
            sx={RegistrationStyles.textField}
            fullWidth
            size="small"
            placeholder="Enter your email or phone number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>
        <Box
          sx={{
            width: { xs: "80%", sm: "60%" },
            maxWidth: "370px",
            position: "relative"
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 500,
              fontSize: "0.8rem",
              fontFamily: "Inter",
              color: "#14181F"
            }}
          >
            Password
          </Typography>
          <TextField
            sx={RegistrationStyles.textField}
            fullWidth
            size="small"
            placeholder="Enter your password"
            type={passwordVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Box
            sx={RegistrationStyles.passwordEyeBox}
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? (
              <VisibilityOffOutlinedIcon />
            ) : (
              <VisibilityOutlinedIcon />
            )}
          </Box>
        </Box>

        <Button
          variant="contained"
          sx={{
            ...LoginUI.loginButton
          }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        {error && (
          <Typography color="error" variant="body2" sx={{ marginTop: "1rem" }}>
            {error}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Login;
