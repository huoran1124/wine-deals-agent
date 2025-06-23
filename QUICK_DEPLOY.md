# 🚀 Quick Deployment Guide - Wine Deals Agent

## Option 1: Railway (Recommended - No CLI Required)

### Step 1: Prepare Your Code
✅ Your code is already prepared and ready for deployment!

### Step 2: Deploy to Railway

1. **Go to Railway**: Visit [railway.app](https://railway.app)
2. **Sign up/Login**: Create a free account or login
3. **Create New Project**: Click "New Project"
4. **Deploy from GitHub**: 
   - Choose "Deploy from GitHub repo"
   - Select your repository (or upload the code)
5. **Configure Environment Variables**:
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-change-this
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   ```

### Step 3: Set Up Database
1. **Add MongoDB**: In Railway dashboard, click "New" → "Database" → "MongoDB"
2. **Get Connection String**: Copy the MongoDB connection string
3. **Add Environment Variable**: Add `MONGODB_URI=your-mongodb-connection-string`

### Step 4: Initialize Database
1. **Open Railway Shell**: In your project dashboard, click "Variables" → "Shell"
2. **Run Setup**: Execute: `node setup.js`

### Step 5: Your App is Live!
Your app will be available at: `https://your-app-name.railway.app`

---

## Option 2: Render (Alternative)

### Step 1: Go to Render
1. Visit [render.com](https://render.com)
2. Sign up/Login with GitHub

### Step 2: Create Web Service
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: wine-deals-agent
   - **Environment**: Node
   - **Build Command**: `npm install && cd client && npm install && npm run build && cd ..`
   - **Start Command**: `npm start`

### Step 3: Set Environment Variables
Add these in the Render dashboard:
```
NODE_ENV=production
JWT_SECRET=your-secret-key
MONGODB_URI=your-mongodb-connection-string
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

### Step 4: Deploy
Click "Create Web Service" - Render will automatically deploy!

---

## Option 3: Vercel (Frontend) + Railway (Backend)

### Backend (Railway):
Follow Option 1 above for the backend API.

### Frontend (Vercel):
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set build command: `cd client && npm install && npm run build`
4. Set output directory: `client/build`
5. Add environment variable: `REACT_APP_API_URL=https://your-backend-url.railway.app/api`

---

## 🗄️ Database Setup (MongoDB Atlas)

### Free MongoDB Setup:
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free account
3. Create cluster (free tier)
4. Set up database access (create user)
5. Set up network access (allow all IPs: 0.0.0.0/0)
6. Get connection string and use it as `MONGODB_URI`

---

## 📧 Email Setup (Gmail)

### Gmail Configuration:
1. Enable 2-factor authentication on your Gmail
2. Generate App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
3. Use the generated password as `EMAIL_PASSWORD`

---

## 🎉 After Deployment

### Your App Will Be Available At:
- **Railway**: `https://your-app-name.railway.app`
- **Render**: `https://your-app-name.onrender.com`
- **Vercel**: `https://your-app-name.vercel.app`

### Demo Login:
- **Email**: `demo@winedeals.com`
- **Password**: `demo123`

### Features Available:
✅ User registration and login  
✅ Wine preference management  
✅ Daily deal browsing  
✅ Email notifications  
✅ Mobile-responsive design  
✅ Secure API endpoints  

---

## 🔧 Troubleshooting

### Common Issues:
1. **Build Fails**: Check that all dependencies are in package.json
2. **Database Connection**: Verify MongoDB URI is correct
3. **Email Not Working**: Check Gmail app password
4. **CORS Errors**: Verify environment variables are set correctly

### Get Help:
- Check the logs in your deployment platform dashboard
- Verify all environment variables are set
- Test the health endpoint: `/api/health`

---

## 📱 Mobile Access

Your web app is fully responsive and works on:
- Desktop browsers
- Mobile browsers
- Tablets
- Can be added to home screen (PWA)

---

## 💰 Cost

All platforms mentioned offer free tiers:
- **Railway**: Free tier available
- **Render**: Free tier available  
- **Vercel**: Free tier available
- **MongoDB Atlas**: Free tier available

---

## 🎯 Next Steps

1. Choose your preferred deployment platform
2. Follow the steps above
3. Set up your database and email
4. Share your web link with users!

Your Wine Deals Agent will be live on the web in minutes! 🍷 