const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const { sendDailyDealsEmail } = require('../services/emailService');

const router = express.Router();

// @route   POST /api/emails/test
// @desc    Send a test email to the user
// @access  Private
router.post('/test', auth, async (req, res) => {
  try {
    const user = req.user;
    
    if (!user.emailNotifications) {
      return res.status(400).json({ 
        message: 'Email notifications are disabled for your account' 
      });
    }

    // Send test email
    await sendDailyDealsEmail(user, [], true);

    res.json({ message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Send test email error:', error);
    res.status(500).json({ message: 'Failed to send test email' });
  }
});

// @route   POST /api/emails/send-now
// @desc    Manually trigger daily deals email
// @access  Private
router.post('/send-now', auth, async (req, res) => {
  try {
    const user = req.user;
    
    if (!user.emailNotifications) {
      return res.status(400).json({ 
        message: 'Email notifications are disabled for your account' 
      });
    }

    // Get user's personalized deals
    const WineDeal = require('../models/WineDeal');
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

    // Send email with deals
    await sendDailyDealsEmail(user, personalizedDeals, false);

    res.json({ 
      message: 'Daily deals email sent successfully',
      dealsCount: personalizedDeals.length
    });
  } catch (error) {
    console.error('Send daily deals email error:', error);
    res.status(500).json({ message: 'Failed to send daily deals email' });
  }
});

// @route   GET /api/emails/settings
// @desc    Get user's email notification settings
// @access  Private
router.get('/settings', auth, async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      emailNotifications: user.emailNotifications,
      notificationTime: user.notificationTime,
      email: user.email
    });
  } catch (error) {
    console.error('Get email settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/emails/settings
// @desc    Update user's email notification settings
// @access  Private
router.put('/settings', auth, [
  body('emailNotifications').optional().isBoolean(),
  body('notificationTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { emailNotifications, notificationTime } = req.body;
    const user = req.user;

    if (emailNotifications !== undefined) {
      user.emailNotifications = emailNotifications;
    }
    
    if (notificationTime) {
      user.notificationTime = notificationTime;
    }

    await user.save();

    res.json({
      message: 'Email settings updated successfully',
      emailNotifications: user.emailNotifications,
      notificationTime: user.notificationTime
    });
  } catch (error) {
    console.error('Update email settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/emails/history
// @desc    Get email sending history (mock data for now)
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    // Mock email history - in a real app, you'd store this in a database
    const mockHistory = [
      {
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        type: 'daily_deals',
        status: 'sent',
        dealsCount: 5
      },
      {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'daily_deals',
        status: 'sent',
        dealsCount: 3
      }
    ];

    res.json({ history: mockHistory });
  } catch (error) {
    console.error('Get email history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 