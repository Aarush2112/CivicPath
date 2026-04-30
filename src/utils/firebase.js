import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

/**
 * Firebase initialization with guards for production stability
 */
let app = null;
let auth = null;
let db = null;

try {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
  };

  // Only initialize if core config is present
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase initialized successfully");
  } else {
    console.warn("Firebase configuration missing — running without persistence features");
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export { auth, db };

/**
 * Signs in the user anonymously and returns the user object
 */
export const loginAnonymously = async () => {
  if (!auth) return { uid: "guest-mode", isAnonymous: true };
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.warn("Firebase Auth failed (falling back to guest mode):", error);
    return { uid: "guest-mode", isAnonymous: true };
  }
};

/**
 * Saves a chat session to Firestore
 */
export const saveChatSession = async (uid, messages) => {
  if (!db || !uid || uid === "guest-mode") return;
  try {
    const sessionRef = doc(db, "sessions", uid);
    await setDoc(sessionRef, { 
      chats: messages,
      updatedAt: new Date()
    }, { merge: true });
  } catch (error) {
    console.error("Firestore Save Error:", error);
  }
};

/**
 * Loads a chat session from Firestore
 */
export const loadChatSession = async (uid) => {
  if (!db || !uid || uid === "guest-mode") return null;
  try {
    const sessionRef = doc(db, "sessions", uid);
    const docSnap = await getDoc(sessionRef);
    if (docSnap.exists()) {
      return docSnap.data().chats;
    }
    return null;
  } catch (error) {
    console.error("Firestore Load Error:", error);
    return null;
  }
};
