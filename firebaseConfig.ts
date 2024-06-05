import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2kp8t8Ca84UAxKq_-xucQ1lZtR8H-YhE",
  authDomain: "buseurolines-c1fb9.firebaseapp.com",
  projectId: "buseurolines-c1fb9",
  storageBucket: "buseurolines-c1fb9.appspot.com",
  messagingSenderId: "491162178182",
  appId: "1:491162178182:web:51eaa672ca2b09a026b707",
  measurementId: "G-BNRE1230LX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };