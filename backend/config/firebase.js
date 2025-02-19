const admin = require("firebase-admin");
const serviceAccount = require("./firebaseAdmin.json"); // Make sure this path is correct

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://codecollab-hub.firebaseio.com", // Update if needed
});

const db = admin.firestore(); // Firestore Database

module.exports = { admin, db };
