// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCVV18xV9xbomI009MkUhoo2_LlQ3rlDH8",
  authDomain: "vitalytics-f68c5.firebaseapp.com",
  projectId: "vitalytics-f68c5",
  storageBucket: "vitalytics-f68c5.firebasestorage.app",
  messagingSenderId: "745768115418",
  appId: "1:745768115418:web:bc790d30982fbbac2159e3",
  measurementId: "G-LK9S7JCRXY",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };
export default app;