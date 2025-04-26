import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Using the provided API key
const API_KEY = process.env.CTA_BUS_API_KEY || 'zg8kjD85Kb9qN8C3E9YAw4twp';
const BASE_URL = 'http://www.ctabustracker.com/bustime/api/v2';

// Interfaces for API responses
export interface BusRoute {
  rt: string;        // Route number
  rtnm: string;      // Route name
  rtclr: string;     // Route color
  rtdd: string;      // Route display designation
}

export interface BusDirection {
  id: string;
  dir: string;       // Direction (e.g., "Northbound", "Southbound")
}

export interface BusStop {
  stpid: string;     // Stop ID
  stpnm: string;     // Stop name
  lat: string;       // Latitude
  lon: string;       // Longitude
}

export interface BusPrediction {
  tmstmp: string;    // Timestamp of prediction
  typ: string;       // Type of prediction
  stpnm: string;     // Stop name
  stpid: string;     // Stop ID
  vid: string;       // Vehicle ID
  dstp: number;      // Distance to stop in feet
  rt: string;        // Route
  rtdd: string;      // Route display designation
  rtdir: string;     // Route direction
  des: string;       // Destination
  prdtm: string;     // Predicted time of arrival/departure
  dly: boolean;      // Delayed boolean
  tablockid: string; // TA Block ID
  tatripid: string;  // TA Trip ID
  zone: string;      // Zone
}

export interface BusVehicle {
  vid: string;       // Vehicle ID
  tmstmp: string;    // Timestamp
  lat: string;       // Latitude
  lon: string;       // Longitude
  hdg: string;       // Heading
  pid: number;       // Pattern ID
  rt: string;        // Route
  des: string;       // Destination
  pdist: number;     // Pattern distance
  dly: boolean;      // Delayed boolean
  tatripid: string;  // TA Trip ID
  tablockid: string; // TA Block ID
  zone: string;      // Zone
}

// CTA Bus API Service
const ctaBusService = {
  // Get list of available bus routes
  getRoutes: async (): Promise<BusRoute[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/getroutes`, {
        params: {
          key: API_KEY,
          format: 'json'
        }
      });
      
      if (response.data && response.data['bustime-response'] && response.data['bustime-response'].routes) {
        return response.data['bustime-response'].routes;
      }
      return [];
    } catch (error) {
      console.error('Error fetching bus routes:', error);
      throw error;
    }
  },
  
  // Get available directions for a route
  getDirections: async (routeId: string): Promise<BusDirection[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/getdirections`, {
        params: {
          key: API_KEY,
          rt: routeId,
          format: 'json'
        }
      });
      
      if (response.data && response.data['bustime-response'] && response.data['bustime-response'].directions) {
        return response.data['bustime-response'].directions;
      }
      return [];
    } catch (error) {
      console.error(`Error fetching directions for route ${routeId}:`, error);
      throw error;
    }
  },
  
  // Get stops for a route and direction
  getStops: async (routeId: string, direction: string): Promise<BusStop[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/getstops`, {
        params: {
          key: API_KEY,
          rt: routeId,
          dir: direction,
          format: 'json'
        }
      });
      
      if (response.data && response.data['bustime-response'] && response.data['bustime-response'].stops) {
        return response.data['bustime-response'].stops;
      }
      return [];
    } catch (error) {
      console.error(`Error fetching stops for route ${routeId} and direction ${direction}:`, error);
      throw error;
    }
  },
  
  // Get predictions for a stop
  getPredictions: async (stopId: string): Promise<BusPrediction[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/getpredictions`, {
        params: {
          key: API_KEY,
          stpid: stopId,
          format: 'json'
        }
      });
      
      if (response.data && response.data['bustime-response'] && response.data['bustime-response'].prd) {
        return response.data['bustime-response'].prd;
      }
      return [];
    } catch (error) {
      console.error(`Error fetching predictions for stop ${stopId}:`, error);
      throw error;
    }
  },
  
  // Get predictions for a specific route
  getPredictionsByRoute: async (routeId: string): Promise<BusPrediction[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/getpredictions`, {
        params: {
          key: API_KEY,
          rt: routeId,
          format: 'json'
        }
      });
      
      if (response.data && response.data['bustime-response'] && response.data['bustime-response'].prd) {
        return response.data['bustime-response'].prd;
      }
      return [];
    } catch (error) {
      console.error(`Error fetching predictions for route ${routeId}:`, error);
      throw error;
    }
  },
  
  // Get vehicle locations for a route
  getVehicles: async (routeId: string): Promise<BusVehicle[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/getvehicles`, {
        params: {
          key: API_KEY,
          rt: routeId,
          format: 'json'
        }
      });
      
      if (response.data && response.data['bustime-response'] && response.data['bustime-response'].vehicle) {
        return response.data['bustime-response'].vehicle;
      }
      return [];
    } catch (error) {
      console.error(`Error fetching vehicles for route ${routeId}:`, error);
      throw error;
    }
  }
};

export default ctaBusService;
