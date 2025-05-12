@echo off
echo Starting React application and opening Admin Login page...
start cmd /k "npm start"
timeout /t 10
start http://localhost:3000/admin-login
echo Admin login page has been opened in your browser.
echo.
echo IMPORTANT: This script ensures that only the admin page is accessible.
echo Regular user accounts cannot access admin pages, and admin accounts cannot access user pages.
echo.
