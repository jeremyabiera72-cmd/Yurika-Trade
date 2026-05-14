import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCHhA8b0uZ7V903U6duw3NkZuvNJN0l9o0",
  authDomain: "yurika-trade.firebaseapp.com",
  projectId: "yurika-trade",
  storageBucket: "yurika-trade.firebasestorage.app",
  messagingSenderId: "1074171131150",
  appId: "1:1074171131150:web:fae7c9e5bcfabff42c935f",
  measurementId: "G-MT1DM80J6K"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
