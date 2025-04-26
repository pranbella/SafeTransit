import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapComponent.css';

// You'll need to get a Mapbox token
// Sign up at https://account.mapbox.com/ and create a token
// To use your token, create a .env file in the frontend directory with:
// REACT_APP_MAPBOX_TOKEN=your_token_here
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || 'pk.eyJ1IjoiZGVtby1hY2NvdW50IiwiYSI6ImNsbHpwZjV2dTFiNXAzcnBlbjRjNmJudWgifQ.GpCcqTs4K1Ot49clROt45w';
// Note: The fallback token above is a public demo token with limited usage - replace with your own token

interface MapComponentProps {
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
  routes?: any[]; // Routes to display on the map
  busMarkers?: any[]; // Bus locations to display
  trainMarkers?: any[]; // Train locations to display
}

const MapComponent: React.FC<MapComponentProps> = ({
  center = [-87.6298, 41.8781], // Default to Chicago
  zoom = 12,
  routes = [],
  busMarkers = [],
  trainMarkers = []
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: center,
      zoom: zoom
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
    };
  }, [center, zoom]);

  // Add route lines to map
  useEffect(() => {
    if (!mapLoaded || routes.length === 0) return;

    // Add route lines
    routes.forEach((route, index) => {
      const sourceId = `route-source-${index}`;
      const layerId = `route-layer-${index}`;

      if (map.current?.getSource(sourceId)) {
        (map.current.getSource(sourceId) as mapboxgl.GeoJSONSource).setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route.coordinates
          }
        });
      } else {
        map.current?.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: route.coordinates
            }
          }
        });

        map.current?.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': route.color || '#0080ff',
            'line-width': 5
          }
        });
      }
    });
  }, [mapLoaded, routes]);

  // Add bus markers to map
  useEffect(() => {
    if (!mapLoaded) return;

    const markers: mapboxgl.Marker[] = [];

    busMarkers.forEach((bus) => {
      const marker = new mapboxgl.Marker({ color: '#1E88E5' })
        .setLngLat([bus.longitude, bus.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3>Bus #${bus.id}</h3>
            <p>Route: ${bus.route}</p>
            <p>Direction: ${bus.direction}</p>`
          )
        )
        .addTo(map.current!);
      
      markers.push(marker);
    });

    return () => {
      markers.forEach(marker => marker.remove());
    };
  }, [mapLoaded, busMarkers]);

  // Add train markers to map
  useEffect(() => {
    if (!mapLoaded) return;

    const markers: mapboxgl.Marker[] = [];

    trainMarkers.forEach((train) => {
      const marker = new mapboxgl.Marker({ color: '#F44336' })
        .setLngLat([train.longitude, train.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3>Train #${train.id}</h3>
            <p>Line: ${train.line}</p>
            <p>Destination: ${train.destination}</p>`
          )
        )
        .addTo(map.current!);
      
      markers.push(marker);
    });

    return () => {
      markers.forEach(marker => marker.remove());
    };
  }, [mapLoaded, trainMarkers]);

  return <div className="map-container" ref={mapContainer} />;
};

export default MapComponent;
