# 🍷 Wine Deals Agent

A comprehensive wine deals search agent that helps users find the best wine deals from shops in New York and New Jersey. The application provides personalized wine recommendations, daily email updates, and an intuitive web interface.

## ✨ Features

### 🎯 Core Features
- **User Authentication**: Secure registration and login with email/password
- **Wine Preferences Management**: Add, edit, and remove wines from your personalized list
- **Daily Deal Updates**: Automated scraping of wine deals from NY/NJ shops
- **Email Notifications**: Daily emails at 8 AM with top 10 deals for each wine
- **Responsive Web Interface**: Modern, mobile-friendly React frontend
- **Real-time Deal Tracking**: Monitor price changes and new deals

### 📧 Email Features
- **Personalized Content**: Tailored deals based on your wine preferences
- **Table Format**: Organized display with wine name, prices, shop info, and location
- **Discount Highlighting**: Clear display of original vs. discounted prices
- **Shop Information**: Direct links to wine shop websites
- **Customizable Timing**: Set your preferred notification time

### 🔍 Search & Discovery
- **Wine Search**: Find and add wines to your preferences
- **Deal Filtering**: Filter by price range, region, varietal
- **Shop Locations**: Focus on NY and NJ wine shops
- **Deal Scoring**: Intelligent ranking based on discount percentage and recency

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Gmail account (for email notifications)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wine-deals-agent
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/wine-deals
   JWT_SECRET=your-super-secret-jwt-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   ```

5. **Start the development servers**
   ```bash
   # Start backend (from root directory)
   npm run dev
   
   # Start frontend (in another terminal, from root directory)
   npm run client
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
wine-deals-agent/
├── client/                 # React frontend
│   ├── public/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   └── ...
│   └── package.json
├── models/                # MongoDB models
├── routes/                # API routes
├── services/              # Business logic
├── middleware/            # Express middleware
├── server.js             # Main server file
└── package.json
```

## 🔧 Configuration

### Email Setup (Gmail)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in your `.env` file

### MongoDB Setup
- **Local**: Install MongoDB locally or use Docker
- **Cloud**: Use MongoDB Atlas (free tier available)

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Wine Preferences
- `GET /api/wines/preferences` - Get user's wine list
- `POST /api/wines/preferences` - Add wine to preferences
- `PUT /api/wines/preferences/:id` - Update wine preference
- `DELETE /api/wines/preferences/:id` - Remove wine from preferences

### Deals
- `GET /api/deals` - Get all deals (with filters)
- `GET /api/deals/user` - Get personalized deals
- `GET /api/deals/:id` - Get specific deal

### Email Management
- `POST /api/emails/test` - Send test email
- `POST /api/emails/send-now` - Manually trigger daily email
- `GET /api/emails/settings` - Get email settings
- `PUT /api/emails/settings` - Update email settings

## 🤖 Automated Features

### Daily Scraping (7:30 AM EST)
- Scrapes wine deals from configured NY/NJ shops
- Updates deal scores based on discounts and recency
- Stores new deals in MongoDB

### Daily Email Sending (8:00 AM EST)
- Sends personalized emails to all active users
- Includes top 10 deals for each wine preference
- Formatted in HTML table with shop information

### Cleanup (2:00 AM EST)
- Deactivates deals older than 30 days
- Maintains database performance

## 🛠️ Development

### Running Tests
```bash
# Backend tests
npm test

# Frontend tests
cd client
npm test
```

### Building for Production
```bash
# Build frontend
cd client
npm run build

# Start production server
npm start
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Express-validator middleware
- **Rate Limiting**: API request throttling
- **CORS Protection**: Configured for production
- **Helmet Security**: HTTP headers protection

## 📱 User Interface

### Pages
- **Home**: Landing page with feature overview
- **Login/Register**: Authentication forms
- **Dashboard**: User overview and quick actions
- **Wine Preferences**: Manage wine list
- **Deals**: Browse and filter wine deals
- **Profile**: User account management
- **Email Settings**: Notification preferences

### Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface
- **Real-time Updates**: Live data without page refresh
- **Toast Notifications**: User feedback for actions
- **Loading States**: Smooth user experience

## 🚀 Deployment

### Heroku Deployment
1. Create Heroku app
2. Set environment variables
3. Deploy with Git:
   ```bash
   heroku create your-app-name
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-jwt-secret
   git push heroku main
   ```

### Docker Deployment
```bash
# Build image
docker build -t wine-deals-agent .

# Run container
docker run -p 5000:5000 wine-deals-agent
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔮 Future Enhancements

- **Wine Database Integration**: Connect to external wine APIs
- **Price History Tracking**: Monitor price trends over time
- **Social Features**: Share deals with friends
- **Mobile App**: Native iOS/Android applications
- **Advanced Analytics**: User behavior and deal performance
- **Wine Reviews**: User ratings and reviews
- **Inventory Alerts**: Low stock notifications 