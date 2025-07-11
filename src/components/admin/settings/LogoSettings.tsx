
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { StationSettings } from '@/types/theme';
import { toast } from '@/components/ui/use-toast';

interface LogoSettingsProps {
  settings: StationSettings;
  onLogoChange: (logoUrl: string) => void;
}

const LogoSettings: React.FC<LogoSettingsProps> = ({ settings, onLogoChange }) => {
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.match('image.*')) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select an image file (JPG, PNG, GIF).",
        });
        return;
      }
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Logo image must be less than 2MB.",
        });
        return;
      }
      
      // Convert to data URL for preview and storage
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onLogoChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Station Logo</CardTitle>
        <CardDescription>
          Upload your station logo (recommended size: 400x400px, max 2MB)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-4">
          {settings.logoUrl ? (
            <div className="mb-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={settings.logoUrl} alt="Station logo" />
                <AvatarFallback>{settings.stationName.substring(0, 2)}</AvatarFallback>
              </Avatar>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-full h-32 w-32 flex items-center justify-center mb-4">
              <p className="text-gray-500 text-center text-sm">No logo<br/>uploaded</p>
            </div>
          )}
          
          <div className="w-full max-w-xs">
            <Label htmlFor="station-logo" className="mb-2 block">Upload Logo</Label>
            <Input 
              id="station-logo" 
              type="file"
              onChange={handleLogoUpload}
              accept="image/png, image/jpeg, image/gif"
            />
            <p className="mt-1 text-xs text-gray-500">
              Accepted formats: JPG, PNG, GIF (Max: 2MB)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogoSettings;
