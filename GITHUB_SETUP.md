# GitHub Setup Guide

This guide will walk you through the process of uploading your project to GitHub.

## Prerequisites

- [Git](https://git-scm.com/downloads) installed on your computer
- A [GitHub](https://github.com/) account

## Step 1: Create a New Repository on GitHub

1. Log in to your GitHub account
2. Click on the "+" icon in the top right corner and select "New repository"
3. Enter a repository name (e.g., "yogee-app")
4. Add a description (optional)
5. Choose whether the repository should be public or private
6. Do NOT initialize the repository with a README, .gitignore, or license
7. Click "Create repository"

## Step 2: Initialize Git in Your Local Project

Open a terminal or command prompt and navigate to your project directory:

```bash
cd path/to/your/project
```

Initialize a Git repository:

```bash
git init
```

## Step 3: Add Your Files to Git

Add all files to the staging area:

```bash
git add .
```

If you want to exclude certain files or directories, make sure they are listed in the `.gitignore` file.

## Step 4: Commit Your Changes

Create your first commit:

```bash
git commit -m "Initial commit"
```

## Step 5: Connect Your Local Repository to GitHub

Add the GitHub repository as a remote:

```bash
git remote add origin https://github.com/yourusername/yogee-app.git
```

Replace `yourusername` and `yogee-app` with your GitHub username and repository name.

## Step 6: Push Your Code to GitHub

Push your code to the main branch:

```bash
git push -u origin main
```

If you're using an older version of Git that uses `master` as the default branch name:

```bash
git push -u origin master
```

## Step 7: Verify Your Upload

1. Go to your GitHub repository in your web browser
2. Refresh the page if necessary
3. You should see all your files and directories listed

## Additional Git Commands

### Checking Status

To see which files have been changed:

```bash
git status
```

### Viewing Commit History

To see the commit history:

```bash
git log
```

### Creating a New Branch

To create and switch to a new branch:

```bash
git checkout -b feature/new-feature
```

### Switching Branches

To switch to an existing branch:

```bash
git checkout branch-name
```

### Pulling Updates

To pull updates from the remote repository:

```bash
git pull origin main
```

### Pushing Updates

After making changes and committing them:

```bash
git push origin main
```

## Setting Up GitHub Pages (Optional)

If you want to deploy your app using GitHub Pages:

1. Go to your repository on GitHub
2. Click on "Settings"
3. Scroll down to the "GitHub Pages" section
4. Under "Source", select the branch you want to deploy (usually "main")
5. Click "Save"
6. Your site will be published at `https://yourusername.github.io/yogee-app/`

## Troubleshooting

### Authentication Issues

If you're having trouble authenticating with GitHub, you might need to set up SSH keys or use a personal access token. See GitHub's documentation on [authentication](https://docs.github.com/en/authentication).

### Large Files

GitHub has a file size limit of 100 MB. If you have larger files, consider using [Git LFS](https://git-lfs.github.com/) or excluding them from your repository.

### .gitignore Not Working

If files that should be ignored are still being tracked, you might need to clear Git's cache:

```bash
git rm -r --cached .
git add .
git commit -m "Fixed gitignore"
```

## Next Steps

After setting up your GitHub repository, consider:

1. Adding collaborators to your project
2. Setting up branch protection rules
3. Configuring GitHub Actions for CI/CD
4. Creating issues and project boards to track work
