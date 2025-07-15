
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
  const [analyticsId, setAnalyticsId] = useState(localStorage.getItem('googleAnalyticsId') || '');
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
    if (analyticsId.trim()) {
      localStorage.setItem('googleAnalyticsId', analyticsId);
      
      // Add Google Analytics script to head
      const existingScript = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
      if (!existingScript) {
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
        document.head.appendChild(script1);

        const script2 = document.createElement('script');
        script2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${analyticsId}');
        `;
        document.head.appendChild(script2);
      }

      toast({
        title: "Analytics Updated",
        description: "Google Analytics has been configured successfully.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid Google Analytics ID.",
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
                Add Google Analytics tracking to your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="analytics-id">Google Analytics ID</Label>
                <Input 
                  id="analytics-id"
                  value={analyticsId}
                  onChange={(e) => setAnalyticsId(e.target.value)}
                  placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX"
                />
                <p className="text-xs text-gray-500">
                  Find your Analytics ID in your Google Analytics dashboard
                </p>
              </div>
              
              <Button onClick={handleAnalyticsUpdate} className="w-full">
                Update Analytics
              </Button>
              
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Setup Instructions:</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Create a Google Analytics account</li>
                  <li>Set up a new property for your website</li>
                  <li>Copy the Measurement ID (starts with G-)</li>
                  <li>Paste it above and click "Update Analytics"</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteCustomizationTab;
