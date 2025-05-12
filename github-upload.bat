@echo off
echo GitHub Upload Script
echo ===================

git add .
git commit -m "Update TasteMakers project"
git push origin main

echo Done!
pause
