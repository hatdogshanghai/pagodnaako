@echo off
echo Git Configuration Script
echo ======================
echo.

cd /d "%~dp0"

echo Current directory: %CD%
echo.

echo Setting up Git configuration...
echo.

set /p user_name=Enter your GitHub username: 
set /p user_email=Enter your GitHub email: 

git config --global user.name "%user_name%"
git config --global user.email "%user_email%"

echo.
echo Git configuration set:
echo Username: %user_name%
echo Email: %user_email%
echo.

echo Setting up remote URL...
git remote set-url origin https://github.com/hatdogshanghai/pagodnaako.git
echo.

echo Remote URL set to: https://github.com/hatdogshanghai/pagodnaako.git
echo.

echo Configuration complete!
echo Now you can run simple-push.bat to push your changes to GitHub.
echo.

pause
