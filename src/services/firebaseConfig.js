// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBIpTbN33ZVRizrLlhFy7kXa1N92qJrs4I",
  authDomain: "bingo-viva-conectado.firebaseapp.com",
  databaseURL: "https://bingo-viva-conectado-default-rtdb.firebaseio.com",
  projectId: "bingo-viva-conectado",
  storageBucket: "bingo-viva-conectado.firebasestorage.app",
  messagingSenderId: "37899895212",
  appId: "1:37899895212:web:1df44b35ef2d93c84e3a09",
  measurementId: "G-NNG2T28FXH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);