// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZLOufGa-1NPExB49y1jw-wYgNbLmmwdI",
  authDomain: "institute-management-sys-3c305.firebaseapp.com",
  databaseURL: "https://institute-management-sys-3c305-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "institute-management-sys-3c305",
  storageBucket: "institute-management-sys-3c305.firebasestorage.app",
  messagingSenderId: "178906993279",
  appId: "1:178906993279:web:3aac9062e7ce67106a254a",
  measurementId: "G-9NWG027R2J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getDatabase(app);
export const auth = getAuth(app);


