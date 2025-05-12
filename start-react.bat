@echo off
SET PATH=%PATH%;C:\Program Files\nodejs
cd /d "%~dp0"
echo Starting React application...
call "C:\Program Files\nodejs\npm.cmd" start
