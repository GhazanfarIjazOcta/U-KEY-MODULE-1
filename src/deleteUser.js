const admin = require("firebase-admin");
const serviceAccount = require("./path-to-your-service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://u-key-db-1a39d-default-rtdb.firebaseio.com/" // Ensure your RTDB URL is correct
});

// Function to delete a user by UID
const deleteUserById = async (userId) => {
  try {
    await admin.auth().deleteUser(userId);
    console.log(`Successfully deleted user: ${userId}`);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

module.exports = { deleteUserById };
