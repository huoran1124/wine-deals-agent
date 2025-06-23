import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
  FaBell, 
  FaEnvelope, 
  FaClock, 
  FaHistory,
  FaCheck,
  FaTimes
} from 'react-icons/fa';

const EmailSettings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    notificationTime: '08:00'
  });
  const [emailHistory, setEmailHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);

  useEffect(() => {
    fetchEmailSettings();
    fetchEmailHistory();
  }, []);

  const fetchEmailSettings = async () => {
    try {
      const response = await axios.get('/emails/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching email settings:', error);
      toast.error('Failed to load email settings');
    }
  };

  const fetchEmailHistory = async () => {
    try {
      const response = await axios.get('/emails/history');
      setEmailHistory(response.data.history || []);
    } catch (error) {
      console.error('Error fetching email history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      await axios.put('/emails/settings', settings);
      toast.success('Email settings updated successfully!');
    } catch (error) {
      console.error('Error saving email settings:', error);
      toast.error('Failed to save email settings');
    } finally {
      setSaving(false);
    }
  };

  const sendTestEmail = async () => {
    try {
      setSendingTest(true);
      await axios.post('/emails/test');
      toast.success('Test email sent successfully! Check your inbox.');
    } catch (error) {
      console.error('Error sending test email:', error);
      const message = error.response?.data?.message || 'Failed to send test email';
      toast.error(message);
    } finally {
      setSendingTest(false);
    }
  };

  const sendDailyEmailNow = async () => {
    try {
      setSendingTest(true);
      const response = await axios.post('/emails/send-now');
      toast.success(`Daily deals email sent successfully! Found ${response.data.dealsCount} deals.`);
    } catch (error) {
      console.error('Error sending daily email:', error);
      const message = error.response?.data?.message || 'Failed to send daily email';
      toast.error(message);
    } finally {
      setSendingTest(false);
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
        Loading email settings...
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2c3e50', marginBottom: '2rem' }}>
        Email Settings
      </h1>

      {/* Email Settings */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">
            <FaBell style={{ marginRight: '0.5rem', color: '#e74c3c' }} />
            Notification Preferences
          </h2>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          <div>
            <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Daily Email Notifications</h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem'
              }}>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
                Receive daily wine deal emails
              </label>
            </div>

            {settings.emailNotifications && (
              <div className="form-group">
                <label className="form-label">
                  <FaClock style={{ marginRight: '0.5rem' }} />
                  Notification Time
                </label>
                <input
                  type="time"
                  className="form-control"
                  value={settings.notificationTime}
                  onChange={(e) => handleSettingChange('notificationTime', e.target.value)}
                  style={{ maxWidth: '200px' }}
                />
                <small style={{ color: '#666', display: 'block', marginTop: '0.25rem' }}>
                  You'll receive emails at this time every day (EST)
                </small>
              </div>
            )}
          </div>

          <div>
            <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Email Content</h3>
            <div style={{ color: '#666', lineHeight: '1.6' }}>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>What you'll receive:</strong>
              </p>
              <ul style={{ marginLeft: '1.5rem' }}>
                <li>Top 10 deals for each wine in your preferences</li>
                <li>Original and discounted prices</li>
                <li>Shop information and locations</li>
                <li>Direct links to purchase</li>
                <li>Deal scores and discount percentages</li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #e9ecef',
          paddingTop: '1.5rem',
          marginTop: '1.5rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? (
              <>
                <div className="spinner" style={{ marginRight: '0.5rem' }}></div>
                Saving...
              </>
            ) : (
              <>
                <FaCheck />
                Save Settings
              </>
            )}
          </button>

          <button
            onClick={sendTestEmail}
            disabled={sendingTest || !settings.emailNotifications}
            className="btn btn-outline"
          >
            {sendingTest ? (
              <>
                <div className="spinner" style={{ marginRight: '0.5rem' }}></div>
                Sending...
              </>
            ) : (
              <>
                <FaEnvelope />
                Send Test Email
              </>
            )}
          </button>

          <button
            onClick={sendDailyEmailNow}
            disabled={sendingTest || !settings.emailNotifications}
            className="btn btn-outline"
          >
            {sendingTest ? (
              <>
                <div className="spinner" style={{ marginRight: '0.5rem' }}></div>
                Sending...
              </>
            ) : (
              <>
                <FaBell />
                Send Daily Email Now
              </>
            )}
          </button>
        </div>
      </div>

      {/* Email History */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <FaHistory style={{ marginRight: '0.5rem', color: '#e74c3c' }} />
            Email History
          </h2>
        </div>
        
        {emailHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            <FaHistory style={{ fontSize: '3rem', color: '#e9ecef', marginBottom: '1rem' }} />
            <p>No email history available yet.</p>
            <p>Your email activity will appear here once you start receiving notifications.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Deals Count</th>
                </tr>
              </thead>
              <tbody>
                {emailHistory.map((email, index) => (
                  <tr key={index}>
                    <td>
                      {new Date(email.date).toLocaleDateString()} at{' '}
                      {new Date(email.date).toLocaleTimeString()}
                    </td>
                    <td>
                      <span className="badge badge-info">
                        {email.type === 'daily_deals' ? 'Daily Deals' : email.type}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        email.status === 'sent' ? 'badge-success' : 'badge-danger'
                      }`}>
                        {email.status === 'sent' ? (
                          <>
                            <FaCheck style={{ marginRight: '0.25rem' }} />
                            Sent
                          </>
                        ) : (
                          <>
                            <FaTimes style={{ marginRight: '0.25rem' }} />
                            Failed
                          </>
                        )}
                      </span>
                    </td>
                    <td>{email.dealsCount || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Information Section */}
      <div className="card" style={{ 
        marginTop: '2rem',
        backgroundColor: '#f8f9fa',
        border: '1px solid #e9ecef'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <FaEnvelope style={{ 
            color: '#6c757d', 
            fontSize: '1.5rem',
            marginTop: '0.25rem'
          }} />
          <div>
            <h3 style={{ marginBottom: '1rem', color: '#495057' }}>
              About Email Notifications
            </h3>
            <div style={{ color: '#666', lineHeight: '1.6' }}>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Daily Schedule:</strong> Emails are sent automatically at your chosen time every day.
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Content:</strong> Each email contains the top 10 deals for wines in your preferences list.
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Format:</strong> Deals are presented in a clean table format with prices, discounts, and shop information.
              </p>
              <p>
                <strong>Opt-out:</strong> You can disable notifications at any time by unchecking the "Receive daily wine deal emails" option.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSettings; 