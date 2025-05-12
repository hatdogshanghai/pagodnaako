/**
 * Create Schedules Script
 * This script creates sample schedules in Firebase if none exist yet
 */

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAe_9cLfhCyt9ACJcndpZrn6FslK8v83Rk",
    authDomain: "yogeelogin.firebaseapp.com",
    databaseURL: "https://yogeelogin-default-rtdb.firebaseio.com",
    projectId: "yogeelogin",
    storageBucket: "yogeelogin.appspot.com",
    messagingSenderId: "48290836478",
    appId: "1:48290836478:web:8b43881d88456ad9659aaf"
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Function to create sample schedules
function createSampleSchedules() {
    const database = firebase.database();
    const schedulesRef = database.ref('schedules');
    
    // Check if schedules already exist
    schedulesRef.once('value')
        .then(snapshot => {
            if (!snapshot.exists()) {
                console.log('No schedules found. Creating sample schedules...');
                
                // Get current date
                const now = new Date();
                
                // Create sample schedules
                const sampleSchedules = {
                    'SCH-001': {
                        event: 'Delivery to Customer',
                        date: formatDate(addDays(now, 1)),
                        time: '10:00 AM',
                        status: 'Pending',
                        createdAt: firebase.database.ServerValue.TIMESTAMP
                    },
                    'SCH-002': {
                        event: 'Order Packaging',
                        date: formatDate(addDays(now, 0)),
                        time: '09:00 AM',
                        status: 'Confirmed',
                        createdAt: firebase.database.ServerValue.TIMESTAMP
                    },
                    'SCH-003': {
                        event: 'Customer Meeting',
                        date: formatDate(addDays(now, 2)),
                        time: '11:30 AM',
                        status: 'Pending',
                        createdAt: firebase.database.ServerValue.TIMESTAMP
                    }
                };
                
                // Save sample schedules to Firebase
                return schedulesRef.set(sampleSchedules);
            } else {
                console.log('Schedules already exist. No need to create samples.');
                return Promise.resolve();
            }
        })
        .then(() => {
            console.log('Sample schedules created successfully!');
        })
        .catch(error => {
            console.error('Error creating sample schedules:', error);
        });
}

// Helper function to add days to a date
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// Helper function to format date as YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Call the function when the script is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only create sample schedules if the user is an admin
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            firebase.database().ref('users/' + user.uid).once('value')
                .then(snapshot => {
                    const userData = snapshot.val();
                    if (userData && userData.role === 'admin') {
                        createSampleSchedules();
                    }
                })
                .catch(error => {
                    console.error('Error checking admin role:', error);
                });
        }
    });
});
