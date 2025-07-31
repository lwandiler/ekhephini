import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
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
  TrendingUp
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');

  // Mock data for the dashboard
  const stats = [
    {
      title: "Total Listeners",
      value: "2,345",
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Live Listeners", 
      value: "567",
      change: "+8%",
      icon: Radio,
      color: "text-green-600"
    },
    {
      title: "Shows This Week",
      value: "24",
      change: "+2",
      icon: Calendar,
      color: "text-purple-600"
    },
    {
      title: "Revenue",
      value: "$3,200",
      change: "+15%",
      icon: DollarSign,
      color: "text-yellow-600"
    }
  ];

  const recentActivity = [
    { action: "New listener joined", time: "2 minutes ago", type: "user" },
    { action: "Show 'Morning Vibes' started", time: "15 minutes ago", type: "show" },
    { action: "New comment on blog post", time: "1 hour ago", type: "comment" },
    { action: "Podcast uploaded successfully", time: "2 hours ago", type: "podcast" }
  ];

  const quickActions = [
    { 
      title: "Start Live Broadcast",
      description: "Begin broadcasting live to your audience",
      icon: Radio,
      action: () => alert("Live broadcast feature coming soon!")
    },
    {
      title: "Upload Podcast",
      description: "Add a new podcast episode",
      icon: Music,
      action: () => alert("Podcast upload feature coming soon!")
    },
    {
      title: "Schedule Show",
      description: "Plan your next radio show",
      icon: Calendar,
      action: () => alert("Show scheduling feature coming soon!")
    },
    {
      title: "View Analytics",
      description: "Check your station's performance",
      icon: BarChart3,
      action: () => alert("Analytics feature coming soon!")
    }
  ];

  const renderOverview = () => (
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for managing your radio station</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-accent"
                onClick={action.action}
              >
                <action.icon className="h-6 w-6" />
                <div className="text-center">
                  <p className="font-medium text-sm">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Live Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your radio station</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Station Status</CardTitle>
            <CardDescription>Current broadcast information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Broadcast Status</span>
                <Badge className="bg-green-100 text-green-800">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                  Live
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Show</span>
                <span className="text-sm text-muted-foreground">Morning Vibes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Next Show</span>
                <span className="text-sm text-muted-foreground">Afternoon Mix (2:00 PM)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Server Health</span>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Excellent
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const menuItems = [
    { id: 'overview', title: 'Overview', icon: BarChart3 },
    { id: 'shows', title: 'Shows', icon: Calendar },
    { id: 'podcasts', title: 'Podcasts', icon: Music },
    { id: 'listeners', title: 'Listeners', icon: Users },
    { id: 'content', title: 'Content', icon: FileText },
    { id: 'media', title: 'Media Library', icon: ImageIcon },
    { id: 'messages', title: 'Messages', icon: MessageSquare },
    { id: 'settings', title: 'Settings', icon: Settings },
  ];

  const renderComingSoon = (title: string) => (
    <Card>
      <CardContent className="p-12 text-center">
        <div className="space-y-4">
          <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground" />
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            This feature is currently under development. Check back soon for updates!
          </p>
          <Button variant="outline" onClick={() => setActiveSection('overview')}>
            Back to Overview
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r min-h-screen p-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold mb-6">Admin Dashboard</h2>
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveSection(item.id)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">
                {menuItems.find(item => item.id === activeSection)?.title || 'Dashboard'}
              </h1>
              <p className="text-muted-foreground">
                Manage your radio station from this central dashboard
              </p>
            </div>

            {activeSection === 'overview' && renderOverview()}
            {activeSection !== 'overview' && renderComingSoon(menuItems.find(item => item.id === activeSection)?.title || 'Feature')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;