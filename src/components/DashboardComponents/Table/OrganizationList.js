import React, { useState, useEffect } from "react";
import { getDatabase, ref, get, update, remove } from "firebase/database";
import { getAuth, deleteUser } from "firebase/auth"; // Import deleteUser from Firebase Authentication
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase"; // Firebase auth instance

const OrganizationList = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const db = getDatabase();
          const organizationsRef = ref(db, 'organizations');
          const snapshot = await get(organizationsRef);
          
          if (snapshot.exists()) {
            const orgData = snapshot.val();
            const orgList = Object.keys(orgData).map((key) => ({
              id: key,
              ...orgData[key],
            }));
            setOrganizations(orgList);
          } else {
            setError("No organizations found.");
          }
        } catch (err) {
          setError(err.message);
        }
      } else {
        setError("You must be logged in to view this page.");
        navigate("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleActivateDeactivate = async (organizationId, status) => {
    try {
      const db = getDatabase();
      const orgRef = ref(db, 'organizations/' + organizationId);
      await update(orgRef, {
        status: status === "active" ? "inactive" : "active",
      });
      setOrganizations((prev) =>
        prev.map((org) =>
          org.id === organizationId ? { ...org, status: status === "active" ? "inactive" : "active" } : org
        )
      );
    } catch (err) {
      setError("Error updating status.");
    }
  };

  const handleDeleteOrganization = async (organizationId, users) => {
    try {
      const db = getDatabase();
      const authInstance = getAuth(); // Get Firebase Auth instance
      
      // Delete all users from the 'users' node
      users.forEach(async (userId) => {
        const userRef = ref(db, 'users/' + userId);
        await remove(userRef); // Remove user from the database

        // If you're on the backend (Firebase Functions), you would use Admin SDK here:
        try {
          // On the client-side, you can delete the logged-in user using deleteUser()
          const currentUser = authInstance.currentUser;

          if (currentUser && currentUser.uid === userId) {
            await deleteUser(currentUser); // Deletes the logged-in user
            console.log(`User with UID: ${userId} deleted from Firebase Authentication.`);
          } else {
            // To delete another user, use Firebase Admin SDK in Cloud Functions (not client-side)
            console.log(`Error: User with UID ${userId} should be deleted from the Admin SDK (not client-side).`);
          }
        } catch (authError) {
          console.log(`Error deleting user from Firebase Authentication: ${authError.message}`);
        }
      });

      // Delete the organization from the 'organizations' node
      const orgRef = ref(db, 'organizations/' + organizationId);
      await remove(orgRef);

      // Update the UI by removing the deleted organization
      setOrganizations((prev) => prev.filter((org) => org.id !== organizationId));

      alert("Organization and associated users have been deleted.");
    } catch (err) {
      setError("Error deleting organization and users.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Organization List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((org) => (
            <tr key={org.id}>
              <td>{org.name}</td>
              <td>{org.address}</td>
              <td>{org.status}</td>
              <td>
                <button onClick={() => handleActivateDeactivate(org.id, org.status)}>
                  {org.status === "active" ? "Deactivate" : "Activate"}
                </button>
                <button onClick={() => handleDeleteOrganization(org.id, org.users)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrganizationList;
