import React, { useEffect, useState } from 'react';
import './TransitInfo.css';
import { transitService } from '../../services/transitService';

interface TransitInfoProps {
  selectedRoute?: any;
}

const TransitInfo: React.FC<TransitInfoProps> = ({ selectedRoute }) => {
  const [busData, setBusData] = useState<any[]>([]);
  const [trainData, setTrainData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('bus');

  // Fetch bus and train data
  useEffect(() => {
    const fetchTransitData = async () => {
      setLoading(true);
      try {
        // For now, we'll use mock data until we integrate with the actual API
        const _busResponse = await transitService.getBusData();
        const _trainResponse = await transitService.getTrainData();
        
        // In a real implementation, we would use the actual response data
        // For now, let's use mock data
        setBusData([
          { id: '1001', route: '6', direction: 'Northbound', nextStop: 'Jackson', eta: '2 min' },
          { id: '1002', route: '22', direction: 'Southbound', nextStop: 'Clark/Lake', eta: '5 min' },
          { id: '1003', route: '147', direction: 'Northbound', nextStop: 'Michigan/Chicago', eta: '8 min' },
        ]);
        
        setTrainData([
          { id: '2001', line: 'Red', direction: '95th/Dan Ryan', nextStation: 'Jackson', eta: '3 min' },
          { id: '2002', line: 'Blue', direction: 'O\'Hare', nextStation: 'Clark/Lake', eta: '7 min' },
          { id: '2003', line: 'Brown', direction: 'Kimball', nextStation: 'Merchandise Mart', eta: '4 min' },
        ]);
      } catch (error) {
        console.error('Error fetching transit data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransitData();
    
    // Set up refresh interval (every 30 seconds)
    const interval = setInterval(fetchTransitData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="transit-info-container">
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'bus' ? 'active' : ''}`}
          onClick={() => setActiveTab('bus')}
        >
          Buses
        </button>
        <button 
          className={`tab ${activeTab === 'train' ? 'active' : ''}`}
          onClick={() => setActiveTab('train')}
        >
          Trains
        </button>
        {selectedRoute && (
          <button 
            className={`tab ${activeTab === 'route' ? 'active' : ''}`}
            onClick={() => setActiveTab('route')}
          >
            Your Route
          </button>
        )}
      </div>

      <div className="tab-content">
        {loading ? (
          <div className="loading">Loading transit information...</div>
        ) : (
          <>
            {activeTab === 'bus' && (
              <div className="buses-list">
                <h3>Nearby Buses</h3>
                {busData.length > 0 ? (
                  <ul>
                    {busData.map(bus => (
                      <li key={bus.id} className="transit-item">
                        <span className="route-badge" style={{ backgroundColor: '#1E88E5' }}>
                          {bus.route}
                        </span>
                        <div className="transit-details">
                          <div className="transit-name">{bus.direction}</div>
                          <div className="transit-info">Next stop: {bus.nextStop}</div>
                          <div className="transit-eta">ETA: {bus.eta}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-data">No bus information available</p>
                )}
              </div>
            )}

            {activeTab === 'train' && (
              <div className="trains-list">
                <h3>Nearby Trains</h3>
                {trainData.length > 0 ? (
                  <ul>
                    {trainData.map(train => (
                      <li key={train.id} className="transit-item">
                        <span className="route-badge" style={{ 
                          backgroundColor: getTrainColor(train.line)
                        }}>
                          {train.line}
                        </span>
                        <div className="transit-details">
                          <div className="transit-name">To {train.direction}</div>
                          <div className="transit-info">Next station: {train.nextStation}</div>
                          <div className="transit-eta">ETA: {train.eta}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-data">No train information available</p>
                )}
              </div>
            )}

            {activeTab === 'route' && selectedRoute && (
              <div className="route-details">
                <h3>Your Route</h3>
                <div className="route-summary">
                  <div>Origin: {selectedRoute.origin || 'Not specified'}</div>
                  <div>Destination: {selectedRoute.destination || 'Not specified'}</div>
                  <div>Estimated Time: {selectedRoute.duration || 'Unknown'}</div>
                </div>
                
                <h4>Transit Options</h4>
                <div className="route-steps">
                  {/* This would be populated with actual route steps */}
                  <div className="route-step">
                    <div className="step-icon">🚶</div>
                    <div className="step-details">
                      <div>Walk to bus stop at Michigan Ave</div>
                      <div className="step-duration">5 min</div>
                    </div>
                  </div>
                  <div className="route-step">
                    <div className="step-icon">🚌</div>
                    <div className="step-details">
                      <div>Take Bus 6 to Jackson</div>
                      <div className="step-duration">12 min</div>
                    </div>
                  </div>
                  <div className="route-step">
                    <div className="step-icon">🚶</div>
                    <div className="step-details">
                      <div>Walk to final destination</div>
                      <div className="step-duration">3 min</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Helper function to get train line colors
const getTrainColor = (line: string): string => {
  const colors: {[key: string]: string} = {
    'Red': '#C62828',
    'Blue': '#1565C0',
    'Brown': '#795548',
    'Green': '#2E7D32',
    'Orange': '#EF6C00',
    'Pink': '#EC407A',
    'Purple': '#6A1B9A',
    'Yellow': '#F9A825'
  };
  
  return colors[line] || '#757575';
};

export default TransitInfo;
