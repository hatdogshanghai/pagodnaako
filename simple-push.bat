@echo off
echo Simple GitHub Push Script
echo ========================
echo.

cd /d "%~dp0"

echo Current directory: %CD%
echo.

echo Pushing to GitHub...
git push origin main
echo.

echo If you're prompted for credentials, enter your GitHub username and password or personal access token.
echo.

pause
