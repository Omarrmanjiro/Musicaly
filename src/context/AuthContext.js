import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);      // Firebase Auth user
  const [profile, setProfile] = useState(null); // Firestore profile
  const [loading, setLoading] = useState(true);

  // REGISTER
  const register = async (email, password, username) => {
    const cred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const uid = cred.user.uid;

    await setDoc(doc(db, "users", uid), {
      email,
      username,
      photoURL: null,
      createdAt: serverTimestamp(),
    });

    return cred.user;
  };

  // LOGIN
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
  };

  // 🔥 CORE LOGIC: Auth → Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);

        // Fetch Firestore profile
        const snap = await getDoc(
          doc(db, "users", authUser.uid)
        );

        if (snap.exists()) {
          setProfile(snap.data());
        } else {
          console.warn("No Firestore profile found");
          setProfile(null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        register,
        login,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
