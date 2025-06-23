const axios = require('axios');
const cheerio = require('cheerio');
const WineDeal = require('../models/WineDeal');

// List of wine shops to scrape (NY and NJ)
const WINE_SHOPS = [
  {
    name: 'Wine Library',
    website: 'https://winelibrary.com',
    location: { state: 'NJ', city: 'Springfield' },
    selectors: {
      container: '.product-item',
      name: '.product-name',
      price: '.price',
      originalPrice: '.old-price',
      link: '.product-name a'
    }
  },
  {
    name: 'Astor Wines & Spirits',
    website: 'https://astorwines.com',
    location: { state: 'NY', city: 'New York' },
    selectors: {
      container: '.product',
      name: '.product-title',
      price: '.price-current',
      originalPrice: '.price-original',
      link: '.product-link'
    }
  },
  {
    name: 'Sherry-Lehmann',
    website: 'https://sherry-lehmann.com',
    location: { state: 'NY', city: 'New York' },
    selectors: {
      container: '.wine-item',
      name: '.wine-name',
      price: '.wine-price',
      originalPrice: '.wine-original-price',
      link: '.wine-link'
    }
  }
];

// Mock wine deals for demonstration (in production, this would be real scraping)
const MOCK_WINE_DEALS = [
  {
    wineName: 'Château Margaux 2015',
    originalPrice: 850,
    discountedPrice: 750,
    discountPercentage: 12,
    shopName: 'Wine Library',
    shopWebsite: 'https://winelibrary.com',
    shopLocation: { address: '586 Morris Ave', city: 'Springfield', state: 'NJ', zipCode: '07081' },
    wineDetails: { varietal: 'Bordeaux Blend', region: 'Bordeaux, France', vintage: '2015', producer: 'Château Margaux' },
    dealType: 'discount'
  },
  {
    wineName: 'Opus One 2018',
    originalPrice: 450,
    discountedPrice: 380,
    discountPercentage: 16,
    shopName: 'Astor Wines & Spirits',
    shopWebsite: 'https://astorwines.com',
    shopLocation: { address: '399 Lafayette St', city: 'New York', state: 'NY', zipCode: '10003' },
    wineDetails: { varietal: 'Bordeaux Blend', region: 'Napa Valley, California', vintage: '2018', producer: 'Opus One' },
    dealType: 'discount'
  },
  {
    wineName: 'Sassicaia 2019',
    originalPrice: 350,
    discountedPrice: 320,
    discountPercentage: 9,
    shopName: 'Sherry-Lehmann',
    shopWebsite: 'https://sherry-lehmann.com',
    shopLocation: { address: '505 Park Ave', city: 'New York', state: 'NY', zipCode: '10022' },
    wineDetails: { varietal: 'Cabernet Sauvignon', region: 'Tuscany, Italy', vintage: '2019', producer: 'Tenuta San Guido' },
    dealType: 'discount'
  },
  {
    wineName: 'Dom Pérignon 2012',
    originalPrice: 280,
    discountedPrice: 250,
    discountPercentage: 11,
    shopName: 'Wine Library',
    shopWebsite: 'https://winelibrary.com',
    shopLocation: { address: '586 Morris Ave', city: 'Springfield', state: 'NJ', zipCode: '07081' },
    wineDetails: { varietal: 'Champagne', region: 'Champagne, France', vintage: '2012', producer: 'Moët & Chandon' },
    dealType: 'discount'
  },
  {
    wineName: 'Caymus Cabernet Sauvignon 2020',
    originalPrice: 180,
    discountedPrice: 160,
    discountPercentage: 11,
    shopName: 'Astor Wines & Spirits',
    shopWebsite: 'https://astorwines.com',
    shopLocation: { address: '399 Lafayette St', city: 'New York', state: 'NY', zipCode: '10003' },
    wineDetails: { varietal: 'Cabernet Sauvignon', region: 'Napa Valley, California', vintage: '2020', producer: 'Caymus Vineyards' },
    dealType: 'discount'
  }
];

