import React, { useState } from 'react';
import './App.css';
import MapComponent from './components/Map/MapComponent';
import RouteSearch from './components/RouteSearch/RouteSearch';
import TransitInfo from './components/TransitInfo/TransitInfo';

function App() {
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [busMarkers, _setBusMarkers] = useState<any[]>([]);
  const [trainMarkers, _setTrainMarkers] = useState<any[]>([]);
  
  // Handle when a route is found
  const handleRouteFound = (route: any) => {
    setSelectedRoute(route);
    
    // In a real implementation, we would use actual route data
    // For now, just create a mock route on the map
    const mockRoutes = [
      {
        id: 'route-1',
        color: '#2196F3',
        coordinates: [
          [-87.6298, 41.8781], // Chicago
          [-87.6270, 41.8819], // Point 1
          [-87.6240, 41.8830], // Point 2
          [-87.6210, 41.8850]  // Destination
        ]
      }
    ];
    
    // Update the route on the map
    setSelectedRoute({
      ...route,
      routes: mockRoutes
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>SafeTransit Chicago</h1>
      </header>
      
      <main className="App-main">
        <div className="left-panel">
          <RouteSearch onRouteFound={handleRouteFound} />
          <TransitInfo selectedRoute={selectedRoute} />
        </div>
        
        <div className="map-panel">
          <MapComponent 
            routes={selectedRoute?.routes || []} 
            busMarkers={busMarkers}
            trainMarkers={trainMarkers}
          />
        </div>
      </main>
      
      <footer className="App-footer">
        <p>Transit Hacks 2025 - SafeTransit</p>
      </footer>
    </div>
  );
}

export default App;
