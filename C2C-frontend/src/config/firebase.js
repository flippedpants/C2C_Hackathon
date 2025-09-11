// Frontend Firebase Configuration
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

// 🔥 Firebase Configuration
// Get these values from your Firebase Console > Project Settings > General
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID 
};

// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Get Auth instance
const auth = getAuth(app);
// 🗄️ Firestore
const db = getFirestore(app);

// 🎯 Google Provider
const googleProvider = new GoogleAuthProvider();

// 📝 Google Sign In Function
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user; // Returns user object with name, email, photo, etc.
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error; // Re-throw so we can handle it in the component
  }
};

// ➕ Ensure a wardrobe document exists for the user
export const ensureWardrobeDocument = async (user) => {
  if (!user || !user.uid) return;
  const ref = doc(db, "wardrobes", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      displayName: user.displayName || null,
      email: user.email || null,
      photoURL: user.photoURL || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      items: [],
    });
  } else {
    // touch updatedAt
    await setDoc(ref, { updatedAt: serverTimestamp() }, { merge: true });
  }
};

// 🚪 Sign Out Function
export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
};

// 📤 Export auth instance for other uses
export { auth, db };
