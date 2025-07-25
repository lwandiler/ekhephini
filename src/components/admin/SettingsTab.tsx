
import React, { useState, useEffect, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { StationSettings } from '@/types/theme';
import { stationService } from '@/services/api/stationService';
import { StationContext } from '@/contexts/StationContext';
import GeneralSettings from './settings/GeneralSettings';
import LogoSettings from './settings/LogoSettings';
import SocialMediaSettings from './settings/SocialMediaSettings';
import ContactSettings from './settings/ContactSettings';

interface SettingsTabProps {
  settings: StationSettings;
  onSaveSettings: (settings: StationSettings) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ settings, onSaveSettings }) => {
  const [localSettings, setLocalSettings] = useState<StationSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const { refreshSettings } = useContext(StationContext);
  
  // Update local settings when prop settings change
  useEffect(() => {
    console.log("SettingsTab: Settings received:", settings);
    setLocalSettings(settings);
  }, [settings]);
  
  // Handle settings field change
  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, name } = e.target;
    console.log(`Setting changed: ${id || name} = ${value}`);
    
    // Handle nested properties using the name attribute
    if (name && name.includes('.')) {
      const [parent, child] = name.split('.');
      
      // Type-safe approach to update nested properties
      if (parent === 'contactInfo') {
        setLocalSettings({
          ...localSettings,
          contactInfo: {
            ...localSettings.contactInfo,
            [child]: value
          }
        });
      } else if (parent === 'socialLinks') {
        setLocalSettings({
          ...localSettings,
          socialLinks: {
            ...localSettings.socialLinks,
            [child]: value
          }
        });
      }
    } 
    // Handle social properties
    else if (id.startsWith('social-')) {
      const socialNetwork = id.replace('social-', '');
      setLocalSettings({
        ...localSettings,
        socialLinks: {
          ...localSettings.socialLinks,
          [socialNetwork]: value
        }
      });
    } 
    // Handle top-level properties
    else {
      setLocalSettings({
        ...localSettings,
        [id]: value
      });
    }
  };
  
  // Handle logo change
  const handleLogoChange = (logoUrl: string) => {
    console.log("Logo changed:", logoUrl);
    setLocalSettings({
      ...localSettings,
      logoUrl
    });
  };
  
  // Save settings to database and context using REST API
  const handleSaveSettings = async () => {
    setIsSaving(true);
    console.log("SettingsTab: Saving settings to database:", localSettings);
    
    try {
      // Format data for API update
      const apiData = {
        station_name: localSettings.stationName,
        station_tagline: localSettings.stationTagline,
        station_description: localSettings.stationDescription,
        stream_url: localSettings.streamUrl,
        recording_stream_url: localSettings.recordingStreamUrl,
        logo_url: localSettings.logoUrl,
        social_links: localSettings.socialLinks,
        contact_info: localSettings.contactInfo
      };
      
      // Save via REST API
      await stationService.updateStationSettings(apiData);
      
      // Update app context & localStorage
      onSaveSettings({...localSettings});
      
      // Force a global settings refresh using the context's refresh function
      // But delay it to prevent immediate refresh loop
      console.log("SettingsTab: Settings saved, triggering delayed refresh");
      if (refreshSettings) {
        setTimeout(() => {
          refreshSettings();
        }, 1000);
      }
      
      toast({
        title: "Settings Saved",
        description: "Your station settings have been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        variant: "destructive",
        title: "Error Saving Settings",
        description: "There was a problem saving your settings. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Station Settings</h2>
      <p className="text-muted-foreground">Configure your radio station website settings.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GeneralSettings settings={localSettings} onSettingsChange={handleSettingChange} />
        <LogoSettings settings={localSettings} onLogoChange={handleLogoChange} />
        <SocialMediaSettings settings={localSettings} onSettingsChange={handleSettingChange} />
        <ContactSettings settings={localSettings} onSettingsChange={handleSettingChange} />
      </div>
      
      <div className="flex justify-end">
        <Button 
          className="bg-radio-accent hover:bg-radio-accent/80"
          onClick={handleSaveSettings}
          size="lg"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>
    </div>
  );
};

export default SettingsTab;
