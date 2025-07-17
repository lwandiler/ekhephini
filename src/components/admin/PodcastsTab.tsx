
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { podcastsService, type Podcast, type PodcastInsert } from '@/services/api/podcastsService';

const PodcastsTab = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState<Podcast | null>(null);
  const [formData, setFormData] = useState<PodcastInsert>({
    title: '',
    host: '',
    description: '',
    image_url: '',
    duration: '',
    publish_date: new Date().toISOString().split('T')[0],
    episode_number: 1,
    listen_url: '',
    active: true
  });

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const fetchPodcasts = async () => {
    try {
      setLoading(true);
      const data = await podcastsService.getAllPodcastsForAdmin();
      setPodcasts(data);
    } catch (error) {
      console.error('Error fetching podcasts:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch podcasts.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPodcast) {
        await podcastsService.updatePodcast(editingPodcast.id, formData);
        toast({
          title: "Success",
          description: "Podcast updated successfully.",
        });
      } else {
        await podcastsService.createPodcast(formData);
        toast({
          title: "Success",
          description: "Podcast created successfully.",
        });
      }
      
      setDialogOpen(false);
      resetForm();
      fetchPodcasts();
    } catch (error) {
      console.error('Error saving podcast:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save podcast.",
      });
    }
  };

  const handleEdit = (podcast: Podcast) => {
    setEditingPodcast(podcast);
    setFormData({
      title: podcast.title,
      host: podcast.host,
      description: podcast.description || '',
      image_url: podcast.image_url || '',
      duration: podcast.duration || '',
      publish_date: podcast.publish_date,
      episode_number: podcast.episode_number || 1,
      listen_url: podcast.listen_url || '',
      active: podcast.active || true
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this podcast?')) return;
    
    try {
      await podcastsService.deletePodcast(id);
      toast({
        title: "Success",
        description: "Podcast deleted successfully.",
      });
      fetchPodcasts();
    } catch (error) {
      console.error('Error deleting podcast:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete podcast.",
      });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await podcastsService.togglePodcastStatus(id, !currentStatus);
      toast({
        title: "Success",
        description: `Podcast ${!currentStatus ? 'activated' : 'deactivated'} successfully.`,
      });
      fetchPodcasts();
    } catch (error) {
      console.error('Error toggling podcast status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update podcast status.",
      });
    }
  };

  const resetForm = () => {
    setEditingPodcast(null);
    setFormData({
      title: '',
      host: '',
      description: '',
      image_url: '',
      duration: '',
      publish_date: new Date().toISOString().split('T')[0],
      episode_number: 1,
      listen_url: '',
      active: true
    });
  };

  const handleAddClick = () => {
    resetForm();
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-radio-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Podcasts Management</h2>
          <p className="text-gray-600">Manage your podcast episodes</p>
        </div>
        <Button onClick={handleAddClick} className="bg-radio-accent hover:bg-radio-accent/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Podcast
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl bg-green-50 border-green-200">
          <DialogHeader className="bg-green-600 -m-6 mb-4 p-6 rounded-t-lg">
            <DialogTitle className="text-white text-xl">
              {editingPodcast ? 'Edit Podcast' : 'Add New Podcast'}
            </DialogTitle>
            <DialogDescription className="text-green-100">
              {editingPodcast ? 'Update the podcast details below.' : 'Fill in the details for the new podcast episode.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-black font-medium">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="bg-white border-green-300 text-black focus:border-green-500"
                />
              </div>
              <div>
                <Label htmlFor="host" className="text-black font-medium">Host</Label>
                <Input
                  id="host"
                  value={formData.host}
                  onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                  required
                  className="bg-white border-green-300 text-black focus:border-green-500"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description" className="text-black font-medium">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="bg-white border-green-300 text-black focus:border-green-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="episode_number" className="text-black font-medium">Episode Number</Label>
                <Input
                  id="episode_number"
                  type="number"
                  value={formData.episode_number}
                  onChange={(e) => setFormData({ ...formData, episode_number: parseInt(e.target.value) || 1 })}
                  className="bg-white border-green-300 text-black focus:border-green-500"
                />
              </div>
              <div>
                <Label htmlFor="duration" className="text-black font-medium">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 45 min"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="bg-white border-green-300 text-black focus:border-green-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="publish_date" className="text-black font-medium">Publish Date</Label>
                <Input
                  id="publish_date"
                  type="date"
                  value={formData.publish_date}
                  onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                  required
                  className="bg-white border-green-300 text-black focus:border-green-500"
                />
              </div>
              <div>
                <Label htmlFor="image_url" className="text-black font-medium">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="bg-white border-green-300 text-black focus:border-green-500"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="listen_url" className="text-black font-medium">Listen URL</Label>
              <Input
                id="listen_url"
                type="url"
                placeholder="https://example.com/episode"
                value={formData.listen_url}
                onChange={(e) => setFormData({ ...formData, listen_url: e.target.value })}
                className="bg-white border-green-300 text-black focus:border-green-500"
              />
            </div>
            <DialogFooter className="bg-green-50 -mx-6 -mb-6 mt-6 p-6 rounded-b-lg border-t border-green-200">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="border-green-600 text-green-600 hover:bg-green-100">
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                {editingPodcast ? 'Update' : 'Create'} Podcast
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {podcasts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-500">No podcasts found. Create your first podcast episode!</p>
            </CardContent>
          </Card>
        ) : (
          podcasts.map((podcast) => (
            <Card key={podcast.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {podcast.title}
                      <Badge variant={podcast.active ? "default" : "secondary"}>
                        {podcast.active ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Hosted by {podcast.host} • Episode {podcast.episode_number} • {podcast.duration}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(podcast.id, podcast.active || false)}
                    >
                      {podcast.active ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(podcast)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(podcast.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {podcast.description && (
                <CardContent>
                  <p className="text-gray-600">{podcast.description}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    Published: {new Date(podcast.publish_date).toLocaleDateString()}
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PodcastsTab;
