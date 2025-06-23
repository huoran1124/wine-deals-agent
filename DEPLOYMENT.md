# 🚀 Deployment Guide for Wine Deals Agent

This guide provides step-by-step instructions to deploy your Wine Deals Agent as a web application.

## 🌐 Deployment Options

### Option 1: Heroku (Recommended - Free Tier Available)

**Step 1: Prepare for Heroku**
```bash
# Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create a new Heroku app
heroku create your-wine-deals-app

# Add MongoDB addon (MongoDB Atlas)
heroku addons:create mongolab:sandbox
```

**Step 2: Set Environment Variables**
```bash
# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-super-secret-jwt-key-change-this
heroku config:set EMAIL_SERVICE=gmail
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASSWORD=your-gmail-app-password
```

**Step 3: Deploy**
```bash
# Add all files to git
git add .
git commit -m "Initial deployment"

# Deploy to Heroku
git push heroku main

# Open the app
heroku open
```

**Your app will be available at:** `https://your-wine-deals-app.herokuapp.com`

---

### Option 2: Railway (Alternative - Free Tier Available)

**Step 1: Prepare for Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize Railway project
railway init
```

**Step 2: Set Environment Variables**
```bash
# Set environment variables in Railway dashboard or CLI
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your-super-secret-jwt-key
railway variables set MONGODB_URI=your-mongodb-connection-string
railway variables set EMAIL_SERVICE=gmail
railway variables set EMAIL_USER=your-email@gmail.com
railway variables set EMAIL_PASSWORD=your-gmail-app-password
```

**Step 3: Deploy**
```bash
# Deploy to Railway
railway up

# Open the app
railway open
```

---

### Option 3: Render (Alternative - Free Tier Available)

**Step 1: Connect to Render**
1. Go to [render.com](https://render.com)
2. Connect your GitHub repository
3. Create a new Web Service

**Step 2: Configure the Service**
- **Name:** wine-deals-agent
- **Environment:** Node
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

**Step 3: Set Environment Variables**
In the Render dashboard, add these environment variables:
```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key
MONGODB_URI=your-mongodb-connection-string
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

**Step 4: Deploy**
- Render will automatically deploy when you push to your main branch

---

### Option 4: Vercel (Frontend) + Railway/Render (Backend)

**For Backend:**
Follow Option 2 or 3 above for the backend API.

**For Frontend:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd client
vercel

# Set environment variable for API URL
vercel env add REACT_APP_API_URL https://your-backend-url.com/api
```

---

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create a free account

2. **Create a Cluster**
   - Choose the free tier (M0)
   - Select your preferred region

3. **Set Up Database Access**
   - Create a database user with read/write permissions
   - Note down username and password

4. **Set Up Network Access**
   - Add your IP address or `0.0.0.0/0` for all IPs

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

6. **Set Environment Variable**
   ```bash
   # For Heroku
   heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/wine-deals?retryWrites=true&w=majority"
   
   # For Railway
   railway variables set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/wine-deals?retryWrites=true&w=majority"
   ```

---

## 📧 Email Setup (Gmail)

1. **Enable 2-Factor Authentication**
   - Go to your Google Account settings
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
   - Copy the generated password

3. **Set Environment Variables**
   ```bash
   heroku config:set EMAIL_USER=your-email@gmail.com
   heroku config:set EMAIL_PASSWORD=your-app-password
   ```

---

## 🔧 Post-Deployment Setup

1. **Initialize Database**
   ```bash
   # Run the setup script to create sample data
   heroku run node setup.js
   ```

2. **Test the Application**
   - Visit your deployed URL
   - Register a new account or use demo credentials:
     - Email: `demo@winedeals.com`
     - Password: `demo123`

3. **Verify Features**
   - Test user registration/login
   - Add wine preferences
   - Check email notifications
   - Verify daily scraping (runs at 7:30 AM EST)

---

## 🌍 Your Web Application URLs

After deployment, your application will be available at:

### Heroku:
- **Main App:** `https://your-wine-deals-app.herokuapp.com`
- **API Endpoint:** `https://your-wine-deals-app.herokuapp.com/api`

### Railway:
- **Main App:** `https://your-app-name.railway.app`
- **API Endpoint:** `https://your-app-name.railway.app/api`

### Render:
- **Main App:** `https://your-app-name.onrender.com`
- **API Endpoint:** `https://your-app-name.onrender.com/api`

---

## 🔍 Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check that all dependencies are in `package.json`
   - Verify Node.js version compatibility

2. **Database Connection Issues**
   - Verify MongoDB URI is correct
   - Check network access settings in MongoDB Atlas

3. **Email Not Working**
   - Verify Gmail app password is correct
   - Check that 2FA is enabled

4. **CORS Errors**
   - Verify CORS configuration in `server.js`
   - Check that frontend URL is correct

### Logs:
```bash
# Heroku logs
heroku logs --tail

# Railway logs
railway logs

# Render logs
# Available in the Render dashboard
```

---

## 📱 Mobile Access

Your web application is fully responsive and works on:
- Desktop browsers
- Mobile browsers
- Tablets
- Progressive Web App (PWA) features

Users can add the app to their home screen for a native app-like experience.

---

## 🔄 Continuous Deployment

Set up automatic deployments:
1. Connect your GitHub repository to your deployment platform
2. Configure automatic deployments on push to main branch
3. Your app will update automatically when you push changes

---

## 💰 Cost Considerations

### Free Tiers Available:
- **Heroku:** Free tier available (with limitations)
- **Railway:** Free tier available
- **Render:** Free tier available
- **MongoDB Atlas:** Free tier available
- **Gmail:** Free for personal use

### Paid Upgrades:
Consider upgrading when you need:
- More database storage
- Higher request limits
- Custom domains
- SSL certificates
- Better performance

---

## 🎉 Success!

Once deployed, your Wine Deals Agent will be accessible worldwide as a web application with:
- ✅ User authentication
- ✅ Wine preference management
- ✅ Daily deal updates
- ✅ Email notifications
- ✅ Mobile-responsive design
- ✅ Secure API endpoints

Share your web link with users and start helping them find amazing wine deals! 