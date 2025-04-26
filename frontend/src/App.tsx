import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MapComponent from './components/Map/MapComponent';
import RouteSearch from './components/RouteSearch/RouteSearch';
import TransitInfo from './components/TransitInfo/TransitInfo';
import { transitService } from './services/transitService';

interface MapComponentProps {
  busMarkers: any[];
  trainMarkers: any[];
  routes?: any[];
}

interface TransitInfoProps {
  selectedRoute: any;
}

function App() {
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [busMarkers, setBusMarkers] = useState<any[]>([]);
  const [trainMarkers, setTrainMarkers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Fetch real-time vehicle locations
  useEffect(() => {
    const fetchVehicleLocations = async () => {
      setIsLoading(true);
      try {
        // Common bus routes in Chicago
        const busRouteIds = ['22', '6', '147', '151', '8'];
        const trainRouteIds = ['RED', 'BLUE', 'G', 'BRN'];

        // Fetch bus locations
        const buses: any[] = [];
        for (const routeId of busRouteIds) {
          try {
            const response = await transitService.getBusVehicles(routeId);
            if (response.vehicles && response.vehicles.length > 0) {
              // Transform to map marker format
              const markers = response.vehicles.map(vehicle => ({
                id: vehicle.vid,
                latitude: parseFloat(vehicle.lat),
                longitude: parseFloat(vehicle.lon),
                route: vehicle.rt,
                direction: vehicle.des,
                delayed: vehicle.dly
              }));
              buses.push(...markers);
            }
          } catch (err) {
            console.error(`Error fetching buses for route ${routeId}:`, err);
          }
        }
        
        // Fetch train locations
        const trains: any[] = [];
        for (const routeId of trainRouteIds) {
          try {
            const response = await transitService.getTrainLocations(routeId);
            if (response.locations && response.locations.length > 0) {
              // Transform to map marker format
              const markers = response.locations.map(train => ({
                id: train.rn,
                latitude: parseFloat(train.lat),
                longitude: parseFloat(train.lon),
                line: routeId,
                destination: train.destNm,
                nextStation: train.nextStaNm
              }));
              trains.push(...markers);
            }
          } catch (err) {
            console.error(`Error fetching trains for route ${routeId}:`, err);
          }
        }
        
        setBusMarkers(buses);
        setTrainMarkers(trains);
      } catch (error) {
        console.error('Error fetching vehicle locations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Initial fetch
    fetchVehicleLocations();
    
    // Set up refresh interval (every 30 seconds)
    const interval = setInterval(fetchVehicleLocations, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);
  
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
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <>
              <RouteSearch onRouteFound={handleRouteFound} />
              <MapComponent 
                busMarkers={busMarkers}
                trainMarkers={trainMarkers}
                routes={selectedRoute ? [selectedRoute] : []}
              />
              {selectedRoute && <TransitInfo selectedRoute={selectedRoute} />}
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
