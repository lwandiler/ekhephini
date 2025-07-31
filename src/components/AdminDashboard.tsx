import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  
  // State for managing data
  const [shows, setShows] = useState([
    { id: 1, title: "Morning Drive", host: "John Smith", time: "06:00 - 09:00", status: "Live" },
    { id: 2, title: "Lunch Break", host: "Sarah Johnson", time: "12:00 - 14:00", status: "Upcoming" },
    { id: 3, title: "Evening Mix", host: "Mike Davis", time: "18:00 - 20:00", status: "Scheduled" },
  ]);
  
  const [users, setUsers] = useState([
    { id: 1, name: "John Smith", email: "john@station.com", role: "DJ", status: "Active" },
    { id: 2, name: "Sarah Johnson", email: "sarah@station.com", role: "Host", status: "Active" },
    { id: 3, name: "Mike Davis", email: "mike@station.com", role: "Producer", status: "Inactive" },
  ]);

  // State for forms
  const [showNewShowForm, setShowNewShowForm] = useState(false);
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [newShow, setNewShow] = useState({ title: '', host: '', time: '' });
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'DJ' });

  // Handlers
  const handleAddShow = () => {
    if (newShow.title && newShow.host && newShow.time) {
      const show = {
        id: shows.length + 1,
        title: newShow.title,
        host: newShow.host,
        time: newShow.time,
        status: 'Scheduled'
      };
      setShows([...shows, show]);
      setNewShow({ title: '', host: '', time: '' });
      setShowNewShowForm(false);
    }
  };

  const handleDeleteShow = (id: number) => {
    setShows(shows.filter(show => show.id !== id));
  };

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const user = {
        id: users.length + 1,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: 'Active'
      };
      setUsers([...users, user]);
      setNewUser({ name: '', email: '', role: 'DJ' });
      setShowNewUserForm(false);
    }
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleSaveSettings = () => {
    alert('Settings saved successfully!');
  };

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
      value: "128",
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
                    <p className="text-sm text-muted-foreground">{show.host} • {show.time}</p>
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
        <Button onClick={() => setShowNewShowForm(!showNewShowForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Show
        </Button>
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
                value={newShow.time}
                onChange={(e) => setNewShow({...newShow, time: e.target.value})}
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
                    <p className="text-sm text-muted-foreground">Time: {show.time}</p>
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
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground">Role: {user.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                    {user.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user.id)}>
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
              <Input id="station-name" defaultValue="Your Radio Station" />
            </div>
            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" defaultValue="The best music, all day long" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" defaultValue="Your favorite radio station..." />
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
              <Input id="stream-url" defaultValue="https://stream.yourstation.com/live" />
            </div>
            <div>
              <Label htmlFor="backup-url">Backup Stream URL</Label>
              <Input id="backup-url" defaultValue="https://backup.yourstation.com/live" />
            </div>
            <div>
              <Label htmlFor="bitrate">Bitrate</Label>
              <Input id="bitrate" defaultValue="128kbps" />
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
          <TabsList className="grid w-full grid-cols-6">
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
          <TabsContent value="content">{renderContent()}</TabsContent>
          <TabsContent value="analytics">{renderAnalytics()}</TabsContent>
          <TabsContent value="settings">{renderSettings()}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;