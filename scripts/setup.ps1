Write-Host "Installing server dependencies..."
Push-Location (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location ..\server
npm install
Write-Host "Installing client dependencies..."
Set-Location ..\client
npm install
Write-Host "Done."
Pop-Location