# Add Node.js to the system PATH
$nodejsPath = "C:\Program Files\nodejs"

# Get the current PATH
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")

# Check if Node.js path is already in the PATH
if ($currentPath -notlike "*$nodejsPath*") {
    # Add Node.js to the PATH
    $newPath = "$currentPath;$nodejsPath"
    
    # Set the new PATH
    [Environment]::SetEnvironmentVariable("PATH", $newPath, "Machine")
    
    Write-Host "Node.js has been added to your system PATH."
    Write-Host "Please restart your terminal or computer for the changes to take effect."
} else {
    Write-Host "Node.js is already in your system PATH."
}
