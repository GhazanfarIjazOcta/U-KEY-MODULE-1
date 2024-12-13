

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Paper,
//   Stack,
//   IconButton,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
// } from "@mui/material";
// import { auth, rtdb, ref, set, get, child } from "../../../firebase";
// import { useUser } from "../../../Context/UserContext";
// import axios from "axios";
// import DeleteIcon from "@mui/icons-material/Delete"; // For removing images

// function AddMachine() {
//   const [formData, setFormData] = useState({
//     machineIP: "",   // IP address of the machine to edit
//     images: [],      // Array to hold image files temporarily
//     defaultCode: "",
//     assignedTo: "",
//     maintenance: [],
//     status: "inactive",
//     organizationID: "",
//     lastLocation: "",
//     codes: {},        // For storing codes and other similar fields
//     connected: false, // For connected status
//     operators: [],    // For storing operator information
//     foreman: "",      // For storing foreman info
//     timestamp: "",    // Timestamp when the machine was last updated
//   });

//   const [availableMachines, setAvailableMachines] = useState([]); // Machines without organizationID or images

//   const { user } = useUser();
//   const CurrentOrganizationID = user.organizationID;

//   useEffect(() => {
//     // Fetch available machines whose organizationID is not set and images are empty
//     const fetchAvailableMachines = async () => {
//       const machinesRef = ref(rtdb, "machines");
//       const snapshot = await get(machinesRef);
    
//       if (snapshot.exists()) {
//         const machinesData = snapshot.val();
//         const filteredMachines = Object.keys(machinesData)
//           .filter((machineID) => {
//             const machine = machinesData[machineID];
//             return !machine.organizationID && (!machine.image || Object.keys(machine.image).length === 0); // Ensure 'image' is checked correctly
//           })
//           .map((machineID) => ({
//             machineID,
//             ip: machineID, // Since machineID is acting as the IP
//           }));
    
//         setAvailableMachines(filteredMachines);
//       }
//     };
    
