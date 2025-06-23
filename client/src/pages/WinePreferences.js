import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch,
  FaWineGlass,
  FaTimes
} from 'react-icons/fa';

const WinePreferences = () => {
  const [wines, setWines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingWine, setEditingWine] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  const [formData, setFormData] = useState({
    wineName: '',
    varietal: '',
    region: '',
    priceRange: { min: '', max: '' }
  });

  useEffect(() => {
    fetchWinePreferences();
  }, []);

  const fetchWinePreferences = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/wines/preferences');
      setWines(response.data.winePreferences);
    } catch (error) {
      console.error('Error fetching wine preferences:', error);
      toast.error('Failed to load wine preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      wineName: '',
      varietal: '',
      region: '',
      priceRange: { min: '', max: '' }
    });
    setEditingWine(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.wineName.trim()) {
      toast.error('Wine name is required');
      return;
    }

    try {
      if (editingWine) {
        await axios.put(`/wines/preferences/${editingWine._id}`, formData);
        toast.success('Wine updated successfully!');
      } else {
        await axios.post('/wines/preferences', formData);
        toast.success('Wine added successfully!');
      }
      
      resetForm();
      fetchWinePreferences();
    } catch (error) {
      console.error('Error saving wine:', error);
      const message = error.response?.data?.message || 'Failed to save wine';
      toast.error(message);
    }
  };

  const handleEdit = (wine) => {
    setEditingWine(wine);
    setFormData({
      wineName: wine.wineName,
      varietal: wine.varietal || '',
      region: wine.region || '',
      priceRange: {
        min: wine.priceRange?.min || '',
        max: wine.priceRange?.max || ''
      }
    });
    setShowAddForm(true);
  };

  const handleDelete = async (wineId) => {
    if (!window.confirm('Are you sure you want to remove this wine from your preferences?')) {
      return;
    }

    try {
      await axios.delete(`/wines/preferences/${wineId}`);
      toast.success('Wine removed successfully!');
      fetchWinePreferences();
    } catch (error) {
      console.error('Error deleting wine:', error);
      toast.error('Failed to remove wine');
    }
  };

  const searchWines = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const response = await axios.get(`/wines/search?query=${encodeURIComponent(query)}`);
      setSearchResults(response.data.wines || []);
    } catch (error) {
      console.error('Error searching wines:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const addFromSearch = (wine) => {
    setFormData({
      wineName: wine.name,
      varietal: wine.varietal || '',
      region: wine.region || '',
      priceRange: { min: '', max: '' }
    });
    setShowAddForm(true);
    setSearchQuery('');
    setSearchResults([]);
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
        Loading wine preferences...
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2c3e50' }}>
          My Wine Preferences
        </h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary"
        >
          <FaPlus />
          Add Wine
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h2 className="card-title">
              {editingWine ? 'Edit Wine' : 'Add New Wine'}
            </h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              <div className="form-group">
                <label className="form-label">Wine Name *</label>
                <input
                  type="text"
                  name="wineName"
                  className="form-control"
                  value={formData.wineName}
                  onChange={handleInputChange}
                  placeholder="e.g., Château Margaux 2015"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Varietal</label>
                <input
                  type="text"
                  name="varietal"
                  className="form-control"
                  value={formData.varietal}
                  onChange={handleInputChange}
                  placeholder="e.g., Bordeaux Blend"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Region</label>
                <input
                  type="text"
                  name="region"
                  className="form-control"
                  value={formData.region}
                  onChange={handleInputChange}
                  placeholder="e.g., Bordeaux, France"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Min Price ($)</label>
                <input
                  type="number"
                  name="priceRange.min"
                  className="form-control"
                  value={formData.priceRange.min}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Max Price ($)</label>
                <input
                  type="number"
                  name="priceRange.max"
                  className="form-control"
                  value={formData.priceRange.max}
                  onChange={handleInputChange}
                  placeholder="1000"
                  min="0"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">
                {editingWine ? 'Update Wine' : 'Add Wine'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Wine Search */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">Search for Wines</h2>
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search for wines to add to your preferences..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              searchWines(e.target.value);
            }}
          />
        </div>
        
        {searching && (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div className="spinner" style={{ marginRight: '0.5rem' }}></div>
            Searching...
          </div>
        )}

        {searchResults.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#495057' }}>Search Results</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1rem'
            }}>
              {searchResults.map((wine, index) => (
                <div key={index} className="card" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>{wine.name}</h4>
                      {wine.varietal && <p style={{ margin: '0.25rem 0', color: '#666' }}>Varietal: {wine.varietal}</p>}
                      {wine.region && <p style={{ margin: '0.25rem 0', color: '#666' }}>Region: {wine.region}</p>}
                      {wine.price && <p style={{ margin: '0.25rem 0', color: '#666' }}>Price: ${wine.price}</p>}
                    </div>
                    <button
                      onClick={() => addFromSearch(wine)}
                      className="btn btn-outline"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                    >
                      <FaPlus />
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Wine List */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            Your Wine List ({wines.length})
          </h2>
        </div>
        
        {wines.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            <FaWineGlass style={{ fontSize: '4rem', color: '#e9ecef', marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '1rem', color: '#495057' }}>No wines in your list yet</h3>
            <p style={{ marginBottom: '2rem' }}>
              Add your favorite wines to start receiving personalized deal alerts!
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary"
            >
              <FaPlus />
              Add Your First Wine
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Wine Name</th>
                  <th>Varietal</th>
                  <th>Region</th>
                  <th>Price Range</th>
                  <th>Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {wines.map((wine) => (
                  <tr key={wine._id}>
                    <td>
                      <strong>{wine.wineName}</strong>
                    </td>
                    <td>{wine.varietal || '-'}</td>
                    <td>{wine.region || '-'}</td>
                    <td>
                      {wine.priceRange?.min || wine.priceRange?.max ? (
                        `${wine.priceRange.min ? `$${wine.priceRange.min}` : '$0'} - ${wine.priceRange.max ? `$${wine.priceRange.max}` : '∞'}`
                      ) : (
                        'Any price'
                      )}
                    </td>
                    <td>
                      {new Date(wine.addedAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleEdit(wine)}
                          className="btn btn-outline"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(wine._id)}
                          className="btn btn-outline"
                          style={{ 
                            padding: '0.25rem 0.5rem', 
                            fontSize: '0.8rem',
                            color: '#dc3545',
                            borderColor: '#dc3545'
                          }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WinePreferences; 