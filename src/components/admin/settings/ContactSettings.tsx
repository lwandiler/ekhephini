
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone } from 'lucide-react';
import { StationSettings } from '@/types/theme';

interface ContactSettingsProps {
  settings: StationSettings;
  onSettingsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ContactSettings: React.FC<ContactSettingsProps> = ({ settings, onSettingsChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>
          How listeners can reach your radio station
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-gray-500" />
            <Label htmlFor="contactEmail">Email Address</Label>
          </div>
          <Input 
            id="contactEmail" 
            type="email"
            name="contactInfo.email"
            value={settings.contactInfo.email}
            onChange={onSettingsChange}
            placeholder="contact@yourstation.com" 
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-gray-500" />
            <Label htmlFor="contactPhone">Phone Number</Label>
          </div>
          <Input 
            id="contactPhone" 
            name="contactInfo.phone"
            value={settings.contactInfo.phone}
            onChange={onSettingsChange}
            placeholder="+1 (555) 123-4567" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactSettings;
