@echo off
echo Starting User application on port 3000...
start cmd /k "npm start"
timeout /t 10
start http://localhost:3000
echo User page has been opened in your browser.
