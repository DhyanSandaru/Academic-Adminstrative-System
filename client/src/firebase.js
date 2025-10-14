// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZLOufGa-1NPExB49y1jw-wYgNbLmmwdI",
  authDomain: "institute-management-sys-3c305.firebaseapp.com",
  projectId: "institute-management-sys-3c305",
  storageBucket: "institute-management-sys-3c305.firebasestorage.app",
  messagingSenderId: "178906993279",
  appId: "1:178906993279:web:9c2a816168d47d2a6a254a",
  measurementId: "G-DHYLJHK3D4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth, sendPasswordResetEmail, signInWithEmailAndPassword };
