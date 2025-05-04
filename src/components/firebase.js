import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3…",
  authDomain: "asir-chat.firebaseapp.com",
  projectId: "asir-chat",
  appId: "1:12345:web:abc123"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
