// src/firebase.js
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// --- PASTE YOUR REAL CONFIG HERE ---
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAhYVJ-pmorvFvc7m8mYVhbfuRtDZa5K4",
  authDomain: "anb-jewllery.firebaseapp.com",
  projectId: "anb-jewllery",
  storageBucket: "anb-jewllery.firebasestorage.app",
  messagingSenderId: "187136411370",
  appId: "1:187136411370:web:968e3ef95c425f439fb993",
  measurementId: "G-JNPJ68KW8F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// -----------------------------------
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();