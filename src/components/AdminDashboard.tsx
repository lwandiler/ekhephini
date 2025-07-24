
import { useState, useEffect, useContext } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { StationContext } from '@/contexts/StationContext';
import { StationSettings } from '@/types/theme';
import { supabase } from '@/integrations/supabase/client';
import { defaultStationSettings, extractSocialLinks, extractContactInfo } from '@/utils/stationSettingsManager';

// Import tab components
import ShowsTab from './admin/ShowsTab';
import BlogPostsTab from './admin/BlogPostsTab';
import PagesTab from './admin/PagesTab';
import AnalyticsTab from './admin/AnalyticsTab';
import AnnouncementsTab from './admin/AnnouncementsTab';
import BannersTab from './admin/banners/BannersTab';
import SettingsTab from './admin/SettingsTab';
import UsersTab from './admin/UsersTab';

import SiteCustomizationTab from './admin/SiteCustomizationTab';
import PodcastsTab from './admin/PodcastsTab';
import AdsTab from './admin/AdsTab';
import AdRequestsTab from './admin/AdRequestsTab';
import MediaTab from './admin/MediaTab';
import { NewsletterTab } from './admin/NewsletterTab';
import SocialMediaApiTab from './admin/SocialMediaApiTab';
import { RecordedShowsTab } from './admin/RecordedShowsTab';

const AdminDashboard = () => {
  // Get settings context
  const { settings, setSettings, refreshSettings } = useContext(StationContext);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardSettings, setDashboardSettings] = useState<StationSettings>(settings);
  
  // Load settings from context when it changes
  useEffect(() => {
    console.log('AdminDashboard: Settings from context:', settings);
    setDashboardSettings(settings);
    setIsLoading(false);
  }, [settings]);
  
  // Handle saving settings updates
  const handleSaveSettings = async (updatedSettings: StationSettings) => {
    try {
      console.log('AdminDashboard: Saving updated settings:', updatedSettings);
      
      // Update global context if available
      if (setSettings) {
        setSettings(updatedSettings);
      }
      
      // Apply settings to the site
      applySettingsToSite(updatedSettings);
      
      // Update our local state
      setDashboardSettings(updatedSettings);
    } catch (error) {
      console.error("AdminDashboard: Error saving settings:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings. Please try again.",
      });
    }
  };

  // Function to apply settings to the site
  const applySettingsToSite = (updatedSettings: StationSettings) => {
    // Update page title
    document.title = updatedSettings.stationName;
    
    // Apply global document updates
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', updatedSettings.stationDescription);
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'description';
      newMeta.content = updatedSettings.stationDescription;
      document.head.appendChild(newMeta);
    }
    
    console.log('AdminDashboard: Applied settings to site:', updatedSettings);
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <Tabs defaultValue="analytics">
        <div className="border-b">
          <div className="container mx-auto px-6 overflow-x-auto">
            <TabsList className="h-14">
              <TabsTrigger value="analytics" className="data-[state=active]:text-radio-accent">Analytics</TabsTrigger>
              <TabsTrigger value="customize" className="data-[state=active]:text-radio-accent">Customize</TabsTrigger>
              <TabsTrigger value="shows" className="data-[state=active]:text-radio-accent">Shows</TabsTrigger>
              <TabsTrigger value="podcasts" className="data-[state=active]:text-radio-accent">Podcasts</TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:text-radio-accent">Users</TabsTrigger>
              <TabsTrigger value="blog" className="data-[state=active]:text-radio-accent">Blog</TabsTrigger>
              <TabsTrigger value="pages" className="data-[state=active]:text-radio-accent">Pages</TabsTrigger>
              <TabsTrigger value="announcements" className="data-[state=active]:text-radio-accent">Announcements</TabsTrigger>
              <TabsTrigger value="banners" className="data-[state=active]:text-radio-accent">Banners</TabsTrigger>
              <TabsTrigger value="ads" className="data-[state=active]:text-radio-accent">Ads</TabsTrigger>
              <TabsTrigger value="ad-requests" className="data-[state=active]:text-radio-accent">Ad Requests</TabsTrigger>
              <TabsTrigger value="media" className="data-[state=active]:text-radio-accent">Media</TabsTrigger>
              <TabsTrigger value="social-api" className="data-[state=active]:text-radio-accent">Social Media API</TabsTrigger>
              <TabsTrigger value="newsletter" className="data-[state=active]:text-radio-accent">Newsletter</TabsTrigger>
              <TabsTrigger value="recorded-shows" className="data-[state=active]:text-radio-accent">Recorded Shows</TabsTrigger>
              
              <TabsTrigger value="settings" className="data-[state=active]:text-radio-accent">Settings</TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        <div className="container mx-auto px-6 py-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-radio-accent mb-4 mx-auto"></div>
                <p className="text-muted-foreground">Loading settings...</p>
              </div>
            </div>
          ) : (
            <>
              <TabsContent value="analytics">
                <AnalyticsTab />
              </TabsContent>
              
              <TabsContent value="customize">
                <SiteCustomizationTab />
              </TabsContent>
              
              <TabsContent value="shows">
                <ShowsTab />
              </TabsContent>
              
              <TabsContent value="podcasts">
                <PodcastsTab />
              </TabsContent>
              
              <TabsContent value="users">
                <UsersTab />
              </TabsContent>
              
              <TabsContent value="blog">
                <BlogPostsTab />
              </TabsContent>
              
              <TabsContent value="pages">
                <PagesTab />
              </TabsContent>
              
              <TabsContent value="announcements">
                <AnnouncementsTab />
              </TabsContent>
              
              <TabsContent value="banners">
                <BannersTab />
              </TabsContent>
              
              <TabsContent value="ads">
                <AdsTab />
              </TabsContent>
              
              <TabsContent value="ad-requests">
                <AdRequestsTab />
              </TabsContent>
              
              <TabsContent value="media">
                <MediaTab />
              </TabsContent>
              
              <TabsContent value="social-api">
                <SocialMediaApiTab />
              </TabsContent>
              
              <TabsContent value="newsletter">
                <NewsletterTab />
              </TabsContent>
              
              <TabsContent value="recorded-shows">
                <RecordedShowsTab />
              </TabsContent>

              <TabsContent value="settings">
                <SettingsTab 
                  settings={dashboardSettings}
                  onSaveSettings={handleSaveSettings}
                />
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
