Write-Host "GitHub Upload Script" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Green
Write-Host ""

# Change to the script's directory
Set-Location $PSScriptRoot

Write-Host "Current directory: $PWD" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking Git status..." -ForegroundColor Yellow
git status
Write-Host ""

Write-Host "Adding files..." -ForegroundColor Yellow
git add .
Write-Host ""

$commitMessage = Read-Host "Enter commit message (or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Update TasteMakers project"
}

Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m $commitMessage
Write-Host ""

Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main
Write-Host ""

Write-Host "Process completed!" -ForegroundColor Green
Write-Host ""
Write-Host "If you encountered any authentication issues, please:" -ForegroundColor Cyan
Write-Host "1. Visit https://github.com/settings/tokens to create a personal access token" -ForegroundColor Cyan
Write-Host "2. Use that token as your password when prompted" -ForegroundColor Cyan

Read-Host "Press Enter to exit"
