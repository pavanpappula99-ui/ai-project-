$git = ".\PortableGit\cmd\git.exe"

# Configure identity
& $git config --global user.email "pavanpappula99@gmail.com"
& $git config --global user.name "Pavan Pappula"
& $git config --global core.autocrlf true
& $git config --global init.defaultBranch main

# Init repo if needed
if (-not (Test-Path ".git")) {
    & $git init
    Write-Output "Initialized new git repo"
} else {
    Write-Output "Git repo already exists"
}

# Set / update remote
$remote = & $git remote
if ($remote -contains "origin") {
    & $git remote set-url origin https://github.com/pavanpappula99-ui/ai-project-.git
    Write-Output "Updated remote origin"
} else {
    & $git remote add origin https://github.com/pavanpappula99-ui/ai-project-.git
    Write-Output "Added remote origin"
}

# Stage all files
& $git add -A
Write-Output "Files staged"

# Commit
& $git commit -m "feat: Bharat Translator v2.2.0 - Full Indian language speech & text translator"
Write-Output "Committed"

# Push to main branch
& $git push -u origin main
Write-Output "Push complete"
