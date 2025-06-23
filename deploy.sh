#!/bin/bash

# Wine Deals Agent Deployment Script
echo "🍷 Wine Deals Agent - Deployment Script"
echo "========================================"

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI is not installed."
    echo "Please install it from: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Check if user is logged in to Heroku
if ! heroku auth:whoami &> /dev/null; then
    echo "❌ Not logged in to Heroku. Please run: heroku login"
    exit 1
fi

# Get app name from user
echo "Enter your Heroku app name (or press Enter to create a new one):"
read app_name

if [ -z "$app_name" ]; then
    echo "Creating new Heroku app..."
    app_name=$(heroku create --json | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
    echo "✅ Created app: $app_name"
else
    echo "Using existing app: $app_name"
fi

# Check if app exists
if ! heroku apps:info --app $app_name &> /dev/null; then
    echo "❌ App '$app_name' does not exist or you don't have access to it."
    exit 1
fi

echo ""
echo "🔧 Setting up environment variables..."

# Set environment variables
heroku config:set NODE_ENV=production --app $app_name
heroku config:set JWT_SECRET=$(openssl rand -base64 32) --app $app_name

echo ""
echo "📧 Email Configuration"
echo "You'll need to set up Gmail for email notifications:"
echo "1. Enable 2-factor authentication on your Gmail account"
echo "2. Generate an App Password (Security → 2-Step Verification → App passwords)"
echo "3. Enter your Gmail details below:"

echo "Enter your Gmail address:"
read email_user

echo "Enter your Gmail App Password:"
read -s email_password

heroku config:set EMAIL_SERVICE=gmail --app $app_name
heroku config:set EMAIL_USER=$email_user --app $app_name
heroku config:set EMAIL_PASSWORD=$email_password --app $app_name

echo ""
echo "🗄️ Database Setup"
echo "You need to set up MongoDB Atlas:"
echo "1. Go to https://mongodb.com/atlas"
echo "2. Create a free account and cluster"
echo "3. Get your connection string"
echo "4. Enter it below (or press Enter to use Heroku's MongoDB addon):"

read mongodb_uri

if [ -z "$mongodb_uri" ]; then
    echo "Adding MongoDB addon to Heroku..."
    heroku addons:create mongolab:sandbox --app $app_name
    echo "✅ MongoDB addon added"
else
    heroku config:set MONGODB_URI="$mongodb_uri" --app $app_name
    echo "✅ MongoDB URI set"
fi

echo ""
echo "🚀 Deploying application..."

# Build the React app
echo "Building React app..."
cd client
npm run build
cd ..

# Add all files to git
git add .
git commit -m "Deploy to Heroku"

# Deploy to Heroku
echo "Pushing to Heroku..."
git push heroku main

# Run database setup
echo "Setting up database with sample data..."
heroku run node setup.js --app $app_name

echo ""
echo "🎉 Deployment Complete!"
echo "========================================"
echo "Your Wine Deals Agent is now live at:"
echo "🌐 https://$app_name.herokuapp.com"
echo ""
echo "Demo login credentials:"
echo "📧 Email: demo@winedeals.com"
echo "🔑 Password: demo123"
echo ""
echo "📱 The app is mobile-friendly and works on all devices!"
echo ""
echo "🔧 To view logs: heroku logs --tail --app $app_name"
echo "🔧 To open the app: heroku open --app $app_name"
echo ""
echo "Happy wine hunting! 🍷" 