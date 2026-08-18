@echo off
setlocal
cd /d "%~dp0"

if not exist ".env" (
  copy /Y ".env.example" ".env" >nul
  echo Created .env from .env.example
  echo IMPORTANT: Set JWT_ACCESS_SECRET to the same secret used by IAM.
)

if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 exit /b 1
)

echo Starting Omni-Channel API Gateway on port 8080...
call npm run dev
