import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * Signs in the user anonymously and returns the user object
 * @returns {Promise<import("firebase/auth").User>}
 */
export const loginAnonymously = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error("Firebase Auth Error:", error);
    throw error;
  }
};

/**
 * Saves a chat session to Firestore
 * @param {string} uid - User ID
 * @param {Array} messages - Chat messages
 */
export const saveChatSession = async (uid, messages) => {
  if (!uid) return;
  try {
    const sessionRef = doc(db, "sessions", uid);
    await setDoc(sessionRef, { 
      chats: messages,
      lastUpdated: new RegExp().toString(), // Using string for simple demo
      updatedAt: new Date()
    }, { merge: true });
  } catch (error) {
    console.error("Firestore Save Error:", error);
  }
};

/**
 * Loads a chat session from Firestore
 * @param {string} uid - User ID
 * @returns {Promise<Array|null>}
 */
export const loadChatSession = async (uid) => {
  if (!uid) return null;
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
