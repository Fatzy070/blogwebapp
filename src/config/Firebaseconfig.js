// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbVgrSvMPh9FGoizAVqhY2M4EQ6wFKs90",
  authDomain: "project-84d6e.firebaseapp.com",
  projectId: "project-84d6e",
  storageBucket: "project-84d6e.firebasestorage.app",
  messagingSenderId: "588807424901",
  appId: "1:588807424901:web:43a26f4126108ff2f312ec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);