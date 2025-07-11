
import React, { createContext, useState, useEffect } from "react";
import { StationSettings } from "@/types/theme";
import { 
  defaultStationSettings, 
  loadSettingsFromDatabase, 
  loadSettingsFromStorage, 
  saveSettingsToStorage 
} from "@/utils/stationSettingsManager";

// Create a new context for station settings
export const StationContext = createContext<{
  settings: StationSettings;
  setSettings?: React.Dispatch<React.SetStateAction<StationSettings>>;
  refreshSettings?: () => Promise<void>;
}>({
  settings: defaultStationSettings
});

export const StationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stationSettings, setStationSettings] = useState<StationSettings>(defaultStationSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Function to load settings from database or localStorage
  const loadSettings = async () => {
    try {
      console.log("StationContext: Loading settings...");
      setIsLoading(true);
      
      // Try to load settings from database first
      const dbSettings = await loadSettingsFromDatabase();
      
      if (dbSettings) {
        console.log("StationContext: Settings loaded from database:", dbSettings);
        setStationSettings(dbSettings);
        
        // Also save to localStorage for redundancy
        saveSettingsToStorage(dbSettings);
        
        // Update document title
        document.title = dbSettings.stationName;
      } else {
        // Fallback to localStorage if database fails
        console.log("StationContext: No database settings found, trying localStorage");
        const localSettings = loadSettingsFromStorage();
        if (localSettings) {
          console.log("StationContext: Settings loaded from localStorage:", localSettings);
          setStationSettings({
            ...defaultStationSettings,
            ...localSettings,
            socialLinks: {
              ...defaultStationSettings.socialLinks,
              ...(localSettings.socialLinks || {})
            },
            contactInfo: {
              ...defaultStationSettings.contactInfo,
              ...(localSettings.contactInfo || {})
            }
          });
          
          // Update document title
          document.title = localSettings.stationName || defaultStationSettings.stationName;
        } else {
          console.log("StationContext: No settings found, using defaults");
          setStationSettings(defaultStationSettings);
        }
      }
    } catch (error) {
      console.error("StationContext: Error loading settings:", error);
      setStationSettings(defaultStationSettings);
    } finally {
      setIsLoading(false);
    }
  };

  // Load settings on initial mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Listen for settings update events
  useEffect(() => {
    const handleSettingsUpdated = () => {
      console.log("StationContext: Settings update event detected, refreshing...");
      loadSettings();
    };
    
    document.addEventListener('settingsUpdated', handleSettingsUpdated);
    window.addEventListener('storage', handleSettingsUpdated);
    
    return () => {
      document.removeEventListener('settingsUpdated', handleSettingsUpdated);
      window.removeEventListener('storage', handleSettingsUpdated);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-radio-accent mb-4"></div>
          <p className="text-lg">Loading app settings...</p>
        </div>
      </div>
    );
  }

  // Include a refreshSettings function in the context value
  const contextValue = {
    settings: stationSettings,
    setSettings: setStationSettings,
    refreshSettings: loadSettings
  };

  return (
    <StationContext.Provider value={contextValue}>
      {children}
    </StationContext.Provider>
  );
};
