#!/bin/bash

# Script to help upload the project to GitHub

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Yogee App GitHub Upload Script${NC}"
echo "This script will help you upload your project to GitHub."
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}Git is not installed. Please install Git first.${NC}"
    exit 1
fi

# Check if the directory is already a git repository
if [ -d .git ]; then
    echo -e "${YELLOW}This directory is already a Git repository.${NC}"
    echo "Do you want to continue with the existing repository? (y/n)"
    read continue_with_existing
    
    if [ "$continue_with_existing" != "y" ]; then
        echo "Exiting script."
        exit 0
    fi
else
    # Initialize git repository
    echo -e "${GREEN}Initializing Git repository...${NC}"
    git init
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to initialize Git repository.${NC}"
        exit 1
    fi
fi

# Ask for GitHub repository URL
echo ""
echo "Please enter your GitHub repository URL (e.g., https://github.com/yourusername/yogee-app.git):"
read github_url

if [ -z "$github_url" ]; then
    echo -e "${RED}GitHub URL cannot be empty.${NC}"
    exit 1
fi

# Check if remote origin already exists
if git remote | grep -q "^origin$"; then
    echo -e "${YELLOW}Remote 'origin' already exists.${NC}"
    echo "Do you want to update it to $github_url? (y/n)"
    read update_remote
    
    if [ "$update_remote" = "y" ]; then
        git remote set-url origin "$github_url"
        echo -e "${GREEN}Remote 'origin' updated to $github_url${NC}"
    fi
else
    # Add remote
    echo -e "${GREEN}Adding remote 'origin'...${NC}"
    git remote add origin "$github_url"
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to add remote.${NC}"
        exit 1
    fi
fi

# Stage all files
echo ""
echo -e "${GREEN}Staging all files...${NC}"
git add .

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to stage files.${NC}"
    exit 1
fi

# Commit
echo ""
echo "Enter a commit message (default: 'Initial commit'):"
read commit_message

if [ -z "$commit_message" ]; then
    commit_message="Initial commit"
fi

echo -e "${GREEN}Committing changes...${NC}"
git commit -m "$commit_message"

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to commit changes.${NC}"
    exit 1
fi

# Push to GitHub
echo ""
echo -e "${GREEN}Pushing to GitHub...${NC}"
echo "This may prompt you for your GitHub username and password or token."

# Determine the default branch name
default_branch=$(git symbolic-ref --short HEAD 2>/dev/null)
if [ -z "$default_branch" ]; then
    default_branch="main"
fi

git push -u origin "$default_branch"

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to push to GitHub.${NC}"
    echo "If you're having authentication issues, you might need to set up a personal access token."
    echo "Visit: https://github.com/settings/tokens to create a token."
    exit 1
fi

echo ""
echo -e "${GREEN}Success! Your project has been uploaded to GitHub.${NC}"
echo "Repository URL: $github_url"
echo ""
echo "Next steps:"
echo "1. Visit your GitHub repository to verify the upload"
echo "2. Set up GitHub Pages if you want to deploy your app (Settings > Pages)"
echo "3. Add collaborators if needed (Settings > Manage access)"
echo ""
echo "For more information, see the GITHUB_SETUP.md file."

exit 0
