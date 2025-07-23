import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Megaphone, Calendar, Plus, Trash2, Edit, AlertTriangle } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type Announcement = Tables<'announcements'>;

const AnnouncementsTab = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error loading announcements:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load announcements. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const announcementData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      date: formData.get('date') as string,
      category: formData.get('category') as string,
      important: formData.get('important') === 'on',
      active: true,
    };

    try {
      if (editingAnnouncement) {
        const { error } = await supabase
          .from('announcements')
          .update(announcementData)
          .eq('id', editingAnnouncement.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Announcement updated successfully!",
        });
      } else {
        const { error } = await supabase
          .from('announcements')
          .insert([announcementData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Announcement created successfully!",
        });
      }

      setShowForm(false);
      setEditingAnnouncement(null);
      loadAnnouncements();
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error saving announcement:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save announcement. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setShowForm(true);
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the announcement "${title}"?\n\nThis action cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Announcement deleted successfully!",
      });
      loadAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete announcement. Please try again.",
      });
    }
  };

  const toggleStatus = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({ active })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Announcement ${active ? 'activated' : 'deactivated'} successfully!`,
      });
      loadAnnouncements();
    } catch (error) {
      console.error('Error updating announcement status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update announcement status. Please try again.",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingAnnouncement(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Manage Announcements</h2>
        <Button 
          onClick={() => {
            setShowForm(!showForm);
            setEditingAnnouncement(null);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {showForm ? 'Cancel' : 'Add New Announcement'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    defaultValue={editingAnnouncement?.title || ''}
                    placeholder="Enter announcement title"
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    required
                    defaultValue={editingAnnouncement?.date || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  name="content"
                  required
                  defaultValue={editingAnnouncement?.content || ''}
                  placeholder="Enter announcement content"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" defaultValue={editingAnnouncement?.category || ''}>
                    <SelectTrigger className="bg-white border-gray-300 text-black">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                      <SelectItem value="Technical" className="text-black hover:bg-gray-100">Technical</SelectItem>
                      <SelectItem value="Programming" className="text-black hover:bg-gray-100">Programming</SelectItem>
                      <SelectItem value="Community" className="text-black hover:bg-gray-100">Community</SelectItem>
                      <SelectItem value="Events" className="text-black hover:bg-gray-100">Events</SelectItem>
                      <SelectItem value="General" className="text-black hover:bg-gray-100">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="important"
                    name="important"
                    defaultChecked={editingAnnouncement?.important || false}
                  />
                  <Label htmlFor="important" className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Mark as Important
                  </Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : (editingAnnouncement ? 'Update Announcement' : 'Create Announcement')}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Megaphone className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No announcements found. Create your first announcement to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div 
                  key={announcement.id} 
                  className={`border-l-4 rounded-r-lg shadow-sm p-4 transition-all ${
                    announcement.important 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-primary bg-muted/30'
                  } ${!announcement.active ? 'opacity-60' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {announcement.important && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                        <h3 className="text-lg font-semibold text-foreground">
                          {announcement.title}
                        </h3>
                        {!announcement.active && (
                          <Badge variant="secondary" className="text-xs">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(announcement.date)}</span>
                        </div>
                        {announcement.category && (
                          <Badge variant="outline" className="text-xs">
                            {announcement.category}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {announcement.content}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Switch
                        checked={announcement.active}
                        onCheckedChange={(checked) => toggleStatus(announcement.id, checked)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(announcement)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(announcement.id, announcement.title)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnnouncementsTab;