
import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Skeleton } from '@/components/ui/skeleton';

interface GeographicMapProps {
  data: Array<{ country: string; listeners: number }>;
  isLoading: boolean;
}

// Function to get point size based on listener count
const getPointSize = (listeners: number) => {
  if (listeners > 1000) return 25;
  if (listeners > 500) return 20;
  if (listeners > 100) return 15;
  if (listeners > 50) return 10;
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
            Enter Mapbox API Key (Optional)
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Get your free API key from <a href="https://mapbox.com" target="_blank" rel="noreferrer" className="text-blue-500 underline">mapbox.com</a> to view geographic data
          </p>
          <input
            id="mapbox-key"
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNrZ..."
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

const GeographicMap = ({ data, isLoading }: GeographicMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <p className="text-lg font-medium">No geographic data available</p>
          <p className="text-sm">Geographic data will appear once listeners start visiting your site</p>
        </div>
      </div>
    );
  }

  // For now, show a simple list since we don't have country coordinates
  return (
    <div className="p-4">
      <div className="text-center mb-4">
        <p className="text-sm text-gray-600 mb-4">
          Geographic Data ({data.length} countries)
        </p>
      </div>
      
      {!apiKey ? (
        <MapboxKeyInput onApiKeySubmit={setApiKey} />
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {data
            .sort((a, b) => b.listeners - a.listeners)
            .map((location, index) => (
              <div key={location.country} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="font-medium">{location.country}</span>
                </div>
                <span className="text-sm text-gray-600">
                  {location.listeners} listener{location.listeners !== 1 ? 's' : ''}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default GeographicMap;
