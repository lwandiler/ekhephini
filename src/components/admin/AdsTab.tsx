import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { MediaPickerModal } from './MediaPickerModal';
import { Trash2, Edit, Plus, Upload, Link, Image } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type Ad = Tables<'ads'>;

const AdsTab = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isUploading, handleMediaUpload } = useMediaUpload({
    mediaType: 'image',
    onUploadSuccess: (url) => {
      setImageUrl(url);
    }
  });

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAds(data || []);
    } catch (error) {
      console.error('Error loading ads:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load ads. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    // Convert duration to seconds based on unit
    const durationValue = parseInt(formData.get('duration_value') as string) || 30;
    const durationUnit = formData.get('duration_unit') as string || 'seconds';
    let durationInSeconds = durationValue;
    
    switch (durationUnit) {
      case 'minutes':
        durationInSeconds = durationValue * 60;
        break;
      case 'hours':
        durationInSeconds = durationValue * 3600;
        break;
      default:
        durationInSeconds = durationValue;
    }

    const adData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      image_url: imageUrl,
      click_url: formData.get('click_url') as string,
      position: formData.get('position') as string,
      priority: parseInt(formData.get('priority') as string) || 0,
      active: formData.get('active') === 'on',
      start_date: formData.get('start_date') as string || null,
      end_date: formData.get('end_date') as string || null,
      display_duration_seconds: durationInSeconds,
    };

    try {
      if (editingAd) {
        const { error } = await supabase
          .from('ads')
          .update(adData)
          .eq('id', editingAd.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Ad updated successfully!",
        });
      } else {
        const { error } = await supabase
          .from('ads')
          .insert([adData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Ad created successfully!",
        });
      }

      setShowForm(false);
      setEditingAd(null);
      setImageUrl('');
      setShowMediaPicker(false);
      loadAds();
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error saving ad:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save ad. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function to get duration values for editing
  const getDurationDisplay = (seconds: number | null) => {
    if (!seconds) return { value: 30, unit: 'seconds' };
    
    if (seconds >= 3600 && seconds % 3600 === 0) {
      return { value: seconds / 3600, unit: 'hours' };
    } else if (seconds >= 60 && seconds % 60 === 0) {
      return { value: seconds / 60, unit: 'minutes' };
    } else {
      return { value: seconds, unit: 'seconds' };
    }
  };

  const handleEdit = (ad: Ad) => {
    setEditingAd(ad);
    setImageUrl(ad.image_url || '');
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) return;

    try {
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Ad deleted successfully!",
      });
      loadAds();
    } catch (error) {
      console.error('Error deleting ad:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete ad. Please try again.",
      });
    }
  };

  const toggleStatus = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('ads')
        .update({ active })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Ad ${active ? 'activated' : 'deactivated'} successfully!`,
      });
      loadAds();
    } catch (error) {
      console.error('Error updating ad status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update ad status. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Advertisement Management</h2>
        <Button 
          onClick={() => {
            setShowForm(!showForm);
            setEditingAd(null);
            setImageUrl('');
            setShowMediaPicker(false);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {showForm ? 'Cancel' : 'Add New Ad'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingAd ? 'Edit Ad' : 'Create New Ad'}</CardTitle>
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
                    defaultValue={editingAd?.title || ''}
                    placeholder="Enter ad title"
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position *</Label>
                  <Select name="position" defaultValue={editingAd?.position || 'banner'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="banner">Banner</SelectItem>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                      <SelectItem value="footer">Footer</SelectItem>
                      <SelectItem value="header">Header</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Input
                    id="priority"
                    name="priority"
                    type="number"
                    min="0"
                    defaultValue={editingAd?.priority || 0}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    name="active"
                    defaultChecked={editingAd?.active ?? true}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingAd?.description || ''}
                  placeholder="Enter ad description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="image_url">Ad Image</Label>
                  <div className="space-y-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowMediaPicker(true)}
                      className="w-full"
                    >
                      <Image className="h-4 w-4 mr-2" />
                      {imageUrl ? 'Change Image' : 'Select Image'}
                    </Button>
                    
                    {imageUrl && (
                      <div className="mt-2">
                        <img 
                          src={imageUrl} 
                          alt="Preview" 
                          className="w-full h-32 object-cover rounded border"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setImageUrl('')}
                          className="mt-1"
                        >
                          Remove Image
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="click_url">Click URL</Label>
                  <Input
                    id="click_url"
                    name="click_url"
                    type="url"
                    defaultValue={editingAd?.click_url || ''}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    defaultValue={editingAd?.start_date || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="date"
                    defaultValue={editingAd?.end_date || ''}
                  />
                </div>
              </div>

              <div>
                <Label>Display Duration</Label>
                <div className="flex gap-2">
                  <Input
                    id="duration_value"
                    name="duration_value"
                    type="number"
                    min="1"
                    defaultValue={editingAd ? getDurationDisplay(editingAd.display_duration_seconds).value : 30}
                    placeholder="30"
                    className="flex-1"
                  />
                  <Select name="duration_unit" defaultValue={editingAd ? getDurationDisplay(editingAd.display_duration_seconds).unit : 'seconds'}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seconds">Seconds</SelectItem>
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="hours">Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  How long this ad should be displayed before rotating to the next ad
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : (editingAd ? 'Update Ad' : 'Create Ad')}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingAd(null);
                    setImageUrl('');
                    setShowMediaPicker(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Advertisements</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : ads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No ads found. Create your first ad to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ads.map((ad) => (
                  <TableRow key={ad.id}>
                    <TableCell className="font-medium">{ad.title}</TableCell>
                    <TableCell className="capitalize">{ad.position}</TableCell>
                    <TableCell>{ad.priority}</TableCell>
                    <TableCell>
                      {(() => {
                        const duration = getDurationDisplay(ad.display_duration_seconds);
                        return `${duration.value} ${duration.unit}`;
                      })()}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={ad.active}
                        onCheckedChange={(checked) => toggleStatus(ad.id, checked)}
                      />
                    </TableCell>
                    <TableCell>{ad.start_date || 'No start date'}</TableCell>
                    <TableCell>{ad.end_date || 'No end date'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(ad)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(ad.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <MediaPickerModal
        open={showMediaPicker}
        onOpenChange={setShowMediaPicker}
        onSelect={(url) => setImageUrl(url)}
        mediaType="image"
        title="Select Ad Image"
      />
    </div>
  );
};

export default AdsTab;