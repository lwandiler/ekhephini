
import React, { useState, useContext } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { ThemeContext } from '@/contexts/ThemeContext';
import { StationContext } from '@/contexts/StationContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ColorSchemeSelector } from '@/components/theme/ColorSchemeSelector';
import { ThemeTypeSelector } from '@/components/theme/ThemeTypeSelector';
import { FontFamilySelector } from '@/components/theme/FontFamilySelector';
import { FontSizeSelector } from '@/components/theme/FontSizeSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SiteCustomizationTab = () => {
  const { themeOptions, setThemeOptions } = useContext(ThemeContext);
  const { settings, setSettings } = useContext(StationContext);
  const [analyticsScript, setAnalyticsScript] = useState(localStorage.getItem('googleAnalyticsScript') || '');
  const [pageTexts, setPageTexts] = useState({
    heroTitle: settings.stationName,
    heroSubtitle: settings.stationTagline,
    aboutText: settings.stationDescription,
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match('image.*')) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select an image file (JPG, PNG, GIF).",
        });
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Logo image must be less than 2MB.",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && setSettings) {
          const newSettings = {
            ...settings,
            logoUrl: event.target.result as string
          };
          setSettings(newSettings);
          localStorage.setItem('radioSettings', JSON.stringify(newSettings));
          toast({
            title: "Logo Updated",
            description: "Your station logo has been updated successfully.",
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThemeChange = (updates: Partial<typeof themeOptions>) => {
    const newThemeOptions = { ...themeOptions, ...updates };
    setThemeOptions(newThemeOptions);
    localStorage.setItem('clickRadioTheme', JSON.stringify(newThemeOptions));
    toast({
      title: "Theme Updated",
      description: "Your site theme has been updated successfully.",
    });
  };

  const handleTextUpdate = () => {
    if (setSettings) {
      const newSettings = {
        ...settings,
        stationName: pageTexts.heroTitle,
        stationTagline: pageTexts.heroSubtitle,
        stationDescription: pageTexts.aboutText,
      };
      setSettings(newSettings);
      localStorage.setItem('radioSettings', JSON.stringify(newSettings));
      document.title = pageTexts.heroTitle;
      toast({
        title: "Page Text Updated",
        description: "Your page text has been updated successfully.",
      });
    }
  };

  const handleAnalyticsUpdate = () => {
    if (analyticsScript.trim()) {
      // Remove any existing custom analytics script
      const existingScript = document.querySelector('#custom-google-analytics');
      if (existingScript) {
        existingScript.remove();
      }

      // Save the script to localStorage
      localStorage.setItem('googleAnalyticsScript', analyticsScript);
      
      // Add the new script to head
      const scriptElement = document.createElement('script');
      scriptElement.id = 'custom-google-analytics';
      scriptElement.innerHTML = analyticsScript;
      document.head.appendChild(scriptElement);

      toast({
        title: "Analytics Updated",
        description: "Google Analytics script has been added successfully.",
      });
    } else {
      // Remove script if empty
      const existingScript = document.querySelector('#custom-google-analytics');
      if (existingScript) {
        existingScript.remove();
      }
      localStorage.removeItem('googleAnalyticsScript');
      
      toast({
        title: "Analytics Removed",
        description: "Google Analytics script has been removed.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Site Customization</h2>
      <p className="text-muted-foreground">Customize your website's appearance and content.</p>
      
      <Tabs defaultValue="logo" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="logo">Logo</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="text">Page Text</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="logo" className="mt-6">
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
        </TabsContent>
        
        <TabsContent value="theme" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Theme</CardTitle>
              <CardDescription>
                Customize your website's color scheme and typography
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ThemeTypeSelector 
                currentThemeOptions={themeOptions}
                onChange={(type) => handleThemeChange({ type })}
              />
              
              <ColorSchemeSelector 
                currentColorScheme={themeOptions.colorScheme}
                onChange={(colorScheme) => handleThemeChange({ colorScheme })}
              />
              
              <FontFamilySelector 
                currentFontFamily={themeOptions.fontFamily}
                onChange={(fontFamily) => handleThemeChange({ fontFamily })}
              />
              
              <FontSizeSelector 
                currentFontSize={themeOptions.fontSize}
                onChange={(fontSize) => handleThemeChange({ fontSize })}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="text" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Text Content</CardTitle>
              <CardDescription>
                Edit the main text content displayed on your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero-title">Site Title</Label>
                <Input 
                  id="hero-title"
                  value={pageTexts.heroTitle}
                  onChange={(e) => setPageTexts({...pageTexts, heroTitle: e.target.value})}
                  placeholder="Your Station Name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hero-subtitle">Tagline</Label>
                <Input 
                  id="hero-subtitle"
                  value={pageTexts.heroSubtitle}
                  onChange={(e) => setPageTexts({...pageTexts, heroSubtitle: e.target.value})}
                  placeholder="Your station tagline"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="about-text">Description</Label>
                <Textarea 
                  id="about-text"
                  value={pageTexts.aboutText}
                  onChange={(e) => setPageTexts({...pageTexts, aboutText: e.target.value})}
                  placeholder="Describe your radio station..."
                  rows={4}
                />
              </div>
              
              <Button onClick={handleTextUpdate} className="w-full">
                Update Page Text
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Google Analytics</CardTitle>
              <CardDescription>
                Add your complete Google Analytics script to track website visitors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="analytics-script">Google Analytics Script</Label>
                <Textarea 
                  id="analytics-script"
                  value={analyticsScript}
                  onChange={(e) => setAnalyticsScript(e.target.value)}
                  placeholder="Paste your complete Google Analytics script here..."
                  rows={10}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500">
                  Copy the entire script provided by Google Analytics and paste it here
                </p>
              </div>
              
              <Button onClick={handleAnalyticsUpdate} className="w-full">
                {analyticsScript.trim() ? 'Update Analytics Script' : 'Remove Analytics Script'}
              </Button>
              
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Setup Instructions:</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Go to your Google Analytics dashboard</li>
                  <li>Navigate to Admin → Data Streams</li>
                  <li>Select your website stream</li>
                  <li>Click on "Tagging Instructions" → "Global Site Tag"</li>
                  <li>Copy the entire script and paste it above</li>
                  <li>Click "Update Analytics Script"</li>
                </ol>
                <p className="text-xs text-gray-600 mt-2">
                  The script will be automatically added to your website's head section for proper tracking.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteCustomizationTab;
