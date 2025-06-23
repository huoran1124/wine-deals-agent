import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaWineGlass, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav style={{
      backgroundColor: '#2c3e50',
      padding: '1rem 0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            <FaWineGlass style={{ marginRight: '0.5rem', color: '#e74c3c' }} />
            Wine Deals Agent
          </Link>

          {/* Desktop Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'color 0.2s'
                }} onMouseEnter={(e) => e.target.style.color = '#e74c3c'}
                   onMouseLeave={(e) => e.target.style.color = 'white'}>
                  Dashboard
                </Link>
                <Link to="/wines" style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'color 0.2s'
                }} onMouseEnter={(e) => e.target.style.color = '#e74c3c'}
                   onMouseLeave={(e) => e.target.style.color = 'white'}>
                  My Wines
                </Link>
                <Link to="/deals" style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'color 0.2s'
                }} onMouseEnter={(e) => e.target.style.color = '#e74c3c'}
                   onMouseLeave={(e) => e.target.style.color = 'white'}>
                  Deals
                </Link>
                <div style={{ position: 'relative' }}>
                  <button onClick={toggleMenu} style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    transition: 'background-color 0.2s'
                  }} onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                     onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                    <FaUser />
                    {user?.firstName}
                  </button>
                  
                  {isMenuOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      minWidth: '200px',
                      zIndex: 1000,
                      marginTop: '0.5rem'
                    }}>
                      <Link to="/profile" style={{
                        display: 'block',
                        padding: '0.75rem 1rem',
                        color: '#333',
                        textDecoration: 'none',
                        borderBottom: '1px solid #e9ecef'
                      }} onClick={() => setIsMenuOpen(false)}>
                        Profile
                      </Link>
                      <Link to="/email-settings" style={{
                        display: 'block',
                        padding: '0.75rem 1rem',
                        color: '#333',
                        textDecoration: 'none',
                        borderBottom: '1px solid #e9ecef'
                      }} onClick={() => setIsMenuOpen(false)}>
                        Email Settings
                      </Link>
                      <button onClick={handleLogout} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'none',
                        border: 'none',
                        color: '#dc3545',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}>
                        <FaSignOutAlt />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: '500',
                  marginRight: '1rem',
                  transition: 'color 0.2s'
                }} onMouseEnter={(e) => e.target.style.color = '#e74c3c'}
                   onMouseLeave={(e) => e.target.style.color = 'white'}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div style={{
            display: 'none',
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255,255,255,0.1)'
          }}>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" style={{
                  display: 'block',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.5rem 0',
                  fontWeight: '500'
                }} onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/wines" style={{
                  display: 'block',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.5rem 0',
                  fontWeight: '500'
                }} onClick={() => setIsMenuOpen(false)}>
                  My Wines
                </Link>
                <Link to="/deals" style={{
                  display: 'block',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.5rem 0',
                  fontWeight: '500'
                }} onClick={() => setIsMenuOpen(false)}>
                  Deals
                </Link>
                <Link to="/profile" style={{
                  display: 'block',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.5rem 0',
                  fontWeight: '500'
                }} onClick={() => setIsMenuOpen(false)}>
                  Profile
                </Link>
                <Link to="/email-settings" style={{
                  display: 'block',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.5rem 0',
                  fontWeight: '500'
                }} onClick={() => setIsMenuOpen(false)}>
                  Email Settings
                </Link>
                <button onClick={handleLogout} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'none',
                  border: 'none',
                  color: '#e74c3c',
                  cursor: 'pointer',
                  padding: '0.5rem 0',
                  fontWeight: '500'
                }}>
                  <FaSignOutAlt />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{
                  display: 'block',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.5rem 0',
                  fontWeight: '500'
                }} onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" style={{
                  display: 'block',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.5rem 0',
                  fontWeight: '500'
                }} onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 