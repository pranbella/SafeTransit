import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Types for API responses
export interface BusResponse {
  // Add bus response types here
}

export interface TrainResponse {
  // Add train response types here
}

export interface RouteRequest {
  origin: {
    lat: number;
    lng: number;
  };
  destination: {
    lat: number;
    lng: number;
  };
  prioritizeSafety?: boolean;
}

// Transit service API calls
export const transitService = {
  // Get real-time bus data
  getBusData: async (routeId?: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/transit/bus`, {
        params: routeId ? { routeId } : {}
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching bus data:', error);
      throw error;
    }
  },

  // Get real-time train data
  getTrainData: async (stationId?: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/transit/train`, {
        params: stationId ? { stationId } : {}
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching train data:', error);
      throw error;
    }
  },

  // Get Divvy bike station data
  getDivvyData: async (stationId?: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/transit/divvy`, {
        params: stationId ? { stationId } : {}
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Divvy data:', error);
      throw error;
    }
  },

  // Calculate route between two points
  getRoute: async (routeRequest: RouteRequest) => {
    try {
      const { origin, destination, prioritizeSafety } = routeRequest;
      const response = await axios.get(`${API_BASE_URL}/transit/route`, {
        params: {
          origin: `${origin.lat},${origin.lng}`,
          destination: `${destination.lat},${destination.lng}`,
          prioritizeSafety: prioritizeSafety || false
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error calculating route:', error);
      throw error;
    }
  }
};

export default transitService;