//     fetchAvailableMachines();
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleAddMachine = async () => {
//     try {
//       // Ensure the current machine IP is selected
//       const machineToEdit = availableMachines.find((machine) => machine.ip === formData.machineIP);
//       if (!machineToEdit) {
//         alert("No machine selected for editing.");
//         return;
//       }
  
//       // Upload images to Cloudinary and get URLs
//       const imageUrls = {};
//       for (let i = 0; i < formData.images.length; i++) {
//         const formDataCloud = new FormData();
//         formDataCloud.append("file", formData.images[i].file);
//         formDataCloud.append("upload_preset", "U-KEY-Images");
  
//         const response = await axios.post(
//           `https://api.cloudinary.com/v1_1/dbhnt7uqd/image/upload`,
//           formDataCloud
//         );
//         imageUrls[`image${i + 1}`] = response.data.secure_url;
//       }
  
//       // Fetch existing machine data to keep the fields like operators, code, timestamp, and connected intact
//       const existingMachineRef = ref(rtdb, `machines/${machineToEdit.machineID}`);
//       const snapshot = await get(existingMachineRef);
//       const existingMachineData = snapshot.val();
  
//       // Update the selected machine with the new data, keeping existing fields intact
//       const updatedMachine = {
//         machineIP: formData.machineIP,
//         image: imageUrls,
//         defaultCode: formData.defaultCode,
//         assignedTo: formData.assignedTo || " ",
//         maintenance: formData.maintenance.length
//           ? formData.maintenance
//           : [{ nextMaintenance: "2024-10-01", recentMaintenance: "2024-08-01", maintenanceDetails: "Oil change and filter replacement", status: "Completed" }],
//         status: formData.status,
//         organizationID: CurrentOrganizationID, // Assign organization ID
//         lastLocation: formData.lastLocation || "",
//         operators: existingMachineData?.operators || [], // Retain the operators from the existing data
//         foreman: existingMachineData?.foreman || "", // Retain the foreman from the existing data
//         codes: existingMachineData?.codes || {}, // Retain the codes from the existing data
//         timestamp: existingMachineData?.timestamp || "", // Retain the timestamp from the existing data
//         connected: existingMachineData?.connected || false, // Retain the connected status from the existing data
//       };
  
//       // Save updated machine data in the database
//       await set(existingMachineRef, updatedMachine);
  
//       console.log("Machine updated successfully!");
//       alert("Machine updated successfully!");
  
//       // Reset the form data
//       setFormData({
//         machineIP: "",
//         images: [],
//         defaultCode: "",
//         assignedTo: "",
//         maintenance: [],
//         status: "inactive",
//         organizationID: "",
//         lastLocation: "",
//         codes: {},
//         connected: false,
//         operators: [],
//         foreman: "",
//         timestamp: "",
//       });
//     } catch (error) {
//       console.error("Error updating machine:", error.message);
//       alert("Error: " + error.message);
//     }
//   };
  

//   const handleImageUpload = (e) => {
//     const files = e.target.files;
//     if (!files || files.length === 0) {
//       alert("Please select at least one image.");
//       return;
//     }

//     const currentImages = formData.images || [];

//     if (currentImages.length + files.length > 3) {
//       alert("You can only upload up to 3 images.");
//       return;
//     }

//     const newImages = Array.from(files).map((file) => ({
//       file,
//       preview: URL.createObjectURL(file),
//     }));

//     setFormData((prevData) => ({
//       ...prevData,
//       images: [...currentImages, ...newImages],
//     }));
//   };

//   const handleRemoveImage = (index) => {
//     const updatedImages = [...formData.images];
//     updatedImages.splice(index, 1);
//     setFormData({ ...formData, images: updatedImages });
//   };

//   return (
//     <Paper sx={{ padding: 3 }}>
//       <Box>
//         {/* Machine IP Selection */}
//         <Box sx={{ marginBottom: 2 }}>
//           <Typography>Select Machine IP</Typography>
//           <FormControl fullWidth>
//             <InputLabel>Machine IP</InputLabel>
//             <Select
//               name="machineIP"
//               value={formData.machineIP}
//               onChange={handleChange}
//               fullWidth
//             >
//               {availableMachines.map((machine) => (
//                 <MenuItem key={machine.machineID} value={machine.ip}>
//                   {machine.ip}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Box>

//         {/* Other Fields */}
//         {["defaultCode", "assignedTo", "lastLocation", "status"].map((field) => (
//           <Box key={field} sx={{ marginBottom: 2 }}>
//             <Typography>{field.charAt(0).toUpperCase() + field.slice(1)}</Typography>
//             <TextField
//               name={field}
//               value={formData[field]}
//               onChange={handleChange}
//               fullWidth
//             />
//           </Box>
//         ))}

//         {/* Codes */}
//         <Box sx={{ marginBottom: 2 }}>
//           <Typography>Codes</Typography>
//           <TextField
//             name="codes"
//             value={JSON.stringify(formData.codes)} // Displaying the codes as a string
//             onChange={handleChange}
//             fullWidth
//           />
//         </Box>

//         {/* Image Upload Section */}
//         <Box sx={{ marginBottom: 2 }}>
//           <Typography>Upload Images (Max 3)</Typography>
//           <input type="file" multiple onChange={handleImageUpload} accept="image/*" />
//           <Box display="flex" mt={2}>
//             {formData.images.map((img, index) => (
//               <Box key={index} sx={{ position: "relative", marginRight: 2 }}>
//                 <img
//                   src={img.preview}
//                   alt={`preview-${index}`}
//                   width={80}
//                   height={80}
//                   style={{ borderRadius: 8 }}
//                 />
//                 <IconButton
//                   size="small"
//                   onClick={() => handleRemoveImage(index)}
//                   sx={{ position: "absolute", top: 0, right: 0 }}
//                 >
//                   <DeleteIcon />
//                 </IconButton>
//               </Box>
//             ))}
//           </Box>
//         </Box>
//       </Box>

//       <Stack direction="row" justifyContent="flex-end">
//         <Button variant="contained" onClick={handleAddMachine}>
//           Update Machine
//         </Button>
//       </Stack>
//     </Paper>
//   );
// }

// export default AddMachine;











import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  auth,
  rtdb,
  ref,
  set,
  get,
} from "../../../firebase";
import { useUser } from "../../../Context/UserContext";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete"; // For removing images

import CustomAlert from "../../UI/CustomAlert";


