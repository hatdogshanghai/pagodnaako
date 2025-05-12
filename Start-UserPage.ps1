# PowerShell script to start React app and open user page
Write-Host "Starting React application and opening User page..." -ForegroundColor Cyan

# Start the React application in a new window
Start-Process -FilePath "cmd.exe" -ArgumentList "/k npm start"

# Wait for the application to start
Write-Host "Waiting for the application to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Open the user homepage in the default browser
Start-Process "http://localhost:3000"

Write-Host "User page has been opened in your browser." -ForegroundColor Green
