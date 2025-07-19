import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCV3mR7z4w35E7C03jWUnpKPA9ip9cYqCE",
  authDomain: "praktykacorelogic.firebaseapp.com",
  projectId: "praktykacorelogic",
  storageBucket: "praktykacorelogic.firebasestorage.app",
  messagingSenderId: "383206037684",
  appId: "1:383206037684:web:7644c3aac1e929e9275fe1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
