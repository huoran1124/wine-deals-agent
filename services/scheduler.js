const cron = require('node-cron');
const User = require('../models/User');
const WineDeal = require('../models/WineDeal');
const { sendDailyDealsEmail } = require('./emailService');
const { scrapeWineDeals } = require('./scraperService');

// Schedule daily wine scraping and email sending
const startScheduler = () => {
  console.log('Starting scheduler...');

  // Schedule daily wine scraping at 7:30 AM
  cron.schedule('30 7 * * *', async () => {
    console.log('Starting daily wine scraping...');
    try {
      await scrapeWineDeals();
      console.log('Daily wine scraping completed successfully');
    } catch (error) {
      console.error('Daily wine scraping failed:', error);
    }
  }, {
    timezone: 'America/New_York'
  });

  // Schedule daily email sending at 8:00 AM
  cron.schedule('0 8 * * *', async () => {
    console.log('Starting daily email sending...');
    try {
      await sendDailyEmails();
      console.log('Daily email sending completed successfully');
    } catch (error) {
      console.error('Daily email sending failed:', error);
    }
  }, {
    timezone: 'America/New_York'
  });

  // Schedule cleanup of old deals (older than 30 days) at 2:00 AM
  cron.schedule('0 2 * * *', async () => {
    console.log('Starting cleanup of old deals...');
    try {
      await cleanupOldDeals();
      console.log('Cleanup completed successfully');
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }, {
    timezone: 'America/New_York'
  });

  console.log('Scheduler started successfully');
};

// Send daily emails to all users with email notifications enabled
const sendDailyEmails = async () => {
  try {
    // Get all active users with email notifications enabled
    const users = await User.find({
      isActive: true,
      emailNotifications: true
    });

    console.log(`Found ${users.length} users to send emails to`);

    for (const user of users) {
      try {
        // Get personalized deals for this user
        const personalizedDeals = await getPersonalizedDeals(user);
        
        // Send email
        await sendDailyDealsEmail(user, personalizedDeals, false);
        
        console.log(`Email sent successfully to ${user.email}`);
        
        // Add a small delay to avoid overwhelming the email service
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Failed to send email to ${user.email}:`, error);
        // Continue with other users even if one fails
      }
    }
  } catch (error) {
    console.error('Error in sendDailyEmails:', error);
    throw error;
  }
};

// Get personalized deals for a specific user
const getPersonalizedDeals = async (user) => {
  try {
    if (!user.winePreferences || user.winePreferences.length === 0) {
      return [];
    }

    const wineNames = user.winePreferences.map(pref => pref.wineName);
    const query = {
      isActive: true,
      wineName: { $in: wineNames.map(name => new RegExp(name, 'i')) }
    };

    const personalizedDeals = [];
    
    for (const preference of user.winePreferences) {
      const wineQuery = {
        ...query,
        wineName: new RegExp(preference.wineName, 'i')
      };

      // Add price range filter if specified
      if (preference.priceRange) {
        if (preference.priceRange.min || preference.priceRange.max) {
          wineQuery.$and = [];
          if (preference.priceRange.min) {
            wineQuery.$and.push({
              $or: [
                { discountedPrice: { $gte: preference.priceRange.min } },
                { originalPrice: { $gte: preference.priceRange.min } }
              ]
            });
          }
          if (preference.priceRange.max) {
            wineQuery.$and.push({
              $or: [
                { discountedPrice: { $lte: preference.priceRange.max } },
                { originalPrice: { $lte: preference.priceRange.max } }
              ]
            });
          }
        }
      }

      const deals = await WineDeal.find(wineQuery)
        .sort({ dealScore: -1 })
        .limit(10);

      if (deals.length > 0) {
        personalizedDeals.push({
          wineName: preference.wineName,
          deals: deals
        });
      }
    }

    return personalizedDeals;
  } catch (error) {
    console.error('Error getting personalized deals:', error);
    return [];
  }
};

// Clean up old deals (older than 30 days)
const cleanupOldDeals = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await WineDeal.updateMany(
      { 
        scrapedAt: { $lt: thirtyDaysAgo },
        isActive: true 
      },
      { 
        isActive: false 
      }
    );

    console.log(`Deactivated ${result.modifiedCount} old deals`);
  } catch (error) {
    console.error('Error cleaning up old deals:', error);
    throw error;
  }
};

// Manual trigger functions for testing
const triggerDailyScraping = async () => {
  console.log('Manually triggering daily scraping...');
  try {
    await scrapeWineDeals();
    console.log('Manual scraping completed successfully');
  } catch (error) {
    console.error('Manual scraping failed:', error);
  }
};

const triggerDailyEmails = async () => {
  console.log('Manually triggering daily emails...');
  try {
    await sendDailyEmails();
    console.log('Manual email sending completed successfully');
  } catch (error) {
    console.error('Manual email sending failed:', error);
  }
};

module.exports = {
  startScheduler,
  sendDailyEmails,
  getPersonalizedDeals,
  cleanupOldDeals,
  triggerDailyScraping,
  triggerDailyEmails
}; 