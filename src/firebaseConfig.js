import { getFirestore } from "firebase/firestore";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7o3lP0EA-Dl9UfVTwLyxti66X1E9GSiQ",
  authDomain: "api-cpl.firebaseapp.com",
  projectId: "api-cpl",
  storageBucket: "api-cpl.firebasestorage.app",
  messagingSenderId: "303731942902",
  appId: "1:303731942902:web:bb48e64f56ea9ff85753d7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
