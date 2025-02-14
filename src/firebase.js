// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set, get, child, update, remove } from "firebase/database";
import {  onAuthStateChanged } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // apiKey: "AIzaSyB4mTh1veuQ9yrqfsooFoL0TvvW28eCDP0",
  // authDomain: "u-key-db.firebaseapp.com",
  // projectId: "u-key-db",
  // databaseURL: "https://u-key-db-default-rtdb.firebaseio.com/",
  // storageBucket: "u-key-db.firebasestorage.app",
  // messagingSenderId: "408265586740",
  // appId: "1:408265586740:web:e3ccd061f5fd327f6bf261",
  // measurementId: "G-BG1XWEF80V"

  apiKey: "AIzaSyA75MF8-VNOoMaE6nSDrBTboT4mFbmVNLU",
  authDomain: "u-key-db-1a39d.firebaseapp.com",
  projectId: "u-key-db-1a39d",
  databaseURL: "https://u-key-db-1a39d-default-rtdb.firebaseio.com/",
  storageBucket: "u-key-db-1a39d.firebasestorage.app",
  messagingSenderId: "726830511167",
  appId: "1:726830511167:web:2b1c9fb1eb00dd82ebb48a",
  measurementId: "G-LQSHC5PGJ7"
};


const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const rtdb = getDatabase(app);  // This is the Realtime Database
export { onAuthStateChanged };
export { auth, rtdb, createUserWithEmailAndPassword, signInWithEmailAndPassword, ref, set, get, child, update, remove };

