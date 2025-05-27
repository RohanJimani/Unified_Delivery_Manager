// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCuIVNBPKwaXkoNn5Nw29yQAxiDBotRwjQ",
  authDomain: "delivery-unified-platform.firebaseapp.com",
  projectId: "delivery-unified-platform",
  storageBucket: "delivery-unified-platform.firebasestorage.app",
  messagingSenderId: "730694868472",
  appId: "1:730694868472:web:fc03bb852028aecce18a0d",
  measurementId: "G-00HK1PYCJ5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
