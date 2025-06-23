const mongoose = require('mongoose');

const wineDealSchema = new mongoose.Schema({
  wineName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  originalPrice: {
    type: Number,
    required: true
  },
  discountedPrice: {
    type: Number
  },
  discountPercentage: {
    type: Number
  },
  shopName: {
    type: String,
    required: true,
    trim: true
  },
  shopWebsite: {
    type: String,
    required: true,
    trim: true
  },
  shopLocation: {
    address: String,
    city: String,
    state: {
      type: String,
      enum: ['NY', 'NJ'],
      required: true
    },
    zipCode: String
  },
  wineDetails: {
    varietal: String,
    region: String,
    vintage: String,
    producer: String,
    description: String
  },
  dealType: {
    type: String,
    enum: ['discount', 'clearance', 'special', 'new_arrival'],
    default: 'discount'
  },
  dealValidUntil: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  scrapedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  dealScore: {
    type: Number,
    default: 0
  }
});

// Index for efficient querying
wineDealSchema.index({ wineName: 1, shopName: 1, scrapedAt: -1 });
wineDealSchema.index({ isActive: 1, dealScore: -1 });
wineDealSchema.index({ 'shopLocation.state': 1 });

// Method to calculate deal score
wineDealSchema.methods.calculateDealScore = function() {
  let score = 0;
  
  if (this.discountedPrice && this.originalPrice) {
    const discount = ((this.originalPrice - this.discountedPrice) / this.originalPrice) * 100;
    score += discount * 10; // Higher discount = higher score
  }
  
  // Bonus for recent deals
  const daysSinceScraped = (Date.now() - this.scrapedAt) / (1000 * 60 * 60 * 24);
  if (daysSinceScraped <= 1) {
    score += 50; // Fresh deals get bonus
  } else if (daysSinceScraped <= 3) {
    score += 25;
  }
  
  this.dealScore = Math.round(score);
  return this.dealScore;
};

// Pre-save middleware to update deal score
wineDealSchema.pre('save', function(next) {
  this.calculateDealScore();
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model('WineDeal', wineDealSchema); 