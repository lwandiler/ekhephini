import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  LayoutDashboard,
  Users, 
  Radio, 
  Settings, 
  BarChart3, 
  FileText, 
  Calendar,
  Music,
  MessageSquare,
  Image as ImageIcon,
  Activity,
  DollarSign,
  TrendingUp,
  Mic,
  PlayCircle,
  PauseCircle,
  Volume2,
  UserPlus,
  Mail,
  Bell,
  Globe,
  Shield,
  Database,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { toast } = useToast();
  
  // State for managing data from Supabase
  const [shows, setShows] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    station_name: '',
    tagline: '',
    description: '',
    stream_url: '',
    backup_stream_url: '',
    bitrate: ''
  });
  const [loading, setLoading] = useState(true);

  // State for forms
  const [showNewShowForm, setShowNewShowForm] = useState(false);
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [showNewPodcastForm, setShowNewPodcastForm] = useState(false);
  const [showBulkUploadDialog, setShowBulkUploadDialog] = useState(false);
  const [newShow, setNewShow] = useState({ title: '', host: '', time_slot: '' });
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'DJ' });
  const [newPodcast, setNewPodcast] = useState({ name: '', podcast_link: '', description: '', thumbnail: null as File | null });
  const [bulkUploadFile, setBulkUploadFile] = useState<File | null>(null);
  const [bulkUploadProgress, setBulkUploadProgress] = useState(0);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);

  // Load data from Supabase
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load shows
      const { data: showsData } = await supabase
        .from('shows')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Load user profiles
      const { data: usersData } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Load authenticated users (profiles table)
      const { data: authUsersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Load podcasts
      const { data: podcastsData } = await supabase
        .from('podcasts')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Load station settings
      const { data: settingsData } = await supabase
        .from('station_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (showsData) setShows(showsData);
      if (podcastsData) setPodcasts(podcastsData);
      
      // Combine both user types
      const allUsers = [];
      if (usersData) {
        allUsers.push(...usersData.map(user => ({ ...user, type: 'staff' })));
      }
      if (authUsersData) {
        allUsers.push(...authUsersData.map(user => ({ ...user, type: 'authenticated', email: user.user_id })));
      }
      setUsers(allUsers);
      
      if (settingsData) setSettings(settingsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load data from database."
      });
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleAddShow = async () => {
    if (newShow.title && newShow.host && newShow.time_slot) {
      try {
        const { data, error } = await supabase
          .from('shows')
          .insert([{
            title: newShow.title,
            host: newShow.host,
            time_slot: newShow.time_slot,
            status: 'Scheduled'
          }])
          .select();

        if (error) throw error;

        if (data) {
          setShows([data[0], ...shows]);
          setNewShow({ title: '', host: '', time_slot: '' });
          setShowNewShowForm(false);
          toast({
            title: "Success",
            description: "Show added successfully!"
          });
        }
      } catch (error) {
        console.error('Error adding show:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add show."
        });
      }
    }
  };

  const handleDeleteShow = async (id: string) => {
    try {
      const { error } = await supabase
        .from('shows')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setShows(shows.filter(show => show.id !== id));
      toast({
        title: "Success",
        description: "Show deleted successfully!"
      });
    } catch (error) {
      console.error('Error deleting show:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete show."
      });
    }
  };

  const handleAddUser = async () => {
    if (newUser.name && newUser.email) {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .insert([{
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            status: 'Active'
          }])
          .select();

        if (error) throw error;

        if (data) {
          setUsers([{...data[0], type: 'staff'}, ...users]);
          setNewUser({ name: '', email: '', role: 'DJ' });
          setShowNewUserForm(false);
          toast({
            title: "Success",
            description: "User added successfully!"
          });
        }
      } catch (error) {
        console.error('Error adding user:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add user."
        });
      }
    }
  };

  const handleDeleteUser = async (id: string, userType: string) => {
    try {
      // Only allow deletion of staff users (user_profiles), not authenticated users
      if (userType !== 'staff') {
        toast({
          variant: "destructive",
          title: "Cannot delete",
          description: "Authenticated users cannot be deleted from this interface."
        });
        return;
      }

      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setUsers(users.filter(user => user.id !== id));
      toast({
        title: "Success",
        description: "User deleted successfully!"
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user."
      });
    }
  };

  // Podcast handlers
  const handleAddPodcast = async () => {
    if (newPodcast.name && newPodcast.podcast_link) {
      setIsUploadingThumbnail(true);
      
      try {
        let thumbnailUrl = '';
        
        // Upload thumbnail if provided
        if (newPodcast.thumbnail) {
          const fileExt = newPodcast.thumbnail.name.split('.').pop();
          const fileName = `${Date.now()}.${fileExt}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('podcast-thumbnails')
            .upload(fileName, newPodcast.thumbnail);

          if (uploadError) throw uploadError;

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('podcast-thumbnails')
            .getPublicUrl(fileName);
          
          thumbnailUrl = publicUrl;
        }

        // Insert podcast data
        const { data, error } = await supabase
          .from('podcasts')
          .insert([{
            name: newPodcast.name,
            podcast_link: newPodcast.podcast_link,
            description: newPodcast.description,
            thumbnail_url: thumbnailUrl
          }])
          .select();

        if (error) throw error;

        if (data) {
          setPodcasts([data[0], ...podcasts]);
          setNewPodcast({ name: '', podcast_link: '', description: '', thumbnail: null });
          setShowNewPodcastForm(false);
          toast({
            title: "Success",
            description: "Podcast added successfully!"
          });
        }
      } catch (error) {
        console.error('Error adding podcast:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add podcast."
        });
      } finally {
        setIsUploadingThumbnail(false);
      }
    }
  };

  const handleDeletePodcast = async (id: string) => {
    try {
      const { error } = await supabase
        .from('podcasts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPodcasts(podcasts.filter(podcast => podcast.id !== id));
      toast({
        title: "Success",
        description: "Podcast deleted successfully!"
      });
    } catch (error) {
      console.error('Error deleting podcast:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete podcast."
      });
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkUploadFile) return;

    setIsProcessingBulk(true);
    setBulkUploadProgress(0);

    try {
      const text = await bulkUploadFile.text();
      console.log('CSV text content:', text.substring(0, 500)); // Debug: first 500 chars
      
      const lines = text.split('\n').filter(line => line.trim());
      console.log('Total lines found:', lines.length);
      console.log('First few lines:', lines.slice(0, 3));
      
      // Skip header line
      const dataLines = lines.slice(1);
      
      if (dataLines.length === 0) {
        throw new Error('No data found in CSV file');
      }

      const successfulShows = [];
      const failedShows = [];

      for (let i = 0; i < dataLines.length; i++) {
        const line = dataLines[i];
        console.log(`Processing line ${i + 2}:`, line);
        
        // Better CSV parsing - handle quoted fields and detect delimiter
        const delimiter = line.includes(';') ? ';' : ',';
        const csvValues = [];
        let currentValue = '';
        let inQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === delimiter && !inQuotes) {
            csvValues.push(currentValue.trim());
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        csvValues.push(currentValue.trim()); // Add the last value
        
        console.log('Parsed values:', csvValues);
        
        const [title, host, day_of_week, start_time, end_time, description, image_url] = csvValues;
        
        console.log('Extracted fields:', {
          title,
          host,
          day_of_week,
          start_time,
          end_time,
          description,
          image_url
        });
        
        if (title && host && day_of_week && start_time && end_time) {
          try {
            const showData = {
              title,
              host,
              day_of_week,
              start_time,
              end_time,
              description: description || '',
              image_url: image_url || '',
              time_slot: `${start_time} - ${end_time}`, // Keep for backward compatibility
              status: 'Scheduled'
            };
            
            console.log('Inserting show data:', showData);
            
            const { data, error } = await supabase
              .from('shows')
              .insert([showData])
              .select();

            if (error) {
              console.error('Supabase error:', error);
              throw error;
            }
            
            if (data) {
              console.log('Successfully inserted:', data[0]);
              successfulShows.push(data[0]);
            }
          } catch (error) {
            console.error(`Error inserting show on line ${i + 2}:`, error);
            failedShows.push({ line: i + 2, title, error: error.message });
          }
        } else {
          const missingFields = [];
          if (!title) missingFields.push('title');
          if (!host) missingFields.push('host');
          if (!day_of_week) missingFields.push('day_of_week');
          if (!start_time) missingFields.push('start_time');
          if (!end_time) missingFields.push('end_time');
          
          console.log(`Line ${i + 2} missing fields:`, missingFields);
          failedShows.push({ 
            line: i + 2, 
            title: title || 'Unknown', 
            error: `Missing required fields: ${missingFields.join(', ')}` 
          });
        }

        setBulkUploadProgress(((i + 1) / dataLines.length) * 100);
      }

      console.log('Upload complete. Successful:', successfulShows.length, 'Failed:', failedShows.length);
      console.log('Failed shows:', failedShows);

      // Update local state with successful shows
      if (successfulShows.length > 0) {
        setShows([...successfulShows, ...shows]);
      }

      // Show results
      if (failedShows.length === 0) {
        toast({
          title: "Bulk upload successful",
          description: `${successfulShows.length} shows uploaded successfully!`
        });
      } else {
        toast({
          title: "Bulk upload completed with errors",
          description: `${successfulShows.length} shows uploaded successfully, ${failedShows.length} failed.`,
          variant: "destructive"
        });
        console.log('Failed shows details:', failedShows);
      }

      setShowBulkUploadDialog(false);
      setBulkUploadFile(null);
    } catch (error) {
      console.error('Error processing bulk upload:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to process the uploaded file."
      });
    } finally {
      setIsProcessingBulk(false);
      setBulkUploadProgress(0);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const { error } = await supabase
        .from('station_settings')
        .update({
          station_name: settings.station_name,
          tagline: settings.tagline,
          description: settings.description,
          stream_url: settings.stream_url,
          backup_stream_url: settings.backup_stream_url,
          bitrate: settings.bitrate
        })
        .eq('id', settings.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Settings saved successfully!"
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings."
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Mock data
  const stats = [
    {
      title: "Live Listeners",
      value: "1,234",
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Total Shows", 
      value: shows.length.toString(),
      change: "+3",
      icon: Radio,
      color: "text-green-600"
    },
    {
      title: "Podcasts",
      value: podcasts.length.toString(),
      change: "+8",
      icon: Music,
      color: "text-purple-600"
    },
    {
      title: "Monthly Revenue",
      value: "$12,580",
      change: "+15%",
      icon: DollarSign,
      color: "text-yellow-600"
    }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Broadcasting Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Live Broadcasting
          </CardTitle>
          <CardDescription>Control your live stream and current broadcast</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-semibold">Morning Drive Show</p>
                <p className="text-sm text-muted-foreground">Host: John Smith</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Volume2 className="h-4 w-4 mr-2" />
                Audio
              </Button>
              <Button variant="outline" size="sm">
                <PauseCircle className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button variant="destructive" size="sm">
                End Stream
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Upcoming Shows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Shows</CardTitle>
            <CardDescription>Latest radio show schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shows.slice(0, 3).map((show) => (
                <div key={show.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{show.title}</p>
                    <p className="text-sm text-muted-foreground">{show.host} • {show.time_slot}</p>
                  </div>
                  <Badge variant={show.status === 'Live' ? 'default' : 'secondary'}>
                    {show.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex flex-col" onClick={() => setActiveTab('shows')}>
                <Plus className="h-6 w-6 mb-2" />
                Add Show
              </Button>
              <Button variant="outline" className="h-20 flex flex-col" onClick={() => setActiveTab('content')}>
                <Upload className="h-6 w-6 mb-2" />
                Upload Media
              </Button>
              <Button variant="outline" className="h-20 flex flex-col" onClick={() => setActiveTab('users')}>
                <UserPlus className="h-6 w-6 mb-2" />
                Add User
              </Button>
              <Button variant="outline" className="h-20 flex flex-col" onClick={() => setActiveTab('analytics')}>
                <BarChart3 className="h-6 w-6 mb-2" />
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderShows = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Show Management</h3>
        <div className="flex gap-2">
          <Dialog open={showBulkUploadDialog} onOpenChange={setShowBulkUploadDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-white">
              <DialogHeader>
                <DialogTitle>Bulk Upload Shows</DialogTitle>
                <DialogDescription>
                  Upload a CSV file with show data. Format: title, host, day_of_week, start_time, end_time, description, image_url
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="csv-file">CSV File</Label>
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv,.txt"
                    onChange={(e) => setBulkUploadFile(e.target.files?.[0] || null)}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    CSV format: title, host, day_of_week, start_time, end_time, description, image_url
                  </p>
                </div>

                {/* Sample CSV format */}
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <p className="font-medium mb-1">Sample CSV format:</p>
                  <code className="text-xs">
                    title,host,day_of_week,start_time,end_time,description,image_url<br/>
                    Morning Drive,John Smith,Monday,06:00,09:00,Great morning show with music and news,<br/>
                    Afternoon Vibes,Jane Doe,Tuesday,14:00,16:00,Relaxing afternoon music and talk,
                  </code>
                </div>

                {isProcessingBulk && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing...</span>
                      <span>{Math.round(bulkUploadProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${bulkUploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    onClick={handleBulkUpload} 
                    disabled={!bulkUploadFile || isProcessingBulk}
                    className="flex-1"
                  >
                    {isProcessingBulk ? 'Processing...' : 'Upload Shows'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowBulkUploadDialog(false)}
                    disabled={isProcessingBulk}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button onClick={() => setShowNewShowForm(!showNewShowForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Show
          </Button>
        </div>
      </div>

      {showNewShowForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Show</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="show-title">Show Title</Label>
              <Input 
                id="show-title" 
                value={newShow.title}
                onChange={(e) => setNewShow({...newShow, title: e.target.value})}
                placeholder="Enter show title" 
              />
            </div>
            <div>
              <Label htmlFor="show-host">Host</Label>
              <Input 
                id="show-host" 
                value={newShow.host}
                onChange={(e) => setNewShow({...newShow, host: e.target.value})}
                placeholder="Enter host name" 
              />
            </div>
            <div>
              <Label htmlFor="show-time">Time</Label>
              <Input 
                id="show-time" 
                value={newShow.time_slot}
                onChange={(e) => setNewShow({...newShow, time_slot: e.target.value})}
                placeholder="e.g., 06:00 - 09:00" 
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddShow}>Add Show</Button>
              <Button variant="outline" onClick={() => setShowNewShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {shows.map((show) => (
              <div key={show.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Radio className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">{show.title}</p>
                    <p className="text-sm text-muted-foreground">Host: {show.host}</p>
                    <p className="text-sm text-muted-foreground">Time: {show.time_slot}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={show.status === 'Live' ? 'default' : 'secondary'}>
                    {show.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteShow(show.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">User Management</h3>
        <Button onClick={() => setShowNewUserForm(!showNewUserForm)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </div>

      {showNewUserForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New User</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="user-name">Name</Label>
              <Input 
                id="user-name" 
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                placeholder="Enter user name" 
              />
            </div>
            <div>
              <Label htmlFor="user-email">Email</Label>
              <Input 
                id="user-email" 
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                placeholder="Enter email address" 
              />
            </div>
            <div>
              <Label htmlFor="user-role">Role</Label>
              <select 
                id="user-role" 
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="DJ">DJ</option>
                <option value="Host">Host</option>
                <option value="Producer">Producer</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddUser}>Add User</Button>
              <Button variant="outline" onClick={() => setShowNewUserForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    user.type === 'authenticated' 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
                      : 'bg-gradient-to-r from-green-500 to-blue-600'
                  }`}>
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">Role: {user.role}</p>
                      <Badge variant={user.type === 'authenticated' ? 'default' : 'outline'} className="text-xs">
                        {user.type === 'authenticated' ? 'Auth User' : 'Staff'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                    {user.status || 'Active'}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {user.type === 'staff' ? (
                    <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user.id, user.type || 'staff')}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled title="Cannot delete authenticated users">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPodcasts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Podcast Management</h3>
        <Button onClick={() => setShowNewPodcastForm(!showNewPodcastForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Podcast
        </Button>
      </div>

      {showNewPodcastForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Podcast</CardTitle>
            <CardDescription>Add a new podcast episode to your collection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="podcast-name">Show Name</Label>
              <Input 
                id="podcast-name" 
                value={newPodcast.name}
                onChange={(e) => setNewPodcast({...newPodcast, name: e.target.value})}
                placeholder="Enter podcast show name" 
              />
            </div>
            <div>
              <Label htmlFor="podcast-link">Podcast Link</Label>
              <Input 
                id="podcast-link" 
                type="url"
                value={newPodcast.podcast_link}
                onChange={(e) => setNewPodcast({...newPodcast, podcast_link: e.target.value})}
                placeholder="https://example.com/podcast-episode" 
              />
            </div>
            <div>
              <Label htmlFor="podcast-description">Description</Label>
              <Textarea 
                id="podcast-description" 
                value={newPodcast.description}
                onChange={(e) => setNewPodcast({...newPodcast, description: e.target.value})}
                placeholder="Enter podcast description..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="podcast-thumbnail">Thumbnail (Optional)</Label>
              <Input 
                id="podcast-thumbnail" 
                type="file"
                accept="image/*"
                onChange={(e) => setNewPodcast({...newPodcast, thumbnail: e.target.files?.[0] || null})}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload a thumbnail image for the podcast episode
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleAddPodcast} 
                disabled={isUploadingThumbnail || !newPodcast.name || !newPodcast.podcast_link}
              >
                {isUploadingThumbnail ? 'Uploading...' : 'Add Podcast'}
              </Button>
              <Button variant="outline" onClick={() => setShowNewPodcastForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardContent className="p-6">
          {podcasts.length === 0 ? (
            <div className="text-center py-8">
              <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No podcasts added yet</p>
              <p className="text-sm text-gray-400">Start by adding your first podcast episode</p>
            </div>
          ) : (
            <div className="space-y-4">
              {podcasts.map((podcast) => (
                <div key={podcast.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center overflow-hidden">
                      {podcast.thumbnail_url ? (
                        <img 
                          src={podcast.thumbnail_url} 
                          alt={podcast.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Music className="h-8 w-8 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{podcast.name}</p>
                      <p className="text-sm text-muted-foreground mb-2">{podcast.description}</p>
                      <a 
                        href={podcast.podcast_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm underline"
                      >
                        Listen to episode →
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      Episode
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeletePodcast(podcast.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Content Management</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Podcasts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">128</p>
            <p className="text-sm text-muted-foreground">Total episodes</p>
            <Button className="w-full mt-4" variant="outline">
              Manage Podcasts
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Blog Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">45</p>
            <p className="text-sm text-muted-foreground">Published articles</p>
            <Button className="w-full mt-4" variant="outline">
              Manage Blog
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Media Library
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">892</p>
            <p className="text-sm text-muted-foreground">Files uploaded</p>
            <Button className="w-full mt-4" variant="outline">
              Browse Media
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Station Settings</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="station-name">Station Name</Label>
              <Input 
                id="station-name" 
                value={settings.station_name}
                onChange={(e) => setSettings({...settings, station_name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Input 
                id="tagline" 
                value={settings.tagline}
                onChange={(e) => setSettings({...settings, tagline: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={settings.description}
                onChange={(e) => setSettings({...settings, description: e.target.value})}
              />
            </div>
            <Button onClick={handleSaveSettings}>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Streaming Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="stream-url">Stream URL</Label>
              <Input 
                id="stream-url" 
                value={settings.stream_url}
                onChange={(e) => setSettings({...settings, stream_url: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="backup-url">Backup Stream URL</Label>
              <Input 
                id="backup-url" 
                value={settings.backup_stream_url || ''}
                onChange={(e) => setSettings({...settings, backup_stream_url: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="bitrate">Bitrate</Label>
              <Input 
                id="bitrate" 
                value={settings.bitrate}
                onChange={(e) => setSettings({...settings, bitrate: e.target.value})}
              />
            </div>
            <Button onClick={handleSaveSettings}>Update Stream</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Analytics & Reports</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Listeners</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1,234</p>
            <p className="text-sm text-green-600">↗ +12% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Peak Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">08:00</p>
            <p className="text-sm text-muted-foreground">Morning drive time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Location</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">NYC</p>
            <p className="text-sm text-muted-foreground">32% of listeners</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listening Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Analytics chart would go here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold">Radio Station Admin</h1>
          <p className="text-muted-foreground">Manage your radio station from this dashboard</p>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="shows" className="flex items-center gap-2">
              <Radio className="h-4 w-4" />
              Shows
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="podcasts" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              Podcasts
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">{renderDashboard()}</TabsContent>
          <TabsContent value="shows">{renderShows()}</TabsContent>
          <TabsContent value="users">{renderUsers()}</TabsContent>
          <TabsContent value="podcasts">{renderPodcasts()}</TabsContent>
          <TabsContent value="content">{renderContent()}</TabsContent>
          <TabsContent value="analytics">{renderAnalytics()}</TabsContent>
          <TabsContent value="settings">{renderSettings()}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;