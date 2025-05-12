@echo off
echo Starting Admin application on port 3001...
start cmd /k "npm run start-admin"
timeout /t 10
start http://localhost:3001/admin-login
echo Admin page has been opened in your browser.
