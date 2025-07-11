
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Megaphone, Calendar, Plus, Trash, Edit } from 'lucide-react';

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  important: boolean;
  category: string;
}

const sampleAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "Station Maintenance Schedule",
    content: "Our station will be undergoing routine maintenance on May 15th from 2:00 AM to 5:00 AM.",
    date: "2025-05-10",
    important: true,
    category: "Technical"
  },
  {
    id: 2,
    title: "Special Guest Announcement",
    content: "We're thrilled to announce that international music sensation Taylor Swift will be joining us live in the studio next Wednesday.",
    date: "2025-05-08",
    important: true,
    category: "Programming"
  }
];

const AnnouncementsTab = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(sampleAnnouncements);
  const [showForm, setShowForm] = useState(false);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDeleteAnnouncement = (id: number) => {
    setAnnouncements(announcements.filter(announcement => announcement.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Announcements</h2>
        <Button 
          className="bg-radio-accent hover:bg-radio-accent/80 flex items-center gap-2"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={16} />
          Add New Announcement
        </Button>
      </div>
      
      <p className="text-muted-foreground">Create and manage announcements for your radio station.</p>
      
      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-medium mb-4">New Announcement</h3>
          {/* Form would go here in a real implementation */}
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Title" 
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <textarea 
              placeholder="Content" 
              rows={4} 
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <div className="flex gap-4">
              <input 
                type="date" 
                className="p-2 border border-gray-300 rounded-md" 
              />
              <select className="p-2 border border-gray-300 rounded-md">
                <option value="">Select category</option>
                <option value="Technical">Technical</option>
                <option value="Programming">Programming</option>
                <option value="Community">Community</option>
              </select>
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Important
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button className="bg-radio-accent hover:bg-radio-accent/80">Save</Button>
            </div>
          </div>
        </div>
      )}
      
      {announcements.length > 0 ? (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div 
              key={announcement.id} 
              className={`border-l-4 ${
                announcement.important 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-radio-accent bg-gray-50'
              } rounded-r-lg shadow-sm p-4 hover:shadow-md transition-shadow`}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-radio-blue mb-2 flex items-center">
                  {announcement.important && (
                    <Megaphone size={16} className="inline mr-2 text-red-500" />
                  )}
                  {announcement.title}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="bg-radio-blue/10 px-2 py-1 rounded text-xs">
                    {announcement.category}
                  </div>
                  <button className="text-gray-500 hover:text-blue-600">
                    <Edit size={16} />
                  </button>
                  <button 
                    className="text-gray-500 hover:text-red-600"
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center text-xs text-gray-500 mb-2">
                <Calendar size={14} className="mr-1" />
                <span>{formatDate(announcement.date)}</span>
              </div>
              
              <p className="text-sm text-gray-700">
                {announcement.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-100 p-4 rounded-md">
          <p className="text-sm text-gray-500">No announcements yet.</p>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsTab;
