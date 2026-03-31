@echo off
REM Blackbox AI MCP Setup Script for Windows
REM This script helps you set up Blackbox AI integration with your MCP server

setlocal enabledelayedexpansion

echo ===============================================================
echo   Blackbox AI MCP Server Setup
echo ===============================================================
echo.

REM Check if .env file exists
if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo Successfully created .env file
) else (
    echo .env file already exists
)

echo.
echo API Key Setup
echo ---------------------------------------------------------------
echo.
echo Steps to get your Blackbox AI API key:
echo 1. Visit https://blackbox.ai
echo 2. Sign up or log in with GitHub/Google
echo 3. Go to Account Settings - API Keys
echo 4. Create a new API key
echo 5. Copy the key
echo.
echo Update BLACKBOX_API_KEY in your .env file:
echo   BLACKBOX_API_KEY=your_api_key_here
echo.

echo.
echo Installing Dependencies
echo ---------------------------------------------------------------
call npm install

echo.
echo Building Project  
echo ---------------------------------------------------------------
call npm run build

echo.
echo ===============================================================
echo   Setup Complete!
echo ===============================================================
echo.
echo Next steps:
echo 1. Configure your Blackbox API key in .env
echo 2. Start the server: npm start
echo 3. Or for HTTP mode: npm run start:http
echo 4. Inspect the server: npm run inspect
echo.
echo Available Blackbox AI tools:
echo   - blackbox_query_code  ^(Search code across repositories^)
echo   - blackbox_ask         ^(Ask questions and generate code^)
echo.
echo For more information, see BLACKBOX_INTEGRATION.md
echo.