function AddMachine() {
  const [formData, setFormData] = useState({
    machineID: "",
    images: [],  // Array to hold image files temporarily
    defaultCode: "",
    assignedTo: " ",
    maintenance: [],
    status: "inactive",
    loginTime: "",
    logoutTime: "",
    organizationID: "",
    recentUsers: [],
    lastLocation: "",
  });

  const { user } = useUser();
  const CurrentUserID = user.uid;
  const CurrentOrganizationID = user.organizationID;


     const [alert, setAlert] = useState({
        open: false,
        severity: "success",
        message: "",
      });
      
        const handleAlertClose = () => {
          setAlert({ ...alert, open: false });
        };
    

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddMachine = async () => {
    console.log("Current User UID:", auth.currentUser.uid);
    try {
      const loggedInAdminUid = auth.currentUser?.uid;
  
      
    
  
    
  
      try {
        // Upload images to Cloudinary and get the URLs
        const imageUrls = {};
        for (let i = 0; i < formData.images.length; i++) {
          const formDataCloud = new FormData();
          formDataCloud.append("file", formData.images[i].file);
          formDataCloud.append("upload_preset", "U-KEY-Images");
  
          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/dbhnt7uqd/image/upload`,
            formDataCloud
          );
          // Assigning each image URL to corresponding image fields (image1, image2, image3)
          imageUrls[`image${i + 1}`] = response.data.secure_url;
        }
  
        const newMachine = {
          machineID: formData.machineID,
          organizationID: CurrentOrganizationID,
          image: imageUrls,  // Store image URLs under image1, image2, and image3
          // defaultCode: formData.defaultCode,
          // assignedTo: formData.assignedTo || " ",

          maintenance: formData.maintenance.length
            ? formData.maintenance
            : [{machineID: formData.machineID, maintenanceName: "Tuning" ,   nextMaintenance: "2024-10-01", recentMaintenance: "2024-08-01", maintenanceDetails: "Oil change and filter replacement", status: "Pending" }],

          status: formData.status,
          loginTime: "",
          logoutTime: "",
          recentUsers: formData.recentUsers.length ? formData.recentUsers : [],
          lastLocation: formData.lastLocation || "",
          connected: "false",
          timestamp: "NA",
          // Newly added fields
            operators: [], // Array to store multiple operators, empty by default
            foreman: [], // Array to store multiple foremen, empty by default
            code: [], // Array to store multiple codes, empty by default


        };
  
        // Instead of storing under organization path, store directly under machines
        const newMachineRef = ref(rtdb, `machines/${newMachine.machineID}`);
        await set(newMachineRef, newMachine);
  
        console.log("New Machine added successfully!");
        // alert("Machine added successfully");

        setAlert({
          open: true,
          severity: "success",
          message: "Machine added successfully!",
        });
  
        setFormData({
          machineID: "",
          images: [],  // Clear images after submission
          defaultCode: "machineip",
          assignedTo: "1234",
          // maintenance: [],
          status: "inactive",
          loginTime: "NA",
          logoutTime: "NA",
          organizationID: "",
          recentUsers: [],
          lastLocation: "",
        });
  
      } catch (error) {
        console.error("Error uploading images or adding machine:", error.message);
        // alert("Error: " + error.message);
     
        setAlert({
          open: true,
          severity: "error",  // You can adjust the severity depending on the context
          message: "Error" + error.message ,  // Use the dynamic error message
        });
        
      }
    } catch (error) {
      console.error("Error adding machine:", error.message);
      // alert(`Failed to add machine: ${error.message}`);
      
      setAlert({
        open: true,
        severity: "error",  // You can adjust the severity depending on the context
        message: "Failed to add machine:" + error.message ,  // Use the dynamic error message
      });
    }
  };
  

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      // alert("Please select at least one image.");
      setAlert({
        open: true,
        severity: "warning",  // You can adjust the severity depending on the context
        message: "Please select at least one image."  ,  // Use the dynamic error message
      });
      
      return;
    }

    const currentImages = formData.images || [];

    if (currentImages.length + files.length > 3) {
      // alert("You can only upload up to 3 images.");
      setAlert({
        open: true,
        severity: "warning",  // You can adjust the severity depending on the context
        message: "You can only upload up to 3 images."  ,  // Use the dynamic error message
      });
      return;
    }

    const newImages = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFormData((prevData) => ({
      ...prevData,
      images: [...currentImages, ...newImages],
    }));
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({ ...formData, images: updatedImages });
  };

  return (
    <Paper sx={{ padding: 3 }}>
    <Box>
      {["machineID", "lastLocation", "status"].map((field) => (
        <Box key={field} sx={{ marginBottom: 2 }}>
          <Typography sx={{mb:2}}>{field.charAt(0).toUpperCase() + field.slice(1)}</Typography>
          {field === "status" ? (
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name={field}
                value={formData[field]}
                onChange={handleChange}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          ) : (
            <TextField
              name={field}
              type={field === "password" ? "password" : "text"}
              value={formData[field]}
              onChange={handleChange}
              fullWidth
            />
          )}
        </Box>
      ))}

      {/* Image Upload Section */}
      <Box sx={{ marginBottom: 2 }}>
        <Typography>Upload Images (Max 3)</Typography>
        <input type="file" multiple onChange={handleImageUpload} accept="image/*" />
        <Box display="flex" mt={2}>
          {formData.images.map((img, index) => (
            <Box key={index} sx={{ position: "relative", marginRight: 2 }}>
              <img
                src={img.preview}
                alt={`preview-${index}`}
                width={80}
                height={80}
                style={{ borderRadius: 8 }}
              />
              <IconButton
                size="small"
                onClick={() => handleRemoveImage(index)}
                sx={{ position: "absolute", top: 0, right: 0 }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>

    <Stack direction="row" justifyContent="flex-end">
      <Button sx={{ backgroundColor: "#15294E" }} variant="contained" onClick={handleAddMachine}>
        Add Machine
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

export default AddMachine;
