
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { blogService, BlogPost } from '@/services/api/blogService';
import { useToast } from '@/hooks/use-toast';

const BlogPostsTab = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    author: '',
    published: false,
    featured_image: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await blogService.getAllPosts();
      setPosts(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch blog posts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await blogService.createPost(formData);
      toast({
        title: "Success",
        description: "Blog post created successfully"
      });
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        author: '',
        published: false,
        featured_image: ''
      });
      setShowForm(false);
      fetchPosts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        await blogService.deletePost(id);
        toast({
          title: "Success",
          description: "Blog post deleted successfully"
        });
        fetchPosts();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete blog post",
          variant: "destructive"
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Blog Posts</h2>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-radio-accent hover:bg-radio-accent/80"
        >
          {showForm ? "Cancel" : "Add New Post"}
        </Button>
      </div>
      
      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Add New Blog Post</CardTitle>
            <CardDescription>Create a new blog post for your radio station.</CardDescription>
          </CardHeader>
          <form onSubmit={handleFormSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Post Title</Label>
                <Input 
                  id="title" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter post title" 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input 
                    id="category" 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g. Station News, Events, Interviews" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input 
                    id="author" 
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="Enter author name" 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea 
                  id="excerpt" 
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="Write a brief summary of the post..." 
                  rows={3} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea 
                  id="content" 
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write your blog post content here..." 
                  rows={8} 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="featured_image">Featured Image URL</Label>
                <Input 
                  id="featured_image" 
                  name="featured_image"
                  value={formData.featured_image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg" 
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="published" 
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                />
                <Label htmlFor="published">Publish immediately</Label>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" className="bg-radio-accent hover:bg-radio-accent/80">Publish Post</Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        loading ? (
          <div className="flex justify-center py-8">
            <div className="text-gray-500">Loading blog posts...</div>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Title</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Author</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No blog posts yet. Create your first post!
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{post.title}</td>
                    <td className="py-3 px-4">{post.category}</td>
                    <td className="py-3 px-4">{post.author}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {post.published_at ? formatDate(post.published_at) : formatDate(post.created_at!)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm" className="text-radio-blue mr-2">Edit</Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500"
                        onClick={() => handleDelete(post.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )
      )}
    </div>
  );
};

export default BlogPostsTab;
