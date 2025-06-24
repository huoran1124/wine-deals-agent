import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
  FaWineGlass, 
  FaBell, 
  FaSearch, 
  FaPlus, 
  FaEnvelope, 
  FaClock,
  FaMapMarkerAlt,
  FaPercent
} from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalWines: 0,
    totalDeals: 0,
    recentDeals: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's wine preferences
      const preferencesResponse = await axios.get('/api/wines/preferences');
      const winePreferences = preferencesResponse.data.winePreferences || [];
      
      // Fetch personalized deals
      const dealsResponse = await axios.get('/api/deals/user');
      const personalizedDeals = dealsResponse.data.personalizedDeals || [];
      
      // Calculate stats
      const totalDeals = personalizedDeals.reduce((sum, wineGroup) => sum + (wineGroup.deals?.length || 0), 0);
      const recentDeals = personalizedDeals
        .flatMap(wineGroup => wineGroup.deals || [])
        .sort((a, b) => new Date(b.scrapedAt) - new Date(a.scrapedAt))
        .slice(0, 5);

      setStats({
        totalWines: winePreferences.length,
        totalDeals,
        recentDeals
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set empty stats instead of showing error
      setStats({
        totalWines: 0,
        totalDeals: 0,
        recentDeals: []
      });
    } finally {
      setLoading(false);
    }
  };

  const sendTestEmail = async () => {
    try {
      await axios.post('/emails/test');
      toast.success('Test email sent successfully!');
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error('Failed to send test email');
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 200px)'
      }}>
        <div className="spinner" style={{ marginRight: '1rem' }}></div>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      {/* Welcome Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#2c3e50',
          marginBottom: '0.5rem'
        }}>
          Welcome back, {user?.firstName}! 🍷
        </h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          Here's what's happening with your wine deals today
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '2.5rem',
            color: '#e74c3c',
            marginBottom: '1rem'
          }}>
            <FaWineGlass />
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50' }}>
            {stats.totalWines}
          </h3>
          <p style={{ color: '#666' }}>Wines in Your List</p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '2.5rem',
            color: '#27ae60',
            marginBottom: '1rem'
          }}>
            <FaPercent />
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50' }}>
            {stats.totalDeals}
          </h3>
          <p style={{ color: '#666' }}>Available Deals</p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '2.5rem',
            color: '#3498db',
            marginBottom: '1rem'
          }}>
            <FaBell />
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50' }}>
            {user?.emailNotifications ? 'Active' : 'Inactive'}
          </h3>
          <p style={{ color: '#666' }}>Email Notifications</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">Quick Actions</h2>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <Link to="/wines" className="btn btn-primary" style={{ justifyContent: 'center' }}>
            <FaPlus />
            Add Wine
          </Link>
          <Link to="/deals" className="btn btn-outline" style={{ justifyContent: 'center' }}>
            <FaSearch />
            View All Deals
          </Link>
          <button onClick={sendTestEmail} className="btn btn-outline" style={{ justifyContent: 'center' }}>
            <FaEnvelope />
            Send Test Email
          </button>
          <Link to="/email-settings" className="btn btn-outline" style={{ justifyContent: 'center' }}>
            <FaBell />
            Email Settings
          </Link>
        </div>
      </div>

      {/* Recent Deals */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Deals</h2>
        </div>
        {stats.recentDeals.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Wine Name</th>
                  <th>Original Price</th>
                  <th>Discounted Price</th>
                  <th>Shop</th>
                  <th>Location</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentDeals.map((deal) => (
                  <tr key={deal._id}>
                    <td>
                      <strong>{deal.wineName}</strong>
                      {deal.wineDetails?.vintage && (
                        <>
                          <br />
                          <small style={{ color: '#666' }}>{deal.wineDetails.vintage}</small>
                        </>
                      )}
                    </td>
                    <td>${deal.originalPrice?.toFixed(2)}</td>
                    <td>
                      {deal.discountedPrice ? (
                        <>
                          <span style={{ color: '#27ae60', fontWeight: 'bold' }}>
                            ${deal.discountedPrice.toFixed(2)}
                          </span>
                          <br />
                          <small style={{ color: '#e74c3c' }}>
                            {deal.discountPercentage?.toFixed(0) || 
                             Math.round(((deal.originalPrice - deal.discountedPrice) / deal.originalPrice) * 100)}% off
                          </small>
                        </>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td>
                      <a 
                        href={deal.shopWebsite} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#3498db', textDecoration: 'none' }}
                      >
                        {deal.shopName}
                      </a>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <FaMapMarkerAlt style={{ color: '#666', fontSize: '0.8rem' }} />
                        {deal.shopLocation?.city}, {deal.shopLocation?.state}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <FaClock style={{ color: '#666', fontSize: '0.8rem' }} />
                        {new Date(deal.scrapedAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            <FaWineGlass style={{ fontSize: '3rem', color: '#e9ecef', marginBottom: '1rem' }} />
            <p>No deals found for your wine preferences.</p>
            <p>Add some wines to your list to start seeing deals!</p>
            <Link to="/wines" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Add Wines
            </Link>
          </div>
        )}
      </div>

      {/* Email Notification Info */}
      {user?.emailNotifications && (
        <div className="card" style={{ 
          marginTop: '2rem',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <FaBell style={{ color: '#155724', fontSize: '1.5rem' }} />
            <div>
              <h3 style={{ color: '#155724', margin: '0 0 0.25rem 0' }}>
                Daily Email Notifications Active
              </h3>
              <p style={{ color: '#155724', margin: 0 }}>
                You'll receive daily updates at {user.notificationTime || '8:00 AM'} with the best deals for your wines.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 