
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StationSettings } from '@/types/theme';

interface GeneralSettingsProps {
  settings: StationSettings;
  onSettingsChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ settings, onSettingsChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="stationName">Station Name</Label>
          <Input 
            id="stationName" 
            value={settings.stationName}
            onChange={onSettingsChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="stationTagline">Tagline</Label>
          <Input 
            id="stationTagline" 
            value={settings.stationTagline}
            onChange={onSettingsChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="stationDescription">Description</Label>
          <Textarea 
            id="stationDescription" 
            value={settings.stationDescription}
            onChange={onSettingsChange}
            rows={4}
            placeholder="Describe your radio station in a few sentences..."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="streamUrl">Live Stream URL</Label>
          <Input 
            id="streamUrl" 
            value={settings.streamUrl}
            onChange={onSettingsChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="recordingStreamUrl">Recording Stream URL</Label>
          <Input 
            id="recordingStreamUrl" 
            value={settings.recordingStreamUrl || ''}
            onChange={onSettingsChange}
            placeholder="https://streamlive-edge-flu01.broadsmart-streaming.co.za/dumafm/index.m3u8"
          />
          <p className="text-sm text-muted-foreground">
            URL for hourly recordings. System will automatically add timestamp between 'index' and '.m3u8'
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralSettings;
