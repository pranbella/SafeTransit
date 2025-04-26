import React, { useState } from 'react';
import './RouteSearch.css';
import { transitService, RouteRequest } from '../../services/transitService';

interface RouteSearchProps {
  onRouteFound: (route: any) => void;
}

const RouteSearch: React.FC<RouteSearchProps> = ({ onRouteFound }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Geocode an address to coordinates
  // In a real app, we would use a geocoding service
  const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    // This is a mock implementation
    // In a real app, use MapBox or Google geocoding API
    if (address.toLowerCase().includes('chicago')) {
      return { lat: 41.8781, lng: -87.6298 }; // Chicago coordinates
    }
    if (address.toLowerCase().includes('millennium park')) {
      return { lat: 41.8826, lng: -87.6233 }; // Millennium Park
    }
    if (address.toLowerCase().includes('wicker park')) {
      return { lat: 41.9088, lng: -87.6796 }; // Wicker Park
    }
    if (address.toLowerCase().includes('o\'hare')) {
      return { lat: 41.9742, lng: -87.9073 }; // O'Hare Airport
    }
    if (address.toLowerCase().includes('midway')) {
      return { lat: 41.7868, lng: -87.7522 }; // Midway Airport
    }
    
    // Mock default - would be an error in real app
    return { lat: 41.8781 + (Math.random() - 0.5) * 0.1, lng: -87.6298 + (Math.random() - 0.5) * 0.1 };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Geocode addresses
      const originCoords = await geocodeAddress(origin);
      const destinationCoords = await geocodeAddress(destination);

      if (!originCoords || !destinationCoords) {
        throw new Error('Unable to geocode one or both addresses');
      }

      // Create route request
      const routeRequest: RouteRequest = {
        origin: originCoords,
        destination: destinationCoords,
      };

      // Get route from API
      const routeData = await transitService.getRoute(routeRequest);
      onRouteFound(routeData);
    } catch (err) {
      setError('Failed to find route. Please try again.');
      console.error('Route search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="route-search-container">
      <h2>Plan Your Trip</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="origin">Start</label>
          <input
            type="text"
            id="origin"
            placeholder="Enter origin address"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            required
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="destination">End</label>
          <input
            type="text"
            id="destination"
            placeholder="Enter destination address"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="search-button" disabled={loading}>
          {loading ? 'Finding Routes...' : 'Find Routes'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default RouteSearch;
