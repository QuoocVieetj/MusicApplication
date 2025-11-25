// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDwzqjPipuDcVZ1O6bwP7IXushooHLADzo",
  authDomain: "music-345e2.firebaseapp.com",
  projectId: "music-345e2",
  storageBucket: "music-345e2.appspot.com",        
  messagingSenderId: "960726236406",
  appId: "1:960726236406:web:2f75c01c659d1337b480d7",
  measurementId: "G-6FJBZB4LVL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
