# PowerShell script to install express-basic-auth
Write-Host "Installing express-basic-auth..."
npm install express-basic-auth@1.2.1 --save
if ($LASTEXITCODE -eq 0) {
    Write-Host "Successfully installed express-basic-auth"
    npm install @types/express-basic-auth --save-dev
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Successfully installed @types/express-basic-auth"
    } else {
        Write-Host "Failed to install @types/express-basic-auth"
    }
} else {
    Write-Host "Failed to install express-basic-auth"
}
