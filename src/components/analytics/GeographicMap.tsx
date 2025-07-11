
import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Sample location data
const listenerLocations = [
  { city: 'New York', coordinates: [-74.006, 40.7128], listeners: 4521 },
  { city: 'Los Angeles', coordinates: [-118.2437, 34.0522], listeners: 3982 },
  { city: 'Chicago', coordinates: [-87.6298, 41.8781], listeners: 2145 },
  { city: 'Houston', coordinates: [-95.3698, 29.7604], listeners: 1876 },
  { city: 'London', coordinates: [-0.1278, 51.5074], listeners: 3215 },
  { city: 'Paris', coordinates: [2.3522, 48.8566], listeners: 2780 },
  { city: 'Tokyo', coordinates: [139.6917, 35.6895], listeners: 1235 },
  { city: 'Sydney', coordinates: [151.2093, -33.8688], listeners: 945 },
  { city: 'Toronto', coordinates: [-79.3832, 43.6532], listeners: 1670 },
  { city: 'Berlin', coordinates: [13.4050, 52.5200], listeners: 2105 },
];

// Function to get point size based on listener count
const getPointSize = (listeners: number) => {
  if (listeners > 4000) return 25;
  if (listeners > 3000) return 20;
  if (listeners > 2000) return 15;
  if (listeners > 1000) return 10;
  return 8;
};

// Temporary component for Mapbox API key input
const MapboxKeyInput = ({ onApiKeySubmit }: { onApiKeySubmit: (key: string) => void }) => {
  const [apiKey, setApiKey] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey);
    }
  };
  
  return (
    <div className="p-4 bg-slate-100 rounded-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="mapbox-key" className="block text-sm font-medium">
            Enter Mapbox API Key
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Get your free API key from <a href="https://mapbox.com" target="_blank" rel="noreferrer" className="text-blue-500 underline">mapbox.com</a>
          </p>
          <input
            id="mapbox-key"
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNrZ..."
            required
          />
        </div>
        <button 
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Load Map
        </button>
      </form>
    </div>
  );
};

const GeographicMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    if (!apiKey || !mapContainer.current) return;
    
    // Initialize map
    mapboxgl.accessToken = apiKey;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [0, 30], // Center on Atlantic
      zoom: 1.5,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers when map loads
    map.current.on('load', () => {
      listenerLocations.forEach((location) => {
        // Create a marker element
        const el = document.createElement('div');
        const size = getPointSize(location.listeners);
        el.className = 'listener-marker';
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.borderRadius = '50%';
        el.style.backgroundColor = 'rgba(139, 92, 246, 0.6)';
        el.style.border = '2px solid rgba(139, 92, 246, 0.9)';
        
        // Create a popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<strong>${location.city}</strong><p>${location.listeners.toLocaleString()} listeners</p>`
        );
        
        // Add marker to map
        new mapboxgl.Marker(el)
          .setLngLat(location.coordinates)
          .setPopup(popup)
          .addTo(map.current!);
      });
    });

    return () => {
      if (map.current) map.current.remove();
    };
  }, [apiKey]);

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    // In a real app, you would store this in localStorage or a more secure place
  };

  return (
    <div className="relative w-full h-full">
      {!apiKey ? (
        <MapboxKeyInput onApiKeySubmit={handleApiKeySubmit} />
      ) : (
        <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      )}
    </div>
  );
};

export default GeographicMap;
