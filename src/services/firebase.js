import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAe_9cLfhCyt9ACJcndpZrn6FslK8v83Rk",
  authDomain: "yogeelogin.firebaseapp.com",
  databaseURL: "https://yogeelogin-default-rtdb.firebaseio.com",
  projectId: "yogeelogin",
  storageBucket: "yogeelogin.appspot.com",
  messagingSenderId: "48290836478",
  appId: "1:48290836478:web:8b43881d88456ad9659aaf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

// Connect to emulators in development mode
if (process.env.NODE_ENV === 'development' && window.location.hostname === 'localhost') {
  try {
    // Firebase emulators configuration would go here if needed
    console.log('Firebase initialized in development mode');
  } catch (error) {
    console.error('Failed to initialize Firebase in development mode:', error);
  }
}

export { app, auth, database, storage };