// Scrape wine deals from all configured shops
const scrapeWineDeals = async () => {
  console.log('Starting wine deals scraping...');
  
  try {
    const scrapedDeals = [];
    
    // For demonstration, we'll use mock data
    // In production, you would implement real scraping for each shop
    for (const shop of WINE_SHOPS) {
      try {
        console.log(`Scraping deals from ${shop.name}...`);
        
        // In production, this would be real scraping
        // const deals = await scrapeShop(shop);
        const deals = await scrapeShopMock(shop);
        
        scrapedDeals.push(...deals);
        console.log(`Found ${deals.length} deals from ${shop.name}`);
        
        // Add delay between shops to be respectful
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`Error scraping ${shop.name}:`, error);
        // Continue with other shops even if one fails
      }
    }
    
    // Save deals to database
    await saveDealsToDatabase(scrapedDeals);
    
    console.log(`Scraping completed. Total deals found: ${scrapedDeals.length}`);
    return scrapedDeals;
    
  } catch (error) {
    console.error('Error in scrapeWineDeals:', error);
    throw error;
  }
};

// Mock scraping function (replace with real scraping in production)
const scrapeShopMock = async (shop) => {
  // Simulate scraping delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock deals for this shop
  return MOCK_WINE_DEALS.filter(deal => deal.shopName === shop.name);
};

// Real scraping function (template for production)
const scrapeShop = async (shop) => {
  try {
    const response = await axios.get(shop.website, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    const deals = [];
    
    // Find wine products on the page
    $(shop.selectors.container).each((index, element) => {
      try {
        const $element = $(element);
        
        const wineName = $element.find(shop.selectors.name).text().trim();
        const priceText = $element.find(shop.selectors.price).text().trim();
        const originalPriceText = $element.find(shop.selectors.originalPrice).text().trim();
        const link = $element.find(shop.selectors.link).attr('href');
        
        if (wineName && priceText) {
          const originalPrice = parsePrice(originalPriceText || priceText);
          const discountedPrice = parsePrice(priceText);
          
          const deal = {
            wineName,
            originalPrice,
            discountedPrice: originalPriceText ? discountedPrice : null,
            discountPercentage: originalPriceText ? 
              Math.round(((originalPrice - discountedPrice) / originalPrice) * 100) : null,
            shopName: shop.name,
            shopWebsite: shop.website,
            shopLocation: shop.location,
            dealType: originalPriceText ? 'discount' : 'regular'
          };
          
          deals.push(deal);
        }
      } catch (error) {
        console.error('Error parsing wine element:', error);
      }
    });
    
    return deals;
    
  } catch (error) {
    console.error(`Error scraping ${shop.name}:`, error);
    return [];
  }
};

// Parse price from text
const parsePrice = (priceText) => {
  if (!priceText) return null;
  
  const match = priceText.match(/[\d,]+\.?\d*/);
  if (match) {
    return parseFloat(match[0].replace(/,/g, ''));
  }
  
  return null;
};

// Save deals to database
const saveDealsToDatabase = async (deals) => {
  try {
    console.log(`Saving ${deals.length} deals to database...`);
    
    for (const dealData of deals) {
      try {
        // Check if deal already exists (same wine, shop, and similar price)
        const existingDeal = await WineDeal.findOne({
          wineName: dealData.wineName,
          shopName: dealData.shopName,
          originalPrice: dealData.originalPrice,
          scrapedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Within last 24 hours
        });
        
        if (!existingDeal) {
          // Create new deal
          const newDeal = new WineDeal(dealData);
          await newDeal.save();
          console.log(`Saved new deal: ${dealData.wineName} at ${dealData.shopName}`);
        } else {
          // Update existing deal
          existingDeal.discountedPrice = dealData.discountedPrice;
          existingDeal.discountPercentage = dealData.discountPercentage;
          existingDeal.lastUpdated = Date.now();
          await existingDeal.save();
          console.log(`Updated existing deal: ${dealData.wineName} at ${dealData.shopName}`);
        }
        
      } catch (error) {
        console.error('Error saving deal:', error);
      }
    }
    
    console.log('Database save completed');
    
  } catch (error) {
    console.error('Error in saveDealsToDatabase:', error);
    throw error;
  }
};

// Get deals by wine name
const getDealsByWineName = async (wineName) => {
  try {
    const deals = await WineDeal.find({
      wineName: { $regex: wineName, $options: 'i' },
      isActive: true
    }).sort({ dealScore: -1 });
    
    return deals;
  } catch (error) {
    console.error('Error getting deals by wine name:', error);
    return [];
  }
};

// Get deals by shop
const getDealsByShop = async (shopName) => {
  try {
    const deals = await WineDeal.find({
      shopName: { $regex: shopName, $options: 'i' },
      isActive: true
    }).sort({ dealScore: -1 });
    
    return deals;
  } catch (error) {
    console.error('Error getting deals by shop:', error);
    return [];
  }
};

module.exports = {
  scrapeWineDeals,
  getDealsByWineName,
  getDealsByShop
}; 