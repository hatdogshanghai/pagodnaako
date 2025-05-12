@echo off
echo ===================================
echo GitHub Repository Upload Script
echo ===================================
echo.

echo This script will help you push the TasteMakers project to GitHub.
echo.

cd /d "%~dp0"

echo Current directory: %CD%
echo.

echo Checking Git status...
git status
echo.

echo Adding any remaining files...
git add .
echo.

echo Committing changes...
set /p commit_message=Enter commit message (or press Enter for default): 
if "%commit_message%"=="" set commit_message=Update TasteMakers project files
git commit -m "%commit_message%"
echo.

echo Pushing to GitHub...
git push origin main
echo.

echo ===================================
echo Process completed!
echo.
echo If you encountered any authentication issues, please:
echo 1. Visit https://github.com/settings/tokens to create a personal access token
echo 2. Use that token as your password when prompted
echo ===================================

pause
