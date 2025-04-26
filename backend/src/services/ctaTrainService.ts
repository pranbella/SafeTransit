import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Using the Train Tracker API key from environment variables
const API_KEY = process.env.CTA_TRAIN_API_KEY || '7775f2896b184955ada165c878e29f26';
const BASE_URL = 'https://lapi.transitchicago.com/api/1.0';

// Interfaces for API responses
export interface TrainStation {
  map_id: string;
  station_name: string;
  station_descriptive_name: string;
  lat: number;
  lon: number;
  ada: boolean;
  red: boolean;
  blue: boolean;
  green: boolean;
  brown: boolean;
  purple: boolean;
  purple_express: boolean;
  yellow: boolean;
  pink: boolean;
  orange: boolean;
}

export interface TrainArrival {
  staId: string;         // Station ID
  stpId: string;         // Stop ID
  staNm: string;         // Station Name
  stpDe: string;         // Stop Description
  rn: string;            // Run Number
  rt: string;            // Route Code
  destSt: string;        // Destination Station ID
  destNm: string;        // Destination Name
  trDr: string;          // Train Direction
  prdt: string;          // Prediction Generation Time
  arrT: string;          // Arrival Time
  isApp: string;         // Is Approaching (0/1)
  isSch: string;         // Is Scheduled (0/1)
  isDly: string;         // Is Delayed (0/1)
  isFlt: string;         // Is Fault (0/1)
  flags: string | null;  // Flags
  lat: string | null;    // Latitude
  lon: string | null;    // Longitude
  heading: string | null; // Heading
}

export interface TrainLocation {
  rn: string;            // Run Number
  destSt: string;        // Destination Station ID
  destNm: string;        // Destination Name
  trDr: string;          // Train Direction
  nextStaId: string;     // Next Station ID
  nextStpId: string;     // Next Stop ID
  nextStaNm: string;     // Next Station Name
  prdt: string;          // Prediction Generation Time
  arrT: string;          // Arrival Time
  isApp: string;         // Is Approaching (0/1)
  isDly: string;         // Is Delayed (0/1)
  flags: string | null;  // Flags
  lat: string;           // Latitude
  lon: string;           // Longitude
  heading: string;       // Heading
}

// CTA Train API Service
const ctaTrainService = {
  // Get train arrivals by station
  getArrivalsByStation: async (stationId: string): Promise<TrainArrival[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/ttarrivals.aspx`, {
        params: {
          key: API_KEY,
          mapid: stationId,
          outputType: 'JSON'
        }
      });
      
      if (response.data && response.data.ctatt && response.data.ctatt.eta) {
        return response.data.ctatt.eta;
      }
      return [];
    } catch (error) {
      console.error(`Error fetching train arrivals for station ${stationId}:`, error);
      throw error;
    }
  },
  
  // Get train arrivals by stop
  getArrivalsByStop: async (stopId: string): Promise<TrainArrival[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/ttarrivals.aspx`, {
        params: {
          key: API_KEY,
          stpid: stopId,
          outputType: 'JSON'
        }
      });
      
      if (response.data && response.data.ctatt && response.data.ctatt.eta) {
        return response.data.ctatt.eta;
      }
      return [];
    } catch (error) {
      console.error(`Error fetching train arrivals for stop ${stopId}:`, error);
      throw error;
    }
  },
  
  // Get train arrivals for a specific line/route
  getArrivalsByRoute: async (routeCode: string): Promise<TrainArrival[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/ttarrivals.aspx`, {
        params: {
          key: API_KEY,
          rt: routeCode,
          outputType: 'JSON'
        }
      });
      
      if (response.data && response.data.ctatt && response.data.ctatt.eta) {
        return response.data.ctatt.eta;
      }
      return [];
    } catch (error) {
      console.error(`Error fetching train arrivals for route ${routeCode}:`, error);
      throw error;
    }
  },
  
  // Get follow-this-train data for a specific run number
  getFollowTrain: async (runNumber: string): Promise<TrainArrival[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/ttfollow.aspx`, {
        params: {
          key: API_KEY,
          runnumber: runNumber,
          outputType: 'JSON'
        }
      });
      
      if (response.data && response.data.ctatt && response.data.ctatt.eta) {
        return response.data.ctatt.eta;
      }
      return [];
    } catch (error) {
      console.error(`Error fetching follow-this-train data for run ${runNumber}:`, error);
      throw error;
    }
  },
  
  // Get train locations for a specific route
  getTrainLocations: async (routeCode: string): Promise<TrainLocation[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/ttpositions.aspx`, {
        params: {
          key: API_KEY,
          rt: routeCode,
          outputType: 'JSON'
        }
      });
      
      if (response.data && response.data.ctatt && response.data.ctatt.route && response.data.ctatt.route[0].train) {
        return response.data.ctatt.route[0].train;
      }
      return [];
    } catch (error) {
      console.error(`Error fetching train locations for route ${routeCode}:`, error);
      throw error;
    }
  },
  
  // Get list of all train stations (uses a static GTFS data endpoint)
  getAllStations: async (): Promise<TrainStation[]> => {
    try {
      // Note: This endpoint typically doesn't require an API key
      // The URL below is a placeholder - CTA might provide this data via GTFS feeds
      const response = await axios.get('https://data.cityofchicago.org/resource/8pix-ypme.json');
      return response.data;
    } catch (error) {
      console.error('Error fetching train stations:', error);
      throw error;
    }
  }
};

export default ctaTrainService;
