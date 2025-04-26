# SafeTransit Chicago

A safety-aware transit routing application for Chicago, built using CTA Bus and Train APIs. This application helps users find the safest and most efficient routes in Chicago using public transportation.

## Features

- Real-time CTA bus and train tracking
- Route planning with safety considerations
- Interactive map display of transit options
- Mobile-responsive web interface

## Project Structure

This project is organized into two main components:

- **Frontend**: React + TypeScript application
- **Backend**: Node.js + Express API server

## Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- API keys:
  - CTA Bus Tracker API key
  - CTA Train Tracker API key
  - Mapbox API key (for maps)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with your API keys (see `.env.example` for template)

4. Start the development server:
   ```
   npm run dev
   ```

The backend server will start on http://localhost:3001

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Add your Mapbox API key in `src/components/Map/MapComponent.tsx`

4. Start the development server:
   ```
   npm start
   ```

The frontend application will start on http://localhost:3000

## API Endpoints

### Bus Endpoints

- `GET /api/transit/bus/routes` - Get all bus routes
- `GET /api/transit/bus/routes/:routeId/directions` - Get directions for a route
- `GET /api/transit/bus/routes/:routeId/stops` - Get stops for a route
- `GET /api/transit/bus/routes/:routeId/vehicles` - Get vehicles for a route
- `GET /api/transit/bus/routes/:routeId/predictions` - Get predictions for a route
- `GET /api/transit/bus/stops/:stopId/predictions` - Get predictions for a stop

### Train Endpoints

- `GET /api/transit/train/stations` - Get all train stations
- `GET /api/transit/train/stations/:stationId/arrivals` - Get arrivals for a station
- `GET /api/transit/train/stops/:stopId/arrivals` - Get arrivals for a stop
- `GET /api/transit/train/routes/:routeCode/arrivals` - Get arrivals for a route
- `GET /api/transit/train/routes/:routeCode/locations` - Get train locations for a route
- `GET /api/transit/train/runs/:runNumber/follow` - Follow a specific train

### Route Planning

- `GET /api/transit/route` - Get route between origin and destination

## Resources

- [CTA Bus Tracker API](https://www.transitchicago.com/developers/bustracker/)
- [CTA Train Tracker API](https://www.transitchicago.com/developers/traintracker/)
- [Chicago Open Data Portal](https://data.cityofchicago.org/)

## Future Enhancements

- Integration with crime data for safety routing
- Real-time alerts for transit delays
- User accounts for saving favorite routes
- Accessibility features
