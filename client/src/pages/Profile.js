import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
  FaUser, 
  FaEnvelope, 
  FaCalendar, 
  FaEdit, 
  FaSave, 
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaLock
} from 'react-icons/fa';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateProfile = () => {
    const newErrors = {};

    if (!profileData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!profileData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!profileData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveProfile = async () => {
    if (!validateProfile()) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put('/auth/profile', profileData);
      updateUser(response.data.user);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (!validatePassword()) {
      return;
    }

    try {
      setLoading(true);
      await axios.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setChangingPassword(false);
      toast.success('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setProfileData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || ''
    });
    setEditing(false);
    setErrors({});
  };

  const cancelPasswordChange = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setChangingPassword(false);
    setErrors({});
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2c3e50', marginBottom: '2rem' }}>
        Profile Settings
      </h1>

      {/* Profile Information */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="card-title">
              <FaUser style={{ marginRight: '0.5rem', color: '#e74c3c' }} />
              Personal Information
            </h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="btn btn-outline"
              >
                <FaEdit />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {editing ? (
          <form onSubmit={(e) => { e.preventDefault(); saveProfile(); }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className={`form-control ${errors.firstName ? 'error' : ''}`}
                  value={profileData.firstName}
                  onChange={handleProfileChange}
                  placeholder="Enter your first name"
                />
                {errors.firstName && <div className="error-message">{errors.firstName}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className={`form-control ${errors.lastName ? 'error' : ''}`}
                  value={profileData.lastName}
                  onChange={handleProfileChange}
                  placeholder="Enter your last name"
                />
                {errors.lastName && <div className="error-message">{errors.lastName}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className={`form-control ${errors.email ? 'error' : ''}`}
                  value={profileData.email}
                  onChange={handleProfileChange}
                  placeholder="Enter your email"
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? (
                  <>
                    <div className="spinner" style={{ marginRight: '0.5rem' }}></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="btn btn-secondary"
              >
                <FaTimes />
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            <div>
              <label style={{ fontWeight: '500', color: '#495057', marginBottom: '0.5rem', display: 'block' }}>
                First Name
              </label>
              <p style={{ color: '#666', margin: 0 }}>{user?.firstName}</p>
            </div>

            <div>
              <label style={{ fontWeight: '500', color: '#495057', marginBottom: '0.5rem', display: 'block' }}>
                Last Name
              </label>
              <p style={{ color: '#666', margin: 0 }}>{user?.lastName}</p>
            </div>

            <div>
              <label style={{ fontWeight: '500', color: '#495057', marginBottom: '0.5rem', display: 'block' }}>
                Email Address
              </label>
              <p style={{ color: '#666', margin: 0 }}>{user?.email}</p>
            </div>

            <div>
              <label style={{ fontWeight: '500', color: '#495057', marginBottom: '0.5rem', display: 'block' }}>
                Member Since
              </label>
              <p style={{ color: '#666', margin: 0 }}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>

            <div>
              <label style={{ fontWeight: '500', color: '#495057', marginBottom: '0.5rem', display: 'block' }}>
                Last Login
              </label>
              <p style={{ color: '#666', margin: 0 }}>
                {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
              </p>
            </div>

            <div>
              <label style={{ fontWeight: '500', color: '#495057', marginBottom: '0.5rem', display: 'block' }}>
                Account Status
              </label>
              <span className={`badge ${user?.isActive ? 'badge-success' : 'badge-danger'}`}>
                {user?.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="card-title">
              <FaLock style={{ marginRight: '0.5rem', color: '#e74c3c' }} />
              Change Password
            </h2>
            {!changingPassword && (
              <button
                onClick={() => setChangingPassword(true)}
                className="btn btn-outline"
              >
                <FaEdit />
                Change Password
              </button>
            )}
          </div>
        </div>

        {changingPassword ? (
          <form onSubmit={(e) => { e.preventDefault(); changePassword(); }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="currentPassword"
                    className={`form-control ${errors.currentPassword ? 'error' : ''}`}
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#666',
                      cursor: 'pointer'
                    }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.currentPassword && <div className="error-message">{errors.currentPassword}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    className={`form-control ${errors.newPassword ? 'error' : ''}`}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#666',
                      cursor: 'pointer'
                    }}
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.newPassword && <div className="error-message">{errors.newPassword}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#666',
                      cursor: 'pointer'
                    }}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? (
                  <>
                    <div className="spinner" style={{ marginRight: '0.5rem' }}></div>
                    Changing Password...
                  </>
                ) : (
                  <>
                    <FaLock />
                    Change Password
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={cancelPasswordChange}
                className="btn btn-secondary"
              >
                <FaTimes />
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div style={{ color: '#666', padding: '1rem 0' }}>
            <p>Keep your account secure by using a strong password that you don't use elsewhere.</p>
            <p>Your password should be at least 6 characters long.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 