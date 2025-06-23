import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
  FaSearch, 
  FaFilter, 
  FaMapMarkerAlt, 
  FaExternalLinkAlt,
  FaSort,
  FaSortUp,
  FaSortDown
} from 'react-icons/fa';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    wineName: '',
    shopName: '',
    state: '',
    minPrice: '',
    maxPrice: ''
  });
  const [sortBy, setSortBy] = useState('dealScore');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchDeals();
  }, [filters, sortBy, sortOrder, currentPage]);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        sortBy,
        sortOrder,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      });

      const response = await axios.get(`/deals?${params}`);
      setDeals(response.data.deals);
      setTotalPages(response.data.pagination.total);
    } catch (error) {
      console.error('Error fetching deals:', error);
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      wineName: '',
      shopName: '',
      state: '',
      minPrice: '',
      maxPrice: ''
    });
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return <FaSort />;
    return sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  const formatPrice = (price) => {
    return price ? `$${price.toFixed(2)}` : 'N/A';
  };

  const calculateDiscount = (original, discounted) => {
    if (!original || !discounted) return null;
    return Math.round(((original - discounted) / original) * 100);
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
        Loading deals...
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2c3e50' }}>
          Wine Deals
        </h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn btn-outline"
        >
          <FaFilter />
          {showFilters ? 'Hide' : 'Show'} Filters
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h2 className="card-title">Filter Deals</h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div className="form-group">
              <label className="form-label">Wine Name</label>
              <input
                type="text"
                name="wineName"
                className="form-control"
                value={filters.wineName}
                onChange={handleFilterChange}
                placeholder="Search wine name..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Shop Name</label>
              <input
                type="text"
                name="shopName"
                className="form-control"
                value={filters.shopName}
                onChange={handleFilterChange}
                placeholder="Search shop name..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">State</label>
              <select
                name="state"
                className="form-control"
                value={filters.state}
                onChange={handleFilterChange}
              >
                <option value="">All States</option>
                <option value="NY">New York</option>
                <option value="NJ">New Jersey</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Min Price</label>
              <input
                type="number"
                name="minPrice"
                className="form-control"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Max Price</label>
              <input
                type="number"
                name="maxPrice"
                className="form-control"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="1000"
                min="0"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={fetchDeals} className="btn btn-primary">
              <FaSearch />
              Apply Filters
            </button>
            <button onClick={clearFilters} className="btn btn-secondary">
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Deals Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            Available Deals ({deals.length})
          </h2>
        </div>
        
        {deals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            <FaSearch style={{ fontSize: '4rem', color: '#e9ecef', marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '1rem', color: '#495057' }}>No deals found</h3>
            <p>Try adjusting your filters or check back later for new deals.</p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>
                      <button
                        onClick={() => handleSort('wineName')}
                        style={{
                          background: 'none',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          cursor: 'pointer',
                          fontWeight: '600',
                          color: '#495057'
                        }}
                      >
                        Wine Name
                        {getSortIcon('wineName')}
                      </button>
                    </th>
                    <th>
                      <button
                        onClick={() => handleSort('originalPrice')}
                        style={{
                          background: 'none',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          cursor: 'pointer',
                          fontWeight: '600',
                          color: '#495057'
                        }}
                      >
                        Original Price
                        {getSortIcon('originalPrice')}
                      </button>
                    </th>
                    <th>
                      <button
                        onClick={() => handleSort('discountedPrice')}
                        style={{
                          background: 'none',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          cursor: 'pointer',
                          fontWeight: '600',
                          color: '#495057'
                        }}
                      >
                        Discounted Price
                        {getSortIcon('discountedPrice')}
                      </button>
                    </th>
                    <th>Shop</th>
                    <th>Location</th>
                    <th>
                      <button
                        onClick={() => handleSort('dealScore')}
                        style={{
                          background: 'none',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          cursor: 'pointer',
                          fontWeight: '600',
                          color: '#495057'
                        }}
                      >
                        Deal Score
                        {getSortIcon('dealScore')}
                      </button>
                    </th>
                    <th>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {deals.map((deal) => {
                    const discount = calculateDiscount(deal.originalPrice, deal.discountedPrice);
                    return (
                      <tr key={deal._id}>
                        <td>
                          <div>
                            <strong>{deal.wineName}</strong>
                            {deal.wineDetails?.vintage && (
                              <br />
                              <small style={{ color: '#666' }}>{deal.wineDetails.vintage}</small>
                            )}
                            {deal.wineDetails?.varietal && (
                              <br />
                              <small style={{ color: '#666' }}>{deal.wineDetails.varietal}</small>
                            )}
                          </div>
                        </td>
                        <td>
                          <span style={{ textDecoration: deal.discountedPrice ? 'line-through' : 'none' }}>
                            {formatPrice(deal.originalPrice)}
                          </span>
                        </td>
                        <td>
                          {deal.discountedPrice ? (
                            <div>
                              <span style={{ color: '#27ae60', fontWeight: 'bold' }}>
                                {formatPrice(deal.discountedPrice)}
                              </span>
                              {discount && (
                                <br />
                                <span className="badge badge-success">
                                  {discount}% off
                                </span>
                              )}
                            </div>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td>
                          <a
                            href={deal.shopWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: '#3498db',
                              textDecoration: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                          >
                            {deal.shopName}
                            <FaExternalLinkAlt style={{ fontSize: '0.8rem' }} />
                          </a>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <FaMapMarkerAlt style={{ color: '#666', fontSize: '0.8rem' }} />
                            {deal.shopLocation?.city}, {deal.shopLocation?.state}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${
                            deal.dealScore > 100 ? 'badge-success' :
                            deal.dealScore > 50 ? 'badge-warning' : 'badge-danger'
                          }`}>
                            {deal.dealScore}
                          </span>
                        </td>
                        <td>
                          {new Date(deal.scrapedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                borderTop: '1px solid #e9ecef'
              }}>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="btn btn-outline"
                >
                  Previous
                </button>
                
                <span style={{ color: '#666' }}>
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="btn btn-outline"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Deals; 