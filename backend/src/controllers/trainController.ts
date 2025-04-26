import { Request, Response } from 'express';
import ctaTrainService from '../services/ctaTrainService';

// Train Controller
export const trainController = {
  // Get train arrivals by station
  getArrivalsByStation: async (req: Request, res: Response) => {
    const { stationId } = req.params;
    
    if (!stationId) {
      return res.status(400).json({ error: 'Station ID is required' });
    }
    
    try {
      const arrivals = await ctaTrainService.getArrivalsByStation(stationId);
      res.status(200).json({ arrivals });
    } catch (error) {
      console.error(`Error in getArrivalsByStation controller for station ${stationId}:`, error);
      res.status(500).json({ error: 'Failed to fetch train arrivals' });
    }
  },

  // Get train arrivals by stop
  getArrivalsByStop: async (req: Request, res: Response) => {
    const { stopId } = req.params;
    
    if (!stopId) {
      return res.status(400).json({ error: 'Stop ID is required' });
    }
    
    try {
      const arrivals = await ctaTrainService.getArrivalsByStop(stopId);
      res.status(200).json({ arrivals });
    } catch (error) {
      console.error(`Error in getArrivalsByStop controller for stop ${stopId}:`, error);
      res.status(500).json({ error: 'Failed to fetch train arrivals' });
    }
  },

  // Get train arrivals by route
  getArrivalsByRoute: async (req: Request, res: Response) => {
    const { routeCode } = req.params;
    
    if (!routeCode) {
      return res.status(400).json({ error: 'Route code is required' });
    }
    
    try {
      const arrivals = await ctaTrainService.getArrivalsByRoute(routeCode);
      res.status(200).json({ arrivals });
    } catch (error) {
      console.error(`Error in getArrivalsByRoute controller for route ${routeCode}:`, error);
      res.status(500).json({ error: 'Failed to fetch train arrivals' });
    }
  },

  // Get train locations for a route
  getTrainLocations: async (req: Request, res: Response) => {
    const { routeCode } = req.params;
    
    if (!routeCode) {
      return res.status(400).json({ error: 'Route code is required' });
    }
    
    try {
      const locations = await ctaTrainService.getTrainLocations(routeCode);
      res.status(200).json({ locations });
    } catch (error) {
      console.error(`Error in getTrainLocations controller for route ${routeCode}:`, error);
      res.status(500).json({ error: 'Failed to fetch train locations' });
    }
  },

  // Get "Follow This Train" information
  getFollowTrain: async (req: Request, res: Response) => {
    const { runNumber } = req.params;
    
    if (!runNumber) {
      return res.status(400).json({ error: 'Run number is required' });
    }
    
    try {
      const trainData = await ctaTrainService.getFollowTrain(runNumber);
      res.status(200).json({ trainData });
    } catch (error) {
      console.error(`Error in getFollowTrain controller for run ${runNumber}:`, error);
      res.status(500).json({ error: 'Failed to fetch train information' });
    }
  },

  // Get all train stations
  getAllStations: async (_req: Request, res: Response) => {
    try {
      const stations = await ctaTrainService.getAllStations();
      res.status(200).json({ stations });
    } catch (error) {
      console.error('Error in getAllStations controller:', error);
      res.status(500).json({ error: 'Failed to fetch train stations' });
    }
  }
};

export default trainController;
