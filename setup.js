const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const WineDeal = require('./models/WineDeal');

// Sample data
const sampleUsers = [
  {
    email: 'demo@winedeals.com',
    password: 'demo123',
    firstName: 'Demo',
    lastName: 'User',
    winePreferences: [
      {
        wineName: 'Château Margaux',
        varietal: 'Bordeaux Blend',
        region: 'Bordeaux, France',
        priceRange: { min: 500, max: 1000 }
      },
      {
        wineName: 'Opus One',
        varietal: 'Bordeaux Blend',
        region: 'Napa Valley, California',
        priceRange: { min: 300, max: 600 }
      }
    ]
  }
];

const sampleDeals = [
  {
    wineName: 'Château Margaux 2015',
    originalPrice: 850,
    discountedPrice: 750,
    discountPercentage: 12,
    shopName: 'Wine Library',
    shopWebsite: 'https://winelibrary.com',
    shopLocation: {
      address: '586 Morris Ave',
      city: 'Springfield',
      state: 'NJ',
      zipCode: '07081'
    },
    wineDetails: {
      varietal: 'Bordeaux Blend',
      region: 'Bordeaux, France',
      vintage: '2015',
      producer: 'Château Margaux'
    },
    dealType: 'discount',
    isActive: true
  },
  {
    wineName: 'Opus One 2018',
    originalPrice: 450,
    discountedPrice: 380,
    discountPercentage: 16,
    shopName: 'Astor Wines & Spirits',
    shopWebsite: 'https://astorwines.com',
    shopLocation: {
      address: '399 Lafayette St',
      city: 'New York',
      state: 'NY',
      zipCode: '10003'
    },
    wineDetails: {
      varietal: 'Bordeaux Blend',
      region: 'Napa Valley, California',
      vintage: '2018',
      producer: 'Opus One'
    },
    dealType: 'discount',
    isActive: true
  },
  {
    wineName: 'Sassicaia 2019',
    originalPrice: 350,
    discountedPrice: 320,
    discountPercentage: 9,
    shopName: 'Sherry-Lehmann',
    shopWebsite: 'https://sherry-lehmann.com',
    shopLocation: {
      address: '505 Park Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10022'
    },
    wineDetails: {
      varietal: 'Cabernet Sauvignon',
      region: 'Tuscany, Italy',
      vintage: '2019',
      producer: 'Tenuta San Guido'
    },
    dealType: 'discount',
    isActive: true
  }
];

async function setupDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wine-deals', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await WineDeal.deleteMany({});

    // Create sample users
    console.log('Creating sample users...');
    for (const userData of sampleUsers) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      
      await user.save();
      console.log(`Created user: ${userData.email}`);
    }

    // Create sample deals
    console.log('Creating sample deals...');
    for (const dealData of sampleDeals) {
      const deal = new WineDeal(dealData);
      await deal.save();
      console.log(`Created deal: ${dealData.wineName}`);
    }

    console.log('\n✅ Setup completed successfully!');
    console.log('\nSample login credentials:');
    console.log('Email: demo@winedeals.com');
    console.log('Password: demo123');
    console.log('\nYou can now start the application with:');
    console.log('npm run dev');

  } catch (error) {
    console.error('❌ Setup failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase; 