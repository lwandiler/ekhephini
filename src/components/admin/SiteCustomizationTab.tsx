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
import { stationService } from '@/services/api/stationService';
import { Save, Eye } from 'lucide-react';
import { applyThemeToDocument } from '@/utils/themeManager';

const SiteCustomizationTab = () => {
  const { themeOptions, setThemeOptions } = useContext(ThemeContext);
  const { settings, setSettings, refreshSettings } = useContext(StationContext);
  const [analyticsScript, setAnalyticsScript] = useState(localStorage.getItem('googleAnalyticsScript') || '');
  const [pageTexts, setPageTexts] = useState({
    heroTitle: settings.stationName,
    heroSubtitle: settings.stationTagline,
    aboutText: settings.stationDescription,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [savingStates, setSavingStates] = useState({
    logo: false,
    theme: false,
    text: false,
    analytics: false
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
            description: "Your station logo has been updated. Click Save to persist changes.",
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveLogo = async () => {
    setSavingStates(prev => ({ ...prev, logo: true }));
    try {
      const settingsToSave = {
        logo_url: settings.logoUrl,
      };
      await stationService.updateStationSettings(settingsToSave);
      
      // Refresh settings to ensure UI is updated
      if (refreshSettings) {
        await refreshSettings();
      }
      
      toast({
        title: "Logo Saved",
        description: "Logo has been saved to the database successfully.",
      });
    } catch (error) {
      console.error('Error saving logo:', error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Failed to save logo to the database. Please try again.",
      });
    } finally {
      setSavingStates(prev => ({ ...prev, logo: false }));
    }
  };

  const handlePreviewLogo = () => {
    // Preview logo change in context without saving
    if (setSettings) {
      const newSettings = {
        ...settings,
        logoUrl: settings.logoUrl
      };
      setSettings(newSettings);
      toast({
        title: "Logo Preview",
        description: "Logo preview applied. Changes are not saved yet.",
      });
    }
  };

  const handleThemeChange = (updates: Partial<typeof themeOptions>) => {
    const newThemeOptions = { ...themeOptions, ...updates };
    setThemeOptions(newThemeOptions);
    localStorage.setItem('clickRadioTheme', JSON.stringify(newThemeOptions));
    toast({
      title: "Theme Updated",
      description: "Your site theme has been updated. Click Save to persist changes.",
    });
  };

  const handleSaveTheme = async () => {
    setSavingStates(prev => ({ ...prev, theme: true }));
    try {
      // Theme options are saved to localStorage since they're not part of station settings
      localStorage.setItem('clickRadioTheme', JSON.stringify(themeOptions));
      toast({
        title: "Theme Saved",
        description: "Theme settings have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving theme:', error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Failed to save theme settings. Please try again.",
      });
    } finally {
      setSavingStates(prev => ({ ...prev, theme: false }));
    }
  };

  const handlePreviewTheme = () => {
    // Apply theme preview without saving to localStorage or database
    applyThemeToDocument(themeOptions);
    // Force a re-render by updating the theme context temporarily
    setThemeOptions(prev => ({ ...prev }));
    toast({
      title: "Theme Preview",
      description: "Theme preview applied. Refresh the page to see full effects. Changes are not saved yet.",
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
        description: "Your page text has been updated. Click Save to persist changes.",
      });
    }
  };

  const handleSavePageText = async () => {
    setSavingStates(prev => ({ ...prev, text: true }));
    try {
      const settingsToSave = {
        station_name: pageTexts.heroTitle,
        station_tagline: pageTexts.heroSubtitle,
        station_description: pageTexts.aboutText,
      };
      await stationService.updateStationSettings(settingsToSave);
      
      // Refresh settings to ensure UI is updated
      if (refreshSettings) {
        await refreshSettings();
      }
      
      toast({
        title: "Page Text Saved",
        description: "Page text has been saved to the database successfully.",
      });
    } catch (error) {
      console.error('Error saving page text:', error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Failed to save page text to the database. Please try again.",
      });
    } finally {
      setSavingStates(prev => ({ ...prev, text: false }));
    }
  };

  const handlePreviewText = () => {
    // Preview text changes without saving
    if (setSettings) {
      const newSettings = {
        ...settings,
        stationName: pageTexts.heroTitle,
        stationTagline: pageTexts.heroSubtitle,
        stationDescription: pageTexts.aboutText,
      };
      setSettings(newSettings);
      document.title = pageTexts.heroTitle;
      toast({
        title: "Text Preview",
        description: "Text preview applied. Changes are not saved yet.",
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
        description: "Google Analytics script has been added. Click Save to persist changes.",
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
        description: "Google Analytics script has been removed. Click Save to persist changes.",
      });
    }
  };

  const handleSaveAnalytics = async () => {
    setSavingStates(prev => ({ ...prev, analytics: true }));
    try {
      // Analytics script is saved to localStorage since it's not part of station settings
      localStorage.setItem('googleAnalyticsScript', analyticsScript);
      
      // Apply the script immediately
      if (analyticsScript.trim()) {
        const existingScript = document.querySelector('#custom-google-analytics');
        if (existingScript) {
          existingScript.remove();
        }
        const scriptElement = document.createElement('script');
        scriptElement.id = 'custom-google-analytics';
        scriptElement.innerHTML = analyticsScript;
        document.head.appendChild(scriptElement);
      } else {
        const existingScript = document.querySelector('#custom-google-analytics');
        if (existingScript) {
          existingScript.remove();
        }
      }
      
      toast({
        title: "Analytics Saved",
        description: "Google Analytics script has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving analytics:', error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Failed to save analytics script. Please try again.",
      });
    } finally {
      setSavingStates(prev => ({ ...prev, analytics: false }));
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // Prepare the settings data for the database
      const settingsToSave = {
        station_name: pageTexts.heroTitle,
        station_tagline: pageTexts.heroSubtitle,
        station_description: pageTexts.aboutText,
        stream_url: settings.streamUrl,
        logo_url: settings.logoUrl,
        social_links: settings.socialLinks,
        contact_info: settings.contactInfo,
      };

      // Save to database using the station service
      await stationService.updateStationSettings(settingsToSave);

      // Also save theme options and analytics script to localStorage
      localStorage.setItem('clickRadioTheme', JSON.stringify(themeOptions));
      localStorage.setItem('googleAnalyticsScript', analyticsScript);
      
      // Refresh settings to ensure UI is updated
      if (refreshSettings) {
        await refreshSettings();
      }

      toast({
        title: "Changes Saved",
        description: "All your customization changes have been saved to the database successfully.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Failed to save changes to the database. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Site Customization</h2>
          <p className="text-muted-foreground">Customize your website's appearance and content.</p>
        </div>
        <Button 
          onClick={handleSaveChanges} 
          disabled={isSaving}
          className="bg-green-600 hover:bg-green-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>
      
      <Tabs defaultValue="logo" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="logo">Logo</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="text">Page Text</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="logo" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Station Logo</CardTitle>
                <CardDescription>
                  Upload your station logo (recommended size: 400x400px, max 2MB)
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handlePreviewLogo} 
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Logo
                </Button>
                <Button 
                  onClick={handleSaveLogo} 
                  disabled={savingStates.logo}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {savingStates.logo ? 'Saving...' : 'Save Logo'}
                </Button>
              </div>
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Site Theme</CardTitle>
                <CardDescription>
                  Customize your website's color scheme and typography
                </CardDescription>
                <div className="mt-2 text-sm text-muted-foreground">
                  <span className="font-medium">Currently Applied:</span> {themeOptions.type} theme, {themeOptions.colorScheme} color, {themeOptions.fontFamily} font, {themeOptions.fontSize} size
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handlePreviewTheme} 
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Theme
                </Button>
                <Button 
                  onClick={handleSaveTheme} 
                  disabled={savingStates.theme}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {savingStates.theme ? 'Saving...' : 'Save Theme'}
                </Button>
              </div>
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Page Text Content</CardTitle>
                <CardDescription>
                  Edit the main text content displayed on your website
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handlePreviewText} 
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Text
                </Button>
                <Button 
                  onClick={handleSavePageText} 
                  disabled={savingStates.text}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {savingStates.text ? 'Saving...' : 'Save Text'}
                </Button>
              </div>
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
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Google Analytics</CardTitle>
                <CardDescription>
                  Add your complete Google Analytics script to track website visitors
                </CardDescription>
              </div>
              <Button 
                onClick={handleSaveAnalytics} 
                disabled={savingStates.analytics}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {savingStates.analytics ? 'Saving...' : 'Save Analytics'}
              </Button>
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
