@echo off
echo Starting both User and Admin applications...

echo Starting User application on port 3000...
start cmd /k "npm start"

echo Starting Admin application on port 3001...
start cmd /k "npm run start-admin"

timeout /t 15

echo Opening User page in browser...
start http://localhost:3000

echo Opening Admin page in browser...
start http://localhost:3001/admin-login

echo Both applications have been started and opened in your browser.
