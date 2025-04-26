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
        // Fetch real data for common routes
        const busRouteIds = ['22', '6', '147']; // Clark, Jackson, Outer Drive Express
        const trainStationId = '40380'; // Clark/Lake
        
        // Get bus vehicles for specific routes (since predictions aren't available)
        const busPredictions: any[] = [];
        for (const routeId of busRouteIds) {
          try {
            // Use the bus vehicles API directly now that our service is properly structured
            const response = await transitService.getBusVehicles(routeId);
            if (response && response.vehicles && response.vehicles.length > 0) {
              // Map the API response to our component format
              const vehicles = response.vehicles.slice(0, 2).map((vehicle) => ({
                id: vehicle.vid,
                route: vehicle.rt,
                direction: vehicle.des,
                nextStop: 'En Route',
                eta: vehicle.dly ? 'Delayed' : 'In Service'
              }));
              busPredictions.push(...vehicles);
            }
          } catch (err) {
            console.error(`Error fetching vehicles for route ${routeId}:`, err);
          }
        }
        
        // Get train arrivals for Clark/Lake station
        const trainArrivals: any[] = [];
        try {
          // Use the train arrivals API directly now that our service is properly structured
          const response = await transitService.getTrainArrivals(trainStationId);
          if (response && response.arrivals && response.arrivals.length > 0) {
            // Map the API response to our component format
            const arrivals = response.arrivals.slice(0, 5).map((arr) => ({
              id: arr.rn,
              line: getLineName(arr.rt),
              direction: arr.destNm,
              nextStation: arr.staNm,
              eta: calculateEta(arr.arrT)
            }));
            trainArrivals.push(...arrivals);
          }
        } catch (err) {
          console.error('Error fetching train arrivals:', err);
        }
        
        setBusData(busPredictions);
        setTrainData(trainArrivals);
      } catch (error) {
        console.error('Error fetching transit data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Helper function to calculate ETA in minutes
    const calculateEta = (predictionTime: string): string => {
      const now = new Date();
      const predTime = new Date(predictionTime);
      const diffMinutes = Math.round((predTime.getTime() - now.getTime()) / 60000);
      
      if (diffMinutes <= 0) {
        return 'Due';
      } else if (diffMinutes === 1) {
        return '1 min';
      } else {
        return `${diffMinutes} mins`;
      }
    };
    
    // Helper function to convert route code to line name
    const getLineName = (routeCode: string): string => {
      const lineMap: {[key: string]: string} = {
        'RED': 'Red',
        'BLUE': 'Blue',
        'G': 'Green',
        'BRN': 'Brown',
        'P': 'Purple',
        'Y': 'Yellow',
        'PINK': 'Pink',
        'ORG': 'Orange'
      };
      return lineMap[routeCode] || routeCode;
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
