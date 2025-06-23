const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/wines/preferences
// @desc    Get user's wine preferences
// @access  Private
router.get('/preferences', auth, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      winePreferences: user.winePreferences
    });
  } catch (error) {
    console.error('Get wine preferences error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/wines/preferences
// @desc    Add a wine to user's preferences
// @access  Private
router.post('/preferences', auth, [
  body('wineName').notEmpty().trim(),
  body('varietal').optional().trim(),
  body('region').optional().trim(),
  body('priceRange.min').optional().isNumeric(),
  body('priceRange.max').optional().isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { wineName, varietal, region, priceRange } = req.body;
    const user = req.user;

    // Check if wine already exists in preferences
    const existingWine = user.winePreferences.find(
      wine => wine.wineName.toLowerCase() === wineName.toLowerCase()
    );

    if (existingWine) {
      return res.status(400).json({ message: 'Wine already in your preferences' });
    }

    // Add new wine preference
    user.winePreferences.push({
      wineName,
      varietal,
      region,
      priceRange
    });

    await user.save();

    res.status(201).json({
      message: 'Wine added to preferences successfully',
      winePreferences: user.winePreferences
    });
  } catch (error) {
    console.error('Add wine preference error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/wines/preferences/:wineId
// @desc    Update a wine preference
// @access  Private
router.put('/preferences/:wineId', auth, [
  body('wineName').optional().notEmpty().trim(),
  body('varietal').optional().trim(),
  body('region').optional().trim(),
  body('priceRange.min').optional().isNumeric(),
  body('priceRange.max').optional().isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { wineId } = req.params;
    const { wineName, varietal, region, priceRange } = req.body;
    const user = req.user;

    // Find the wine preference
    const wineIndex = user.winePreferences.findIndex(
      wine => wine._id.toString() === wineId
    );

    if (wineIndex === -1) {
      return res.status(404).json({ message: 'Wine preference not found' });
    }

    // Update the wine preference
    if (wineName) user.winePreferences[wineIndex].wineName = wineName;
    if (varietal !== undefined) user.winePreferences[wineIndex].varietal = varietal;
    if (region !== undefined) user.winePreferences[wineIndex].region = region;
    if (priceRange) user.winePreferences[wineIndex].priceRange = priceRange;

    await user.save();

    res.json({
      message: 'Wine preference updated successfully',
      winePreferences: user.winePreferences
    });
  } catch (error) {
    console.error('Update wine preference error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/wines/preferences/:wineId
// @desc    Remove a wine from preferences
// @access  Private
router.delete('/preferences/:wineId', auth, async (req, res) => {
  try {
    const { wineId } = req.params;
    const user = req.user;

    // Find and remove the wine preference
    const wineIndex = user.winePreferences.findIndex(
      wine => wine._id.toString() === wineId
    );

    if (wineIndex === -1) {
      return res.status(404).json({ message: 'Wine preference not found' });
    }

    user.winePreferences.splice(wineIndex, 1);
    await user.save();

    res.json({
      message: 'Wine removed from preferences successfully',
      winePreferences: user.winePreferences
    });
  } catch (error) {
    console.error('Remove wine preference error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/wines/search
// @desc    Search for wines (public endpoint)
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { query, varietal, region, minPrice, maxPrice, state } = req.query;
    
    // This would typically search a wine database or API
    // For now, we'll return a mock response
    const mockWines = [
      {
        name: 'Château Margaux 2015',
        varietal: 'Bordeaux Blend',
        region: 'Bordeaux, France',
        price: 850
      },
      {
        name: 'Opus One 2018',
        varietal: 'Bordeaux Blend',
        region: 'Napa Valley, California',
        price: 450
      },
      {
        name: 'Sassicaia 2019',
        varietal: 'Cabernet Sauvignon',
        region: 'Tuscany, Italy',
        price: 350
      }
    ];

    res.json({
      wines: mockWines,
      total: mockWines.length
    });
  } catch (error) {
    console.error('Wine search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 