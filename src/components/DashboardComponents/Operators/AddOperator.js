
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  auth,
  rtdb,
  createUserWithEmailAndPassword,
  ref,
  set,
  get,
} from "../../../firebase";
import { useUser } from "../../../Context/UserContext";
import CustomAlert from "../../UI/CustomAlert";

function AddOperator() {
  const [formData, setFormData] = useState({
    userID: "",
    name: "",
    email: "",
    phone: "",
    role: "operator", // Default role
    status: "inactive", // Default status
    password: "", // Password field
    serialNumbers: {}, // Store all serial numbers
    tempIp: "", // Temporary IP for adding a new serial
    tempSerial: "", // Temporary serial for adding a new IP
  });

  const [availableIPs, setAvailableIPs] = useState([]); // State to store IPs
  const [loading, setLoading] = useState(false); // Loading state
  const { user } = useUser();
  const CurrentOrganizationID = user.organizationID;

  const [alert, setAlert] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

    // Helper function to check if all digits in the serial code are even
    const isAllDigitsEven = (code) => {
      if (typeof code !== "string" || code.length !== 4) return false;
      return code.split("").every((digit) => parseInt(digit) % 2 === 0);
    };

  // Fetch available machine IPs from Firebase
  useEffect(() => {
    const fetchIPs = async () => {
      const machinesRef = ref(rtdb, "machines");
      const snapshot = await get(machinesRef);
      if (snapshot.exists()) {
        const machines = snapshot.val();
        const filteredIPs = Object.keys(machines).filter(
          (ip) => machines[ip].organizationID === CurrentOrganizationID
        );
        setAvailableIPs(filteredIPs);
      } else {
        console.log("No machines found.");
      }
    };
    fetchIPs();
  }, [CurrentOrganizationID]);

  // Handle input changes for all fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Validate form inputs
  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setAlert({
        open: true,
        severity: "error",
        message: "Please fill out all required fields.",
      });
      return false;
    }
  
    // Check if the serial code is a 4-digit number
    if (!/^\d{4}$/.test(formData.tempSerial)) {
      setAlert({
        open: true,
        severity: "error",
        message: "Serial code must be a 4-digit number.",
      });
      return false;
    }
  
    // Check if all digits in the serial code are even
    if (!isAllDigitsEven(formData.tempSerial)) {
      setAlert({
        open: true,
        severity: "error",
        message: "All digits in the serial code must be even.",
      });
      return false;
    }
  
    if (!formData.tempIp) {
      setAlert({
        open: true,
        severity: "error",
        message: "Please select a machine IP.",
      });
      return false;
    }
  
    return true;
  };

  // Handle form submission  old logic without check
  // const handleAddUser = async () => {
  //   if (!validateForm()) return;
  //   setLoading(true);

  //   const { tempIp, tempSerial, ...userData } = formData;

  //   try {
  //     // Step 1: Create the new user in Firebase Auth
  //     const newUser = await createUserWithEmailAndPassword(
  //       auth,
  //       formData.email,
  //       formData.password
  //     );
  //     const newUserUID = newUser.user.uid;

  //     // Step 2: Add the operator to the `inactive_web_users` node in the selected machine
  //     const machineRef = ref(rtdb, `machines/${tempIp}`);
  //     const machineSnapshot = await get(machineRef);

  //     if (!machineSnapshot.exists()) {
  //       setAlert({
  //         open: true,
  //         severity: "error",
  //         message: "Selected machine does not exist.",
  //       });
  //       return;
  //     }

  //     // Add the operator to the `inactive_web_users` node
  //     const inactiveUserRef = ref(
  //       rtdb,
  //       `machines/${tempIp}/inactive_web_users/${tempSerial}`
  //     );
  //     await set(inactiveUserRef, {
  //       userID: newUserUID,
  //       name: formData.name,
  //     });

  //     // Step 3: Save user data to Firebase Database
  //     const userDocRef = ref(rtdb, `users/${newUserUID}`);
  //     await set(userDocRef, {
  //       ...userData,
  //       userID: newUserUID,
  //       organizationID: CurrentOrganizationID,
  //       lastLogin: new Date().toISOString(),
  //       serialNumbers: {
  //         [tempIp]: {
  //           ip: tempIp,
  //           serial: tempSerial,
  //         },
  //       },
  //     });

  //     setAlert({
  //       open: true,
  //       severity: "success",
  //       message: "Operator added successfully!",
  //     });

  //     // Reset the form
  //     setFormData({
  //       userID: "",
  //       name: "",
  //       email: "",
  //       phone: "",
  //       role: "operator",
  //       status: "inactive",
  //       password: "",
  //       serialNumbers: {},
  //       tempIp: "",
  //       tempSerial: "",
  //     });
  //   } catch (error) {
  //     console.error("Error adding operator:", error.message);
  //     setAlert({
  //       open: true,
  //       severity: "error",
  //       message: "Failed to add operator: " + error.message,
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleAddUser = async () => {
    if (!validateForm()) return;
    setLoading(true);
  
    const { tempIp, tempSerial, ...userData } = formData;
  
    try {
      // Step 1: Check if the 4-digit code already exists in the machine
      const machineRef = ref(rtdb, `machines/${tempIp}`);
      const machineSnapshot = await get(machineRef);
  
      if (!machineSnapshot.exists()) {
        setAlert({
          open: true,
          severity: "error",
          message: "Selected machine does not exist.",
        });
        return;
      }
  
      const machineData = machineSnapshot.val();
  
      // Check if the code exists in operators, hardwarecodes, or inactive_web_users
      const isCodeInOperators = machineData.operators && Object.keys(machineData.operators).includes(
        tempSerial
      );
  
      const isCodeInHardwareCodes = machineData.hardwarecodes && Object.values(machineData.hardwarecodes).includes(
        tempSerial
      );
  
      const isCodeInInactiveUsers = machineData.inactive_web_users && Object.keys(machineData.inactive_web_users).includes(
        tempSerial
      );
  
      if (isCodeInOperators || isCodeInHardwareCodes || isCodeInInactiveUsers) {
        setAlert({
          open: true,
          severity: "error",
          message: "The 4-digit code is already taken. Please use a unique code.",
        });
        return;
      }
  
      // Step 2: Create the new user in Firebase Auth
      const newUser = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const newUserUID = newUser.user.uid;
  
      // Step 3: Add the operator to the `inactive_web_users` node in the selected machine
      const inactiveUserRef = ref(
        rtdb,
        `machines/${tempIp}/inactive_web_users/${tempSerial}`
      );
      await set(inactiveUserRef, {
        userID: newUserUID,
        name: formData.name,
      });
  
      // Step 4: Save user data to Firebase Database
      const userDocRef = ref(rtdb, `users/${newUserUID}`);
      await set(userDocRef, {
        ...userData,
        userID: newUserUID,
        organizationID: CurrentOrganizationID,
        lastLogin: new Date().toISOString(),
        serialNumbers: {
          [tempIp]: {
            ip: tempIp,
            serial: tempSerial,
          },
        },
        code: tempSerial,
        machineID: tempIp,
      });
  
      setAlert({
        open: true,
        severity: "success",
        message: "Operator added successfully!",
      });
  
      // Reset the form
      setFormData({
        userID: "",
        name: "",
        email: "",
        phone: "",
        role: "operator",
        status: "inactive",
        password: "",
        serialNumbers: {},
        tempIp: "",
        tempSerial: "",
      });
    } catch (error) {
      console.error("Error adding operator:", error.message);
      setAlert({
        open: true,
        severity: "error",
        message: "Failed to add operator: " + error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ padding: 3 }}>
      <Box>
        {["name", "email", "phone", "password"].map((field) => (
          <Box key={field} sx={{ marginBottom: 2 }}>
            <Typography sx={{ marginBottom: 1 }}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </Typography>
            <TextField
              name={field}
              type={field === "password" ? "password" : "text"}
              value={formData[field]}
              onChange={handleChange}
              fullWidth
            />
          </Box>
        ))}

        <Box sx={{ marginBottom: 2 }}>
          <Typography sx={{ marginBottom: 1 }}>Status</Typography>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Status"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Typography sx={{ marginBottom: 1 }}>Assign Serial 4-digit Operator Code:</Typography>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Machine IP</InputLabel>
            <Select
              name="tempIp"
              value={formData.tempIp}
              onChange={handleChange}
              label="Machine IP"
            >
              {availableIPs.map((ip) => (
                <MenuItem key={ip} value={ip}>
                  {ip}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Serial Code"
            name="tempSerial"
            value={formData.tempSerial}
            onChange={handleChange}
            fullWidth
          />
        </Box>
      </Box>

      <Stack direction="row" justifyContent="flex-end">
        <Button
          sx={{ backgroundColor: "#15294E" }}
          variant="contained"
          onClick={handleAddUser}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Operator"}
        </Button>
      </Stack>

      <CustomAlert
        open={alert.open}
        onClose={handleAlertClose}
        severity={alert.severity}
        message={alert.message}
      />
    </Paper>
  );
}

export default AddOperator;




//====================================================================================================
// ||| DESCRIPTION OF OLD CODE:
// IT IS LIKE ADDING MACHINE IP TOO, ADDING TO OPERATOR IN THE MACHINE, NOT ADDING TO INACTIVE USERS
//====================================================================================================

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Paper,
//   Stack,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
// } from "@mui/material";
// import {
//   auth,
//   rtdb,
//   createUserWithEmailAndPassword,
//   ref,
//   set,
//   get,
//   remove,
// } from "../../../firebase";
// import { useUser } from "../../../Context/UserContext";
// import CustomAlert from "../../UI/CustomAlert";

// function AddOperator() {
//   const [formData, setFormData] = useState({
//     userID: "",
//     name: "",
//     email: "",
//     phone: "",
//     role: "operator", // Default role
//     status: "inactive", // Default status
//     password: "", // Password field
//     serialNumbers: {}, // Store all serial numbers
//     tempIp: "", // Temporary IP for adding a new serial
//     tempSerial: "", // Temporary serial for adding a new IP
//   });

//   const [availableIPs, setAvailableIPs] = useState([]); // State to store IPs
//   const [loading, setLoading] = useState(false); // Loading state
//   const { user } = useUser();
//   const CurrentOrganizationID = user.organizationID;

//   const [alert, setAlert] = useState({
//     open: false,
//     severity: "success",
//     message: "",
//   });

//   const handleAlertClose = () => {
//     setAlert({ ...alert, open: false });
//   };

//   // Fetch available machine IPs from Firebase
//   useEffect(() => {
//     const fetchIPs = async () => {
//       const machinesRef = ref(rtdb, "machines");
//       const snapshot = await get(machinesRef);
//       if (snapshot.exists()) {
//         const machines = snapshot.val();
//         const filteredIPs = Object.keys(machines).filter(
//           (ip) => machines[ip].organizationID === CurrentOrganizationID
//         );
//         setAvailableIPs(filteredIPs);
//       } else {
//         console.log("No machines found.");
//       }
//     };
//     fetchIPs();
//   }, [CurrentOrganizationID]);

//   // Handle input changes for all fields
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   // Validate form inputs
//   const validateForm = () => {
//     if (!formData.name || !formData.email || !formData.password) {
//       setAlert({
//         open: true,
//         severity: "error",
//         message: "Please fill out all required fields.",
//       });
//       return false;
//     }
//     if (!/^\d{4}$/.test(formData.tempSerial)) {
//       setAlert({
//         open: true,
//         severity: "error",
//         message: "Serial code must be a 4-digit number.",
//       });
//       return false;
//     }
//     return true;
//   };

//   // Handle form submission
//   const handleAddUser = async () => {
//     if (!validateForm()) return;
//     setLoading(true);

//     const { tempIp, tempSerial, ...userData } = formData;

//     try {
//       // Step 1: Create the new user in Firebase Auth
//       const newUser = await createUserWithEmailAndPassword(
//         auth,
//         formData.email,
//         formData.password
//       );
//       const newUserUID = newUser.user.uid;

//       // Step 2: Add the operator to the `operators` node in the selected machine
//       const machineRef = ref(rtdb, `machines/${tempIp}`);
//       const machineSnapshot = await get(machineRef);

//       if (!machineSnapshot.exists()) {
//         setAlert({
//           open: true,
//           severity: "error",
//           message: "Selected machine does not exist.",
//         });
//         return;
//       }

//       // Remove the serial code from the `codes` node
//       const codesRef = ref(rtdb, `machines/${tempIp}/codes`);
//       const codesSnapshot = await get(codesRef);
//       if (codesSnapshot.exists()) {
//         const codes = codesSnapshot.val();
//         const codeKey = Object.keys(codes).find((key) => codes[key] === tempSerial);
//         if (codeKey) {
//           await remove(ref(rtdb, `machines/${tempIp}/codes/${codeKey}`));
//         }
//       }

//       // Add the operator to the `operators` node
//       const operatorRef = ref(rtdb, `machines/${tempIp}/operators/${tempSerial}`);
//       await set(operatorRef, {
//         userID: newUserUID,
//         name: formData.name,
//       });

//       // Step 3: Save user data to Firebase Database
//       const userDocRef = ref(rtdb, `users/${newUserUID}`);
//       await set(userDocRef, {
//         ...userData,
//         userID: newUserUID,
//         organizationID: CurrentOrganizationID,
//         lastLogin: new Date().toISOString(),
//         serialNumbers: {
//           [tempIp]: {
//             ip: tempIp,
//             serial: tempSerial,
//           },
//         },
//       });

//       setAlert({
//         open: true,
//         severity: "success",
//         message: "Operator added successfully!",
//       });

//       // Reset the form
//       setFormData({
//         userId: "",
//         name: "",
//         email: "",
//         phone: "",
//         role: "operator",
//         status: "inactive",
//         password: "",
//         serialNumbers: {},
//         tempIp: "",
//         tempSerial: "",
//       });
//     } catch (error) {
//       console.error("Error adding operator:", error.message);
//       setAlert({
//         open: true,
//         severity: "error",
//         message: "Failed to add operator: " + error.message,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Paper sx={{ padding: 3 }}>
//       <Box>
//         {["name", "email", "phone", "password"].map((field) => (
//           <Box key={field} sx={{ marginBottom: 2 }}>
//             <Typography sx={{ marginBottom: 1 }}>
//               {field.charAt(0).toUpperCase() + field.slice(1)}
//             </Typography>
//             <TextField
//               name={field}
//               type={field === "password" ? "password" : "text"}
//               value={formData[field]}
//               onChange={handleChange}
//               fullWidth
//             />
//           </Box>
//         ))}

//         <Box sx={{ marginBottom: 2 }}>
//           <Typography sx={{ marginBottom: 1 }}>Status</Typography>
//           <FormControl fullWidth>
//             <InputLabel>Status</InputLabel>
//             <Select
//               name="status"
//               value={formData.status}
//               onChange={handleChange}
//               label="Status"
//             >
//               <MenuItem value="active">Active</MenuItem>
//               <MenuItem value="inactive">Inactive</MenuItem>
//             </Select>
//           </FormControl>
//         </Box>

//         <Box sx={{ marginBottom: 2 }}>
//           <Typography sx={{ marginBottom: 1 }}>Assign Serial 4-digit Operator Code:</Typography>
//           <FormControl fullWidth sx={{ marginBottom: 2 }}>
//             <InputLabel>Machine IP</InputLabel>
//             <Select
//               name="tempIp"
//               value={formData.tempIp}
//               onChange={handleChange}
//               label="Machine IP"
//             >
//               {availableIPs.map((ip) => (
//                 <MenuItem key={ip} value={ip}>
//                   {ip}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <TextField
//             label="Serial Code"
//             name="tempSerial"
//             value={formData.tempSerial}
//             onChange={handleChange}
//             fullWidth
//           />
//         </Box>
//       </Box>

//       <Stack direction="row" justifyContent="flex-end">
//         <Button
//           sx={{ backgroundColor: "#15294E" }}
//           variant="contained"
//           onClick={handleAddUser}
//           disabled={loading}
//         >
//           {loading ? "Adding..." : "Add Operator"}
//         </Button>
//       </Stack>

//       <CustomAlert
//         open={alert.open}
//         onClose={handleAlertClose}
//         severity={alert.severity}
//         message={alert.message}
//       />
//     </Paper>
//   );
// }

// export default AddOperator;





//====================================================================================================
// ||| DESCRIPTION OF OLD CODE: 1
// it is not like just asking code, not even adding machine ip, but it is adding that to operators in machine
//====================================================================================================

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Paper,
//   Stack,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel
// } from "@mui/material";
// import {
//   auth,
//   rtdb,
//   createUserWithEmailAndPassword,
//   ref,
//   set,
//   get,
//   remove
// } from "../../../firebase";
// import { useUser } from "../../../Context/UserContext";

// import CustomAlert from "../../UI/CustomAlert";

// import { useNavigate } from "react-router-dom";


// function AddOperator() {
//   const [formData, setFormData] = useState({
//     userId: "",
//     name: "",
//     email: "",
//     phone: "",
//     role: "operator", // Default role
//     status: "inactive", // Default status
//     password: "", // Password field
//     serialNumbers: {}, // Store all serial numbers
//     tempIp: "", // Temporary IP for adding a new serial
//     tempSerial: "" // Temporary serial for adding a new IP
//   });

//   const [availableIPs, setAvailableIPs] = useState([]); // State to store IPs

//   const navigate = useNavigate();

//   const { user } = useUser();
//   const CurrentUserID = user.uid;
//   const CurrentOrganizationID = user.organizationID;


//     const [alert, setAlert] = useState({
//       open: false,
//       severity: "success",
//       message: "",
//     });
    
//       const handleAlertClose = () => {
//         setAlert({ ...alert, open: false });
//       };
  

//   useEffect(() => {
//     // Fetch available machine IPs from Firebase
//     const fetchIPs = async () => {
//       const machinesRef = ref(rtdb, "machines");
//       const snapshot = await get(machinesRef);
//       if (snapshot.exists()) {
//         const machines = snapshot.val();
//         const ips = Object.keys(machines);
//         setAvailableIPs(ips);
//       } else {
//         console.log("No machines found.");
//       }
//     };

//     fetchIPs();
//   }, []);

//   // Handle input changes for all fields
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };



//   const handleAddUser = async () => {
//     const { serialNumbers, ...userData } = formData;
  
//     // Step 1: Add the temporary serial and IP if they are provided
//     // if (tempIp && tempSerial) {
//     //   serialNumbers[tempIp] = { ip: tempIp, serial: tempSerial }; // Add to serialNumbers
//     // }
 
//     try {
//       // Step 2: Create the new user in Firebase Auth
//       const newUser = await createUserWithEmailAndPassword(
//         auth,
//         formData.email,
//         formData.password
//       );
//       const newUserUID = newUser.user.uid;
  
//       const assignedMachines = {};
  
//       // Step 3: Process serial numbers
//       for (const ip in serialNumbers) {
//         const { serial } = serialNumbers[ip];
//         const machineRef = ref(rtdb, `machines/${ip}`);
//         const machineSnapshot = await get(machineRef);
  
//         if (!machineSnapshot.exists()) {
//           console.log(`Machine with IP ${ip} does not exist.`);
//           continue;
//         }
  
//         const machineData = machineSnapshot.val();
//         const codes = machineData.codes || {};
  
//         // Find the key for the serial code and remove it
//         const codeKey = Object.keys(codes).find((key) => codes[key] === serial);
//         if (codeKey) {
//           const codeFieldRef = ref(rtdb, `machines/${ip}/codes/${codeKey}`);
//           await remove(codeFieldRef);
//           console.log(`Removed serial code ${serial} from machine ${ip}.`);
//         }
  
//         // Assign the machine to the user
//         const roleType = serial.length === 4 ? "operators" : "foreman"; // Determine role
//         const userFieldRef = ref(rtdb, `machines/${ip}/${roleType}/${serial}`);
//         await set(userFieldRef, { userID: newUserUID });
  
//         assignedMachines[ip] = { serial, role: roleType };
//       }
  
//       // Step 4: Save user data to Firebase Database
//       const userDocRef = ref(rtdb, `users/${newUserUID}`);
//       await set(userDocRef, {
//         ...userData,
//         userID: newUserUID,
//         organizationID: CurrentOrganizationID,
//         lastLogin: new Date().toISOString(),
//         assignedMachines, // Save assigned machines
//         serialNumbers
//       });
  
//       // alert("User added successfully!");
//       // setAlert({
//       //   open: true,
//       //   severity: "success",
//       //   message: "User added successfully!.",
//       // });
  
//       // Reset the form
//       setFormData({
//         userId: "",
//         name: "",
//         email: "",
//         phone: "",
//         // role: "employee",
//         role: "employee",   
//         statadminus: "inactive",
//         password: "",
//         serialNumbers: {},
//         tempIp: "",
//         tempSerial: ""
//       });
//     } catch (error) {
//       console.error("Error adding user:", error.message);
//       // alert("Failed to add user: " + error.message);
//     }
//   };

//   return (
//     <Paper sx={{ padding: 3 }}>
//       <Box>
//         {["name", "email", "phone", "password"].map((field) => (
//           <Box key={field} sx={{ marginBottom: 2 }}>
//             <Typography sx={{ marginBottom: 1 }}>
//               {field.charAt(0).toUpperCase() + field.slice(1)}
//             </Typography>
//             <TextField
//               name={field}
//               type={field === "password" ? "password" : "text"}
//               value={formData[field]}
//               onChange={handleChange}
//               fullWidth
//             />
//           </Box>
//         ))}

//         <Box sx={{ marginBottom: 2 }}>
//           <Typography sx={{ marginBottom: 1 }}>Status</Typography>
//           <FormControl fullWidth>
//             <InputLabel>Status</InputLabel>
//             <Select
//               name="status"
//               value={formData.status}
//               onChange={handleChange}
//               label="Status"
//             >
//               <MenuItem value="active">Active</MenuItem>
//               <MenuItem value="inactive">Inactive</MenuItem>
//             </Select>
//           </FormControl>
//         </Box>

//         {/* <Box sx={{ marginBottom: 2 }}>Add Serial Number
//           <Typography sx={{ marginBottom: 1 }}>Role</Typography>
//           <FormControl fullWidth>
//             <InputLabel>Role</InputLabel>
//             <Select
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//               label="Role"
//             >
//               <MenuItem value="admin">Admin</MenuItem>
//               <MenuItem value="operator">Operator</MenuItem>
//               <MenuItem value="employee">Employee</MenuItem>
//             </Select>
//           </FormControl>
//         </Box> */}

//         <Box sx={{ marginBottom: 2 }}>
//           <Typography sx={{ marginBottom: 1 }}>Assign Serial 4-digit Operator Code:</Typography>
//           {/* <FormControl fullWidth sx={{ marginBottom: 2 }}>
//             <InputLabel>Machine IP</InputLabel>
//             <Select
//               name="tempIp"
//               value={formData.tempIp}
//               onChange={handleChange}
//               label="Machine IP"
//             >
//               {availableIPs.map((ip) => (
//                 <MenuItem key={ip} value={ip}>
//                   {ip}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl> */}
//           <TextField
//             label="Serial Code"
//             name="tempSerial"
//             value={formData.tempSerial}
//             onChange={handleChange}
//             fullWidth
//           />
//         </Box>
        
//       </Box>

//           <Stack direction="row" justifyContent="flex-end">
//               <Button sx={{ backgroundColor: "#15294E" }} variant="contained" onClick={handleAddUser}>
//                 Add Operator
//               </Button>
//             </Stack>

//       <CustomAlert
//         open={alert.open}
//         onClose={handleAlertClose}
//         severity={alert.severity}
//         message={alert.message}
//       />

//     </Paper>
//   );
// }

// export default AddOperator;
