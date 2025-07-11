
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { StationSettings } from '@/types/theme';

interface SocialMediaSettingsProps {
  settings: StationSettings;
  onSettingsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SocialMediaSettings: React.FC<SocialMediaSettingsProps> = ({ settings, onSettingsChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Links</CardTitle>
        <CardDescription>
          Connect your radio station's social media accounts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center">
            <Facebook className="h-4 w-4 mr-2 text-blue-600" />
            <Label htmlFor="social-facebook">Facebook</Label>
          </div>
          <Input 
            id="social-facebook" 
            value={settings.socialLinks.facebook}
            onChange={onSettingsChange}
            placeholder="https://facebook.com/your-page" 
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <Twitter className="h-4 w-4 mr-2 text-blue-400" />
            <Label htmlFor="social-twitter">Twitter</Label>
          </div>
          <Input 
            id="social-twitter" 
            value={settings.socialLinks.twitter}
            onChange={onSettingsChange}
            placeholder="https://twitter.com/your-handle" 
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <Instagram className="h-4 w-4 mr-2 text-pink-500" />
            <Label htmlFor="social-instagram">Instagram</Label>
          </div>
          <Input 
            id="social-instagram" 
            value={settings.socialLinks.instagram}
            onChange={onSettingsChange}
            placeholder="https://instagram.com/your-account" 
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <Youtube className="h-4 w-4 mr-2 text-red-600" />
            <Label htmlFor="social-youtube">YouTube</Label>
          </div>
          <Input 
            id="social-youtube" 
            value={settings.socialLinks.youtube}
            onChange={onSettingsChange}
            placeholder="https://youtube.com/your-channel" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialMediaSettings;
