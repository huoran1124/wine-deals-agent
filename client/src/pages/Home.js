import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaWineGlass, FaBell, FaSearch, FaMapMarkerAlt, FaPercent } from 'react-icons/fa';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
        color: 'white',
        padding: '4rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            🍷 Find the Best Wine Deals
          </h1>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '2rem',
            opacity: 0.9
          }}>
            Discover amazing wine deals from top shops in New York and New Jersey. 
            Get personalized recommendations delivered to your inbox daily.
          </p>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-outline" style={{
              backgroundColor: 'white',
              color: '#e74c3c',
              fontSize: '1.1rem',
              padding: '1rem 2rem'
            }}>
              Go to Dashboard
            </Link>
          ) : (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-outline" style={{
                backgroundColor: 'white',
                color: '#e74c3c',
                fontSize: '1.1rem',
                padding: '1rem 2rem'
              }}>
                Get Started Free
              </Link>
              <Link to="/login" className="btn" style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid white',
                fontSize: '1.1rem',
                padding: '1rem 2rem'
              }}>
                Sign In
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 0', backgroundColor: 'white' }}>
        <div className="container">
          <h2 style={{
            textAlign: 'center',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '3rem',
            color: '#2c3e50'
          }}>
            Why Choose Wine Deals Agent?
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div className="card" style={{ textAlign: 'center', border: 'none' }}>
              <div style={{
                fontSize: '3rem',
                color: '#e74c3c',
                marginBottom: '1rem'
              }}>
                <FaSearch />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#2c3e50' }}>
                Personalized Search
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Add your favorite wines to your list and get personalized deal alerts 
                from the best wine shops in NY and NJ.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', border: 'none' }}>
              <div style={{
                fontSize: '3rem',
                color: '#e74c3c',
                marginBottom: '1rem'
              }}>
                <FaBell />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#2c3e50' }}>
                Daily Updates
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Receive daily email updates at 8 AM with the top 10 deals for each 
                wine in your preferences list.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', border: 'none' }}>
              <div style={{
                fontSize: '3rem',
                color: '#e74c3c',
                marginBottom: '1rem'
              }}>
                <FaMapMarkerAlt />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#2c3e50' }}>
                Local Focus
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Focused on wine shops in New York and New Jersey, so you can find 
                deals close to home or work.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', border: 'none' }}>
              <div style={{
                fontSize: '3rem',
                color: '#e74c3c',
                marginBottom: '1rem'
              }}>
                <FaPercent />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#2c3e50' }}>
                Best Deals
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Our algorithm finds the best deals by comparing prices and discounts 
                across multiple wine shops.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '4rem 0', backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <h2 style={{
            textAlign: 'center',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '3rem',
            color: '#2c3e50'
          }}>
            How It Works
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#e74c3c',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                margin: '0 auto 1rem'
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#2c3e50' }}>
                Sign Up
              </h3>
              <p style={{ color: '#666' }}>
                Create your free account and set up your wine preferences.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#e74c3c',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                margin: '0 auto 1rem'
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#2c3e50' }}>
                Add Wines
              </h3>
              <p style={{ color: '#666' }}>
                Add your favorite wines to your personalized list.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#e74c3c',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                margin: '0 auto 1rem'
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#2c3e50' }}>
                Get Deals
              </h3>
              <p style={{ color: '#666' }}>
                Receive daily emails with the best deals for your wines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
        color: 'white',
        padding: '4rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            Ready to Find Amazing Wine Deals?
          </h2>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '2rem',
            opacity: 0.9
          }}>
            Join thousands of wine lovers who are already saving money on their favorite wines.
          </p>
          {!isAuthenticated && (
            <Link to="/register" className="btn btn-primary" style={{
              fontSize: '1.1rem',
              padding: '1rem 2rem'
            }}>
              Start Saving Today
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home; 