import { Request, Response } from 'express';
import ctaBusService from '../services/ctaBusService';

// Bus Controller
export const busController = {
  // Get all available bus routes
  getRoutes: async (req: Request, res: Response) => {
    try {
      const routes = await ctaBusService.getRoutes();
      res.status(200).json({ routes });
    } catch (error) {
      console.error('Error in getRoutes controller:', error);
      res.status(500).json({ error: 'Failed to fetch bus routes' });
    }
  },

  // Get directions for a specific route
  getDirections: async (req: Request, res: Response) => {
    const { routeId } = req.params;
    
    if (!routeId) {
      return res.status(400).json({ error: 'Route ID is required' });
    }
    
    try {
      const directions = await ctaBusService.getDirections(routeId);
      res.status(200).json({ directions });
    } catch (error) {
      console.error(`Error in getDirections controller for route ${routeId}:`, error);
      res.status(500).json({ error: 'Failed to fetch directions' });
    }
  },

  // Get stops for a specific route and direction
  getStops: async (req: Request, res: Response) => {
    const { routeId } = req.params;
    const { direction } = req.query;
    
    if (!routeId || !direction) {
      return res.status(400).json({ error: 'Route ID and direction are required' });
    }
    
    try {
      const stops = await ctaBusService.getStops(routeId, direction as string);
      res.status(200).json({ stops });
    } catch (error) {
      console.error(`Error in getStops controller for route ${routeId}:`, error);
      res.status(500).json({ error: 'Failed to fetch stops' });
    }
  },

  // Get predictions for a specific stop
  getPredictionsByStop: async (req: Request, res: Response) => {
    const { stopId } = req.params;
    
    if (!stopId) {
      return res.status(400).json({ error: 'Stop ID is required' });
    }
    
    try {
      const predictions = await ctaBusService.getPredictions(stopId);
      res.status(200).json({ predictions });
    } catch (error) {
      console.error(`Error in getPredictionsByStop controller for stop ${stopId}:`, error);
      res.status(500).json({ error: 'Failed to fetch predictions' });
    }
  },

  // Get predictions for a specific route
  getPredictionsByRoute: async (req: Request, res: Response) => {
    const { routeId } = req.params;
    
    if (!routeId) {
      return res.status(400).json({ error: 'Route ID is required' });
    }
    
    try {
      const predictions = await ctaBusService.getPredictionsByRoute(routeId);
      res.status(200).json({ predictions });
    } catch (error) {
      console.error(`Error in getPredictionsByRoute controller for route ${routeId}:`, error);
      res.status(500).json({ error: 'Failed to fetch predictions' });
    }
  },

  // Get vehicle locations for a specific route
  getVehicles: async (req: Request, res: Response) => {
    const { routeId } = req.params;
    
    if (!routeId) {
      return res.status(400).json({ error: 'Route ID is required' });
    }
    
    try {
      const vehicles = await ctaBusService.getVehicles(routeId);
      res.status(200).json({ vehicles });
    } catch (error) {
      console.error(`Error in getVehicles controller for route ${routeId}:`, error);
      res.status(500).json({ error: 'Failed to fetch vehicle locations' });
    }
  },
};

export default busController;
