// Home Admin Check JavaScript
// This script checks if the current user is an admin and adds an admin dashboard link if they are

document.addEventListener('DOMContentLoaded', function() {
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

    const auth = firebase.auth();
    const database = firebase.database();

    // Check if user is logged in
    auth.onAuthStateChanged(function(user) {
        if (user) {
            console.log("User is signed in:", user.email);

            // Check if user is an admin
            database.ref('users/' + user.uid).once('value')
                .then(function(snapshot) {
                    const userData = snapshot.val();

                    if (userData && userData.role === 'admin') {
                        console.log("User is an admin, adding admin dashboard link");

                        // Add admin dashboard link to the navigation
                        addAdminDashboardLink();

                        // Add admin badge to the user name
                        addAdminBadge();
                    }
                })
                .catch(function(error) {
                    console.error("Error checking admin role:", error);
                });
        }
    });

    // Function to add admin dashboard link to the navigation
    function addAdminDashboardLink() {
        // Get the navigation element - specifically the navbar div
        const navbarElement = document.querySelector('.navbar');

        if (navbarElement) {
            // Create admin dashboard link
            const adminLink = document.createElement('a');
            adminLink.href = 'admin-dashboard.html';
            adminLink.textContent = 'Admin Dashboard';
            adminLink.className = 'nav-link admin-link';
            adminLink.style.color = '#d9553c';
            adminLink.style.fontWeight = 'bold';

            // Add the link to the navigation
            navbarElement.appendChild(adminLink);

            // Add click event listener to handle direct navigation
            adminLink.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'admin-dashboard.html';
            });
        }
    }

    // Function to add admin badge to the user name
    function addAdminBadge() {
        const userNameElement = document.getElementById('user-name');

        if (userNameElement) {
            // Add admin badge
            const adminBadge = document.createElement('span');
            adminBadge.textContent = ' (Admin)';
            adminBadge.style.color = '#d9553c';
            adminBadge.style.fontWeight = 'bold';
            adminBadge.style.fontSize = '0.8em';

            userNameElement.appendChild(adminBadge);
        }
    }
});
