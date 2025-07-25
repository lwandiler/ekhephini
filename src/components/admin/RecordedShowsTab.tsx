import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus, Play, Clock, Calendar, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface RecordedShow {
  id: string;
  title: string;
  description: string | null;
  show_id: string | null;
  recorded_at: string;
  audio_url: string;
  duration_seconds: number | null;
  expires_at: string;
  shows?: {
    title: string;
    host: string;
  } | null;
}

interface Show {
  id: string;
  title: string;
  host: string;
}

export const RecordedShowsTab: React.FC = () => {
  const [recordedShows, setRecordedShows] = useState<RecordedShow[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    show_id: '',
    audio_file: null as File | null
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [recordedResponse, showsResponse] = await Promise.all([
        supabase
          .from('recorded_shows')
          .select(`
            *,
            shows (
              title,
              host
            )
          `)
          .order('recorded_at', { ascending: false }),
        supabase
          .from('shows')
          .select('id, title, host')
          .eq('active', true)
          .order('title')
      ]);

      if (recordedResponse.error) throw recordedResponse.error;
      if (showsResponse.error) throw showsResponse.error;

      setRecordedShows(recordedResponse.data || []);
      setShows(showsResponse.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File): Promise<string> => {
    const fileName = `${crypto.randomUUID()}.mp3`;
    
    const { data, error } = await supabase.storage
      .from('recorded-shows')
      .upload(fileName, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('recorded-shows')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.audio_file) {
      toast.error('Please select an audio file');
      return;
    }

    setUploading(true);
    try {
      // Upload audio file
      const audioUrl = await handleFileUpload(formData.audio_file);

      // Create database entry
      const { error } = await supabase
        .from('recorded_shows')
        .insert({
          title: formData.title,
          description: formData.description || null,
          show_id: formData.show_id || null,
          audio_url: audioUrl
        });

      if (error) throw error;

      toast.success('Recorded show uploaded successfully');
      setFormData({ title: '', description: '', show_id: '', audio_file: null });
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error('Error uploading:', error);
      toast.error('Failed to upload recorded show');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, audioUrl: string) => {
    if (!confirm('Are you sure you want to delete this recorded show?')) return;

    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('recorded_shows')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      // Delete from storage
      const fileName = audioUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('recorded-shows')
          .remove([fileName]);
      }

      toast.success('Recorded show deleted');
      loadData();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Failed to delete recorded show');
    }
  };

  const cleanupExpired = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('cleanup-expired-recordings');
      
      if (error) throw error;
      
      if (data?.success) {
        toast.success(`Cleaned up ${data.cleaned} expired recordings`);
        loadData();
      }
    } catch (error) {
      console.error('Error cleaning up:', error);
      toast.error('Failed to cleanup expired recordings');
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'Unknown';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const getTimeUntilExpiry = (expiresAt: string) => {
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    if (expiryDate <= now) return 'Expired';
    return formatDistanceToNow(expiryDate, { addSuffix: true });
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-foreground">Recorded Shows</h2>
        <div className="space-x-2">
          <Button onClick={cleanupExpired} variant="outline">
            <Trash2 className="h-4 w-4 mr-2" />
            Cleanup Expired
          </Button>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Upload Recording
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Upload Recorded Show</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="show_id">Associated Show (Optional)</Label>
                <Select 
                  value={formData.show_id} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, show_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a show" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No show</SelectItem>
                    {shows.map((show) => (
                      <SelectItem key={show.id} value={show.id}>
                        {show.title} - {show.host}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="audio_file">Audio File (MP3)</Label>
                <Input
                  id="audio_file"
                  type="file"
                  accept="audio/mp3,audio/mpeg"
                  onChange={(e) => setFormData(prev => ({ ...prev, audio_file: e.target.files?.[0] || null }))}
                  required
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={uploading}>
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Recorded Shows ({recordedShows.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {recordedShows.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No recorded shows found.</p>
          ) : (
            <div className="space-y-4">
              {(() => {
                // Group recordings by show
                const groupedRecordings = recordedShows.reduce((acc, recording) => {
                  const showId = recording.show_id || 'no-show';
                  const showKey = recording.shows ? 
                    `${recording.shows.title} - ${recording.shows.host}` : 
                    'Manual Uploads';
                  
                  if (!acc[showKey]) {
                    acc[showKey] = [];
                  }
                  acc[showKey].push(recording);
                  return acc;
                }, {} as Record<string, typeof recordedShows>);

                return Object.entries(groupedRecordings).map(([showKey, recordings]) => {
                  // Sort recordings by hour (extract hour number from title) or by recorded date
                  const sortedRecordings = recordings.sort((a, b) => {
                    const hourA = parseInt(a.title.match(/Hour (\d+)/)?.[1] || '0');
                    const hourB = parseInt(b.title.match(/Hour (\d+)/)?.[1] || '0');
                    
                    if (hourA && hourB) {
                      return hourA - hourB;
                    }
                    
                    // Fallback to date sorting
                    return new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime();
                  });

                  return (
                    <Card key={showKey} className="border border-border/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{showKey}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {sortedRecordings.length} recording{sortedRecordings.length !== 1 ? 's' : ''}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Recording Title</TableHead>
                              <TableHead>Recorded</TableHead>
                              <TableHead>Duration</TableHead>
                              <TableHead>Expires</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sortedRecordings.map((recording) => (
                              <TableRow key={recording.id}>
                                <TableCell className="font-medium">
                                  {recording.title}
                                  {recording.description && (
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                      {recording.description}
                                    </p>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {new Date(recording.recorded_at).toLocaleDateString()}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {formatDuration(recording.duration_seconds)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className={`text-sm ${new Date(recording.expires_at) <= new Date() ? 'text-destructive' : 'text-muted-foreground'}`}>
                                    {getTimeUntilExpiry(recording.expires_at)}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => window.open(recording.audio_url, '_blank')}
                                    >
                                      <Play className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleDelete(recording.id, recording.audio_url)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  );
                });
              })()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};