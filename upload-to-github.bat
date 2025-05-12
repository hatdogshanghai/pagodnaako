@echo off
setlocal enabledelayedexpansion

echo Yogee App GitHub Upload Script
echo This script will help you upload your project to GitHub.
echo.

REM Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Git is not installed. Please install Git first.
    exit /b 1
)

REM Check if the directory is already a git repository
if exist .git (
    echo This directory is already a Git repository.
    set /p continue_with_existing=Do you want to continue with the existing repository? (y/n): 
    
    if /i not "!continue_with_existing!"=="y" (
        echo Exiting script.
        exit /b 0
    )
) else (
    REM Initialize git repository
    echo Initializing Git repository...
    git init
    
    if %ERRORLEVEL% neq 0 (
        echo Failed to initialize Git repository.
        exit /b 1
    )
)

REM Ask for GitHub repository URL
echo.
set /p github_url=Please enter your GitHub repository URL (e.g., https://github.com/yourusername/yogee-app.git): 

if "!github_url!"=="" (
    echo GitHub URL cannot be empty.
    exit /b 1
)

REM Check if remote origin already exists
git remote | findstr /B "origin" >nul
if %ERRORLEVEL% equ 0 (
    echo Remote 'origin' already exists.
    set /p update_remote=Do you want to update it to !github_url!? (y/n): 
    
    if /i "!update_remote!"=="y" (
        git remote set-url origin "!github_url!"
        echo Remote 'origin' updated to !github_url!
    )
) else (
    REM Add remote
    echo Adding remote 'origin'...
    git remote add origin "!github_url!"
    
    if %ERRORLEVEL% neq 0 (
        echo Failed to add remote.
        exit /b 1
    )
)

REM Stage all files
echo.
echo Staging all files...
git add .

if %ERRORLEVEL% neq 0 (
    echo Failed to stage files.
    exit /b 1
)

REM Commit
echo.
set /p commit_message=Enter a commit message (default: 'Initial commit'): 

if "!commit_message!"=="" (
    set commit_message=Initial commit
)

echo Committing changes...
git commit -m "!commit_message!"

if %ERRORLEVEL% neq 0 (
    echo Failed to commit changes.
    exit /b 1
)

REM Push to GitHub
echo.
echo Pushing to GitHub...
echo This may prompt you for your GitHub username and password or token.

REM Determine the default branch name
for /f "tokens=*" %%a in ('git symbolic-ref --short HEAD 2^>nul') do set default_branch=%%a
if "!default_branch!"=="" (
    set default_branch=main
)

git push -u origin !default_branch!

if %ERRORLEVEL% neq 0 (
    echo Failed to push to GitHub.
    echo If you're having authentication issues, you might need to set up a personal access token.
    echo Visit: https://github.com/settings/tokens to create a token.
    exit /b 1
)

echo.
echo Success! Your project has been uploaded to GitHub.
echo Repository URL: !github_url!
echo.
echo Next steps:
echo 1. Visit your GitHub repository to verify the upload
echo 2. Set up GitHub Pages if you want to deploy your app (Settings ^> Pages)
echo 3. Add collaborators if needed (Settings ^> Manage access)
echo.
echo For more information, see the GITHUB_SETUP.md file.

pause
exit /b 0
