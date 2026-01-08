// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
//import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1JBLN9IC6f-j-U8XE2wApsaxGIS56IBU",
  authDomain: "musicaly-1e8d6.firebaseapp.com",
  projectId: "musicaly-1e8d6",
  storageBucket: "musicaly-1e8d6.firebasestorage.app",
  messagingSenderId: "835386849958",
  appId: "1:835386849958:web:5413de8808d61175d65267",
  measurementId: "G-KSD2WW8MP5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
//export const storage = getStorage(app);