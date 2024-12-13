// functions/index.js

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Function to set custom claims (role and organizationId) when a user is created
exports.setCustomClaims = functions.auth.user().onCreate((user) => {
    const role = 'user'; // Default role
    const organizationId = 'org123'; // Example organization ID, replace with real data

    // Set the custom claims for the user
    return admin.auth().setCustomUserClaims(user.uid, { role, organizationId })
        .then(() => {
            console.log('Custom claims set for user', user.uid);
        })
        .catch((error) => {
            console.error('Error setting custom claims:', error);
        });
});
