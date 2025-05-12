// Authentication utilities for Yogee website

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
let app = null;
let auth = null;
let database = null;

// Function to initialize Firebase
function initFirebase() {
    if (!app) {
        app = firebase.initializeApp(firebaseConfig);
        auth = app.auth();
        database = app.database();
    }
    return { app, auth, database };
}

// Function to handle user login
async function loginUser(email, password) {
    try {
        const { auth } = initFirebase();
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: error.message };
    }
}

// Function to check if a user is logged in
function isUserLoggedIn(callback) {
    const { auth } = initFirebase();
    return auth.onAuthStateChanged(callback);
}

// Function to log out a user
async function logoutUser() {
    try {
        const { auth } = initFirebase();
        await auth.signOut();
        return { success: true };
    } catch (error) {
        console.error("Logout error:", error);
        return { success: false, error: error.message };
    }
}

// Make functions available globally
window.initFirebase = initFirebase;
window.loginUser = loginUser;
window.isUserLoggedIn = isUserLoggedIn;
window.logoutUser = logoutUser;
