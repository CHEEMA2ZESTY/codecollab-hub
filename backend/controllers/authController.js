const { admin, db } = require("../config/firebase");

exports.register = async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: username,
    });

    // Store additional user data in Firestore
    await db.collection("users").doc(userRecord.uid).set({
      username,
      email,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "User registered successfully", uid: userRecord.uid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Firebase Auth handles login on frontend (React)
    res.status(200).json({ message: "Login handled on frontend using Firebase Auth" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  const { uid } = req.params;

  try {
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(userDoc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
