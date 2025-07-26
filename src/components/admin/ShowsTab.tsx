
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchShows, type Show } from '@/services/api/showsService';
import BulkShowsUpload from './BulkShowsUpload';
import { MediaPickerModal } from './MediaPickerModal';

const ShowsTab = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingShow, setEditingShow] = useState<Show | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  
  useEffect(() => {
    loadShows();
  }, []);

  const loadShows = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('shows')
        .select('*')
        .order('day_of_week')
        .order('start_time');

      if (error) throw error;
      setShows(data || []);
    } catch (error) {
      console.error('Error loading shows:', error);
      toast.error('Failed to load shows');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const showData = {
      title: formData.get('show-title') as string,
      host: formData.get('show-host') as string,
      day_of_week: formData.get('show-day') as string,
      start_time: formData.get('show-start-time') as string,
      end_time: formData.get('show-end-time') as string,
      description: formData.get('show-description') as string,
      image_url: selectedImageUrl || null,
      active: true
    };

    try {
      if (editingShow) {
        // Update existing show
        const { error } = await supabase
          .from('shows')
          .update(showData)
          .eq('id', editingShow.id);

        if (error) throw error;
        toast.success('Show updated successfully!');
      } else {
        // Create new show
        const { error } = await supabase
          .from('shows')
          .insert([showData]);

        if (error) throw error;
        toast.success('Show created successfully!');
      }

      setShowForm(false);
      setEditingShow(null);
      setSelectedImageUrl('');
      loadShows(); // Reload the shows list
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error saving show:', error);
      toast.error('Failed to save show');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (show: Show) => {
    setEditingShow(show);
    setSelectedImageUrl(show.image_url || '');
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this show?')) return;

    try {
      const { error } = await supabase
        .from('shows')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Show deleted successfully!');
      loadShows(); // Reload the shows list
    } catch (error) {
      console.error('Error deleting show:', error);
      toast.error('Failed to delete show');
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatTimeRange = (startTime: string, endTime: string) => {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Shows</h2>
        <Button 
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) {
              setEditingShow(null);
              setSelectedImageUrl('');
            }
          }}
          className="bg-radio-accent hover:bg-radio-accent/80"
        >
          {showForm ? "Cancel" : "Add New Show"}
        </Button>
      </div>
      
      {/* Bulk Upload Section */}
      <BulkShowsUpload onUploadComplete={loadShows} />
      
      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingShow ? 'Edit Show' : 'Add New Show'}</CardTitle>
            <CardDescription>{editingShow ? 'Update the show details.' : 'Create a new show for your radio station.'}</CardDescription>
          </CardHeader>
          <form onSubmit={handleFormSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="show-title">Show Title</Label>
                  <Input id="show-title" name="show-title" placeholder="Enter show title" defaultValue={editingShow?.title || ''} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="show-host">Host</Label>
                  <Input id="show-host" name="show-host" placeholder="Enter host name" defaultValue={editingShow?.host || ''} required />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="show-day">Day</Label>
                  <select id="show-day" name="show-day" className="w-full border border-gray-300 rounded-md h-10 px-3" defaultValue={editingShow?.day_of_week || ''} required>
                    <option value="">Select day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                    <option value="Weekdays">Weekdays</option>
                    <option value="Weekends">Weekends</option>
                    <option value="Daily">Daily</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="show-start-time">Start Time</Label>
                  <Input id="show-start-time" name="show-start-time" type="time" defaultValue={editingShow?.start_time || ''} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="show-end-time">End Time</Label>
                  <Input id="show-end-time" name="show-end-time" type="time" defaultValue={editingShow?.end_time || ''} required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="show-description">Description</Label>
                <Textarea id="show-description" name="show-description" placeholder="Enter show description" defaultValue={editingShow?.description || ''} rows={4} />
              </div>
              
              <div className="space-y-2">
                <Label>Show Image</Label>
                <div className="flex items-center gap-4">
                  {selectedImageUrl && (
                    <img 
                      src={selectedImageUrl} 
                      alt="Show preview" 
                      className="w-20 h-20 object-cover rounded-md border"
                    />
                  )}
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowMediaPicker(true)}
                  >
                    {selectedImageUrl ? 'Change Image' : 'Select Image'}
                  </Button>
                  {selectedImageUrl && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => setSelectedImageUrl('')}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => {
                setShowForm(false);
                setEditingShow(null);
                setSelectedImageUrl('');
              }}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-radio-accent hover:bg-radio-accent/80">
                {submitting ? 'Saving...' : (editingShow ? 'Update Show' : 'Save Show')}
              </Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : shows.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No shows found. Click "Add New Show" to create your first show.</p>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4">Show</th>
                  <th className="text-left py-3 px-4">Host</th>
                  <th className="text-left py-3 px-4">Day</th>
                  <th className="text-left py-3 px-4">Time</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shows.map((show) => (
                  <tr key={show.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{show.title}</td>
                    <td className="py-3 px-4">{show.host}</td>
                    <td className="py-3 px-4">{show.day_of_week}</td>
                    <td className="py-3 px-4">{formatTimeRange(show.start_time, show.end_time)}</td>
                    <td className="py-3 px-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-radio-blue mr-2"
                        onClick={() => handleEdit(show)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(show.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      
      <MediaPickerModal
        open={showMediaPicker}
        onOpenChange={setShowMediaPicker}
        onSelect={setSelectedImageUrl}
        mediaType="image"
      />
    </div>
  );
};

export default ShowsTab;
