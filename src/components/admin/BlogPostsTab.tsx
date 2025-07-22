
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { blogService, BlogPost } from '@/services/api/blogService';
import { useToast } from '@/hooks/use-toast';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { Upload, Image, Code } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ImageEditor } from './ImageEditor';

const BlogPostsTab = () => {
  console.log('BlogPostsTab component is rendering...');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    author: '',
    published: false,
    featured_image: ''
  });
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [imageEditorOpen, setImageEditorOpen] = useState(false);
  const [currentImageFile, setCurrentImageFile] = useState<File | null>(null);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const { toast } = useToast();
  
  const { isUploading, handleMediaUpload } = useMediaUpload({
    mediaType: 'image',
    onUploadSuccess: (url) => {
      setFormData(prev => ({ ...prev, featured_image: url }));
    }
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      console.log('Starting to fetch blog posts...');
      const data = await blogService.getAllPosts();
      console.log('Fetched blog posts:', data);
      setPosts(data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
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
      let finalFormData = { ...formData };
      
      // Upload featured image if one is selected
      if (featuredImageFile && !finalFormData.featured_image) {
        await handleMediaUpload(featuredImageFile);
        // Wait a moment for the upload to complete and set the URL
        await new Promise(resolve => setTimeout(resolve, 1000));
        finalFormData = { ...formData }; // Get updated form data with the image URL
      }
      
      if (editingPost) {
        await blogService.updatePost(editingPost.id, finalFormData);
        toast({
          title: "Success",
          description: `Blog post updated successfully`
        });
      } else {
        await blogService.createPost(finalFormData);
        toast({
          title: "Success",
          description: `Blog post ${finalFormData.published ? 'published' : 'saved as draft'} successfully`
        });
      }
      
      resetForm();
      fetchPosts();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingPost ? 'update' : 'create'} blog post`,
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: '',
      author: '',
      published: false,
      featured_image: ''
    });
    setFeaturedImageFile(null);
    setEditingPost(null);
    setShowForm(false);
  };

  const handleEdit = (post: BlogPost) => {
    console.log('Edit button clicked for post:', post);
    try {
      setEditingPost(post);
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        category: post.category || '',
        author: post.author,
        published: post.published || false,
        featured_image: post.featured_image || ''
      });
      setShowForm(true);
      console.log('Edit form should now be visible');
    } catch (error) {
      console.error('Error in handleEdit:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImageFile(file);
    }
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

  // Custom image handler for ReactQuill
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        setCurrentImageFile(file);
        setImageEditorOpen(true);
      }
    };
  };

  const handleEditedImageSave = async (editedImageFile: File) => {
    try {
      // Upload the edited image
      await handleMediaUpload(editedImageFile);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload edited image",
        variant: "destructive"
      });
    }
  };

  // ReactQuill modules with custom image handler
  const quillModules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean'],
        ['html-editor']
      ],
      handlers: {
        'image': imageHandler,
        'html-editor': () => setIsHtmlMode(!isHtmlMode)
      }
    }
  };

  // Custom Quill toolbar registration
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const Quill = require('react-quill').Quill;
      if (Quill && !Quill.imports['modules/toolbar'].DEFAULTS.handlers['html-editor']) {
        // Register custom HTML editor button
        const Toolbar = Quill.import('modules/toolbar');
        Toolbar.DEFAULTS.handlers['html-editor'] = () => setIsHtmlMode(!isHtmlMode);
      }
    }
  }, [isHtmlMode]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Blog Posts</h2>
        <Button 
          onClick={() => showForm ? resetForm() : setShowForm(true)}
          className="bg-radio-accent hover:bg-radio-accent/80"
        >
          {showForm ? "Cancel" : "Add New Post"}
        </Button>
      </div>
      
      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}</CardTitle>
            <CardDescription>
              {editingPost ? 'Update your blog post details.' : 'Create a new blog post for your radio station.'}
            </CardDescription>
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
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {isHtmlMode ? 'HTML Source Mode' : 'Visual Editor Mode'}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsHtmlMode(!isHtmlMode)}
                      className="flex items-center gap-1"
                    >
                      <Code className="w-4 h-4" />
                      {isHtmlMode ? 'Visual' : 'HTML'}
                    </Button>
                  </div>
                  {isHtmlMode ? (
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Enter HTML content here..."
                      className="min-h-[300px] font-mono text-sm"
                      style={{ fontFamily: 'monospace' }}
                    />
                  ) : (
                    <ReactQuill
                      value={formData.content}
                      onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                      placeholder="Write your blog post content here..."
                      theme="snow"
                      style={{ height: '300px', marginBottom: '50px' }}
                      modules={quillModules}
                    />
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Featured Image</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="featured-image-upload"
                      />
                      <label 
                        htmlFor="featured-image-upload"
                        className="cursor-pointer text-primary hover:text-primary/80 underline"
                      >
                        Click here to upload image
                      </label>
                    </div>
                    {isUploading && (
                      <div className="text-sm text-muted-foreground">
                        Uploading...
                      </div>
                    )}
                  </div>
                  {(formData.featured_image || featuredImageFile) && (
                    <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                      <img 
                        src={formData.featured_image || (featuredImageFile ? URL.createObjectURL(featuredImageFile) : '')}
                        alt="Featured image preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <Input 
                    placeholder="Or enter image URL directly"
                    value={formData.featured_image}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="published" 
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                />
                <Label htmlFor="published" className="cursor-pointer">
                  {formData.published ? 'Publish immediately' : 'Save as draft'}
                </Label>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={resetForm}>Cancel</Button>
              <Button type="submit" className="bg-radio-accent hover:bg-radio-accent/80" disabled={isUploading}>
                {isUploading ? 'Uploading...' : editingPost ? 'Update Post' : formData.published ? 'Publish Post' : 'Save Draft'}
              </Button>
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
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-radio-blue mr-2"
                        onClick={() => handleEdit(post)}
                      >
                        Edit
                      </Button>
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
      
      {/* Image Editor Modal */}
      {currentImageFile && (
        <ImageEditor
          isOpen={imageEditorOpen}
          onClose={() => {
            setImageEditorOpen(false);
            setCurrentImageFile(null);
          }}
          imageFile={currentImageFile}
          onSave={handleEditedImageSave}
        />
      )}
    </div>
  );
};

export default BlogPostsTab;
