const express = require('express');
const WineDeal = require('../models/WineDeal');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/deals
// @desc    Get wine deals (public endpoint with optional user filtering)
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      wineName, 
      shopName, 
      state, 
      minPrice, 
      maxPrice, 
      limit = 20, 
      page = 1,
      sortBy = 'dealScore',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { isActive: true };
    
    if (wineName) {
      query.wineName = { $regex: wineName, $options: 'i' };
    }
    
    if (shopName) {
      query.shopName = { $regex: shopName, $options: 'i' };
    }
    
    if (state) {
      query['shopLocation.state'] = state.toUpperCase();
    }
    
    if (minPrice || maxPrice) {
      query.$and = [];
      if (minPrice) {
        query.$and.push({ 
          $or: [
            { discountedPrice: { $gte: parseFloat(minPrice) } },
            { originalPrice: { $gte: parseFloat(minPrice) } }
          ]
        });
      }
      if (maxPrice) {
        query.$and.push({ 
          $or: [
            { discountedPrice: { $lte: parseFloat(maxPrice) } },
            { originalPrice: { $lte: parseFloat(maxPrice) } }
          ]
        });
      }
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const deals = await WineDeal.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await WineDeal.countDocuments(query);

    res.json({
      deals,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        hasNext: skip + deals.length < total,
        hasPrev: parseInt(page) > 1
      },
      total
    });
  } catch (error) {
    console.error('Get deals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/deals/user
// @desc    Get personalized deals for logged-in user
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const user = req.user;
    const { limit = 10 } = req.query;

    if (!user.winePreferences || user.winePreferences.length === 0) {
      return res.json({
        deals: [],
        message: 'No wine preferences found. Add some wines to your list!'
      });
    }

    // Get wine names from user preferences
    const wineNames = user.winePreferences.map(pref => pref.wineName);
    
    // Build query for user's preferred wines
    const query = {
      isActive: true,
      wineName: { $in: wineNames.map(name => new RegExp(name, 'i')) }
    };

    // Get top deals for each wine preference
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
        .limit(parseInt(limit));

      personalizedDeals.push({
        wineName: preference.wineName,
        deals: deals
      });
    }

    res.json({
      personalizedDeals,
      totalWines: user.winePreferences.length
    });
  } catch (error) {
    console.error('Get user deals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/deals/:id
// @desc    Get a specific wine deal
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const deal = await WineDeal.findById(req.params.id);
    
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    res.json({ deal });
  } catch (error) {
    console.error('Get deal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/deals/shops
// @desc    Get list of wine shops
// @access  Public
router.get('/shops/list', async (req, res) => {
  try {
    const shops = await WineDeal.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: {
            name: '$shopName',
            website: '$shopWebsite',
            state: '$shopLocation.state',
            city: '$shopLocation.city'
          },
          dealCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          name: '$_id.name',
          website: '$_id.website',
          state: '$_id.state',
          city: '$_id.city',
          dealCount: 1
        }
      },
      { $sort: { name: 1 } }
    ]);

    res.json({ shops });
  } catch (error) {
    console.error('Get shops error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/deals/stats
// @desc    Get deal statistics
// @access  Public
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await WineDeal.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalDeals: { $sum: 1 },
          avgOriginalPrice: { $avg: '$originalPrice' },
          avgDiscountedPrice: { $avg: '$discountedPrice' },
          totalShops: { $addToSet: '$shopName' },
          dealsByState: {
            $push: '$shopLocation.state'
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalDeals: 1,
          avgOriginalPrice: { $round: ['$avgOriginalPrice', 2] },
          avgDiscountedPrice: { $round: ['$avgDiscountedPrice', 2] },
          totalShops: { $size: '$totalShops' },
          dealsByState: {
            NY: {
              $size: {
                $filter: {
                  input: '$dealsByState',
                  cond: { $eq: ['$$this', 'NY'] }
                }
              }
            },
            NJ: {
              $size: {
                $filter: {
                  input: '$dealsByState',
                  cond: { $eq: ['$$this', 'NJ'] }
                }
              }
            }
          }
        }
      }
    ]);

    res.json({ stats: stats[0] || {} });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 