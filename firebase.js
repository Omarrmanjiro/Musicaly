import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "musicaly-1e8d6.firebaseapp.com",
  projectId: "musicaly-1e8d6",
  storageBucket: "musicaly-1e8d6.appspot.com",
  messagingSenderId: "835386849958",
  appId: "1:835386849958:web:5413de8808d61175d65267",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
