const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Generate HTML table for wine deals
const generateDealsTable = (personalizedDeals) => {
  if (!personalizedDeals || personalizedDeals.length === 0) {
    return `
      <div style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #6c757d; font-style: italic;">
          No deals found for your wine preferences today. Check back tomorrow!
        </p>
      </div>
    `;
  }

  let html = '';
  
  personalizedDeals.forEach((wineGroup, index) => {
    html += `
      <div style="margin: 30px 0;">
        <h3 style="color: #2c3e50; border-bottom: 2px solid #e74c3c; padding-bottom: 10px;">
          🍷 ${wineGroup.wineName}
        </h3>
    `;

    if (wineGroup.deals && wineGroup.deals.length > 0) {
      html += `
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <thead>
            <tr style="background-color: #e74c3c; color: white;">
              <th style="padding: 12px; text-align: left; border: none;">Wine Name</th>
              <th style="padding: 12px; text-align: center; border: none;">Original Price</th>
              <th style="padding: 12px; text-align: center; border: none;">Discounted Price</th>
              <th style="padding: 12px; text-align: center; border: none;">Shop</th>
              <th style="padding: 12px; text-align: center; border: none;">Location</th>
            </tr>
          </thead>
          <tbody>
      `;

      wineGroup.deals.forEach((deal, dealIndex) => {
        const isDiscounted = deal.discountedPrice && deal.discountedPrice < deal.originalPrice;
        const discountClass = isDiscounted ? 'background-color: #d4edda;' : '';
        
        html += `
          <tr style="${discountClass}">
            <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">
              <strong>${deal.wineName}</strong>
              ${deal.wineDetails?.vintage ? `<br><small style="color: #6c757d;">${deal.wineDetails.vintage}</small>` : ''}
            </td>
            <td style="padding: 12px; text-align: center; border-bottom: 1px solid #dee2e6;">
              $${deal.originalPrice?.toFixed(2) || 'N/A'}
            </td>
            <td style="padding: 12px; text-align: center; border-bottom: 1px solid #dee2e6;">
              ${isDiscounted ? 
                `<span style="color: #28a745; font-weight: bold;">$${deal.discountedPrice.toFixed(2)}</span>
                 <br><small style="color: #dc3545;">(${deal.discountPercentage?.toFixed(0) || Math.round(((deal.originalPrice - deal.discountedPrice) / deal.originalPrice) * 100)}% off)</small>` 
                : 'N/A'
              }
            </td>
            <td style="padding: 12px; text-align: center; border-bottom: 1px solid #dee2e6;">
              <a href="${deal.shopWebsite}" target="_blank" style="color: #007bff; text-decoration: none;">
                ${deal.shopName}
              </a>
            </td>
            <td style="padding: 12px; text-align: center; border-bottom: 1px solid #dee2e6;">
              ${deal.shopLocation?.city || ''}, ${deal.shopLocation?.state || ''}
            </td>
          </tr>
        `;
      });

      html += `
          </tbody>
        </table>
      `;
    } else {
      html += `
        <div style="padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
          <p style="margin: 0; color: #6c757d; font-style: italic;">
            No deals found for ${wineGroup.wineName} today.
          </p>
        </div>
      `;
    }

    html += `</div>`;
  });

  return html;
};

// Send daily deals email
const sendDailyDealsEmail = async (user, personalizedDeals, isTest = false) => {
  try {
    const transporter = createTransporter();
    
    const subject = isTest 
      ? '🍷 Wine Deals Agent - Test Email'
      : '🍷 Your Daily Wine Deals - ' + new Date().toLocaleDateString();

    const dealsTable = generateDealsTable(personalizedDeals);
    
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Wine Deals Daily</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
        <div style="background-color: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #e74c3c; margin: 0; font-size: 28px;">
              🍷 Wine Deals Agent
            </h1>
            <p style="color: #6c757d; margin: 10px 0 0 0;">
              ${isTest ? 'Test Email' : 'Your personalized wine deals for today'}
            </p>
          </div>

          <div style="background-color: #f8f9fa; border-left: 4px solid #e74c3c; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
            <p style="margin: 0; color: #495057;">
              <strong>Hello ${user.firstName}!</strong><br>
              ${isTest 
                ? 'This is a test email to verify your notification settings.'
                : `Here are the top wine deals from NY and NJ shops for your preferred wines.`
              }
            </p>
          </div>

          ${dealsTable}

          <div style="margin-top: 40px; padding: 20px; background-color: #f8f9fa; border-radius: 8px; text-align: center;">
            <p style="margin: 0 0 15px 0; color: #6c757d;">
              Want to change your wine preferences or notification settings?
            </p>
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard" 
               style="background-color: #e74c3c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Manage Preferences
            </a>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center; color: #6c757d; font-size: 14px;">
            <p style="margin: 0;">
              This email was sent by Wine Deals Agent<br>
              You can unsubscribe or change your preferences in your account settings
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: subject,
      html: emailContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${user.email}:`, result.messageId);
    
    return result;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
  try {
    const transporter = createTransporter();
    
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Wine Deals Agent</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
        <div style="background-color: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #e74c3c; margin: 0; font-size: 28px;">
              🍷 Welcome to Wine Deals Agent!
            </h1>
          </div>

          <div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
            <p style="margin: 0; color: #155724;">
              <strong>Welcome ${user.firstName}!</strong><br>
              Your account has been successfully created.
            </p>
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #2c3e50;">What's Next?</h3>
            <ol style="color: #495057;">
              <li>Add your favorite wines to your preferences list</li>
              <li>Set your notification preferences</li>
              <li>Start receiving daily wine deals from NY and NJ shops</li>
            </ol>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard" 
               style="background-color: #e74c3c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Get Started
            </a>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center; color: #6c757d; font-size: 14px;">
            <p style="margin: 0;">
              Thank you for choosing Wine Deals Agent!<br>
              We'll help you find the best wine deals in NY and NJ.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: '🍷 Welcome to Wine Deals Agent!',
      html: emailContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${user.email}:`, result.messageId);
    
    return result;
  } catch (error) {
    console.error('Welcome email sending error:', error);
    throw error;
  }
};

module.exports = {
  sendDailyDealsEmail,
  sendWelcomeEmail
}; 