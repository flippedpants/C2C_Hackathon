// src/firebase.js
import dotenv from "dotenv";
dotenv.config();
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// 1️⃣ Firebase config
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_ID,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// 2️⃣ Initialize Firebase
const app = initializeApp(firebaseConfig);

// 3️⃣ Auth and Firestore references
const auth = getAuth(app);
const db = getFirestore(app);

// 4️⃣ Google provider
const provider = new GoogleAuthProvider();

// 5️⃣ Login function
const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Create a new document in 'wardrobes' collection with user's displayName
    if (user && user.displayName) {
      const wardrobeRef = doc(db, "wardrobes", user.displayName);
      await setDoc(wardrobeRef, {
        uid: user.uid,
        email: user.email,
        createdAt: new Date().toISOString()
      });
    }

    return user; // Return the user object
    
  } catch (error) {
    console.error("Error during Google login:", error);
    throw error; // Rethrow the error to be caught in the component
  }
};

// 6️⃣ Logout function
const logout = async () => {
  await signOut(auth);
};

export { auth, db, loginWithGoogle, logout, provider };
