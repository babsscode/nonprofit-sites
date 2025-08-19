// firebase-config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// Your web app's Firebase configuration
// Replace these with your actual Firebase config values
const firebaseConfig = {
  apiKey: "AIzaSyCWlBHFo1-N6FiRHEbLRTFnqgesBfbc3Bw",
  authDomain: "getstartersite.firebaseapp.com",
  projectId: "getstartersite",
  storageBucket: "getstartersite.firebasestorage.app",
  messagingSenderId: "796321293166",
  appId: "1:796321293166:web:770371ae606cea5adf577f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;