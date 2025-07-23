import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { pagesService, Page } from '@/services/api/pagesService';
import { useToast } from '@/hooks/use-toast';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { Code } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ImageEditor } from './ImageEditor';

const PagesTab = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    meta_title: '',
    meta_description: '',
    template: 'default',
    published: false,
    featured_image: ''
  });
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [imageEditorOpen, setImageEditorOpen] = useState(false);
  const [currentImageFile, setCurrentImageFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  const { isUploading, handleMediaUpload } = useMediaUpload({
    mediaType: 'image',
    onUploadSuccess: (url) => {
      setFormData(prev => ({ ...prev, featured_image: url }));
    }
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const data = await pagesService.getAllPages();
      setPages(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch pages",
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
        await new Promise(resolve => setTimeout(resolve, 1000));
        finalFormData = { ...formData };
      }
      
      if (editingPage) {
        await pagesService.updatePage(editingPage.id, finalFormData);
        toast({
          title: "Success",
          description: `Page updated successfully`
        });
      } else {
        await pagesService.createPage(finalFormData);
        toast({
          title: "Success",
          description: `Page ${finalFormData.published ? 'published' : 'saved as draft'} successfully`
        });
      }
      
      resetForm();
      fetchPages();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingPage ? 'update' : 'create'} page`,
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      meta_title: '',
      meta_description: '',
      template: 'default',
      published: false,
      featured_image: ''
    });
    setFeaturedImageFile(null);
    setEditingPage(null);
    setShowForm(false);
    setIsHtmlMode(false);
  };

  const handleEdit = (page: Page) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      excerpt: page.excerpt || '',
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
      template: page.template || 'default',
      published: page.published || false,
      featured_image: page.featured_image || ''
    });
    setShowForm(true);
  };

  const handleVisualEdit = (page: Page) => {
    // Navigate to the page with edit mode enabled
    navigate(`/page/${page.slug}?edit=true`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-generate slug from title
    if (name === 'title' && !editingPage) {
      setFormData(prev => ({
        ...prev,
        slug: pagesService.generateSlug(value)
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImageFile(file);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this page?')) {
      try {
        await pagesService.deletePage(id);
        toast({
          title: "Success",
          description: "Page deleted successfully"
        });
        fetchPages();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete page",
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
        ['clean']
      ],
      handlers: {
        'image': imageHandler
      }
    }
  };

  const templates = [
    { value: 'default', label: 'Default' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'full-width', label: 'Full Width' },
    { value: 'sidebar', label: 'With Sidebar' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Pages</h2>
        <Button 
          onClick={() => showForm ? resetForm() : setShowForm(true)}
          className="bg-radio-accent hover:bg-radio-accent/80"
        >
          {showForm ? "Cancel" : "Add New Page"}
        </Button>
      </div>
      
      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingPage ? 'Edit Page' : 'Add New Page'}</CardTitle>
            <CardDescription>
              {editingPage ? 'Update your page details.' : 'Create a new static page for your website.'}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleFormSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Page Title</Label>
                  <Input 
                    id="title" 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter page title" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input 
                    id="slug" 
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="page-url-slug" 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="template">Template</Label>
                  <Select 
                    value={formData.template} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, template: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.value} value={template.value}>
                          {template.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Title (SEO)</Label>
                  <Input 
                    id="meta_title" 
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleInputChange}
                    placeholder="SEO title (optional)" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Page Excerpt</Label>
                <Textarea 
                  id="excerpt" 
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="Brief description of the page..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description (SEO)</Label>
                <Textarea 
                  id="meta_description" 
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleInputChange}
                  placeholder="SEO description (optional)"
                  rows={2}
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
                      placeholder="Write your page content here..."
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
                  {formData.published ? 'Publish page' : 'Save as draft'}
                </Label>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={resetForm}>Cancel</Button>
              <Button type="submit" className="bg-radio-accent hover:bg-radio-accent/80" disabled={isUploading}>
                {isUploading ? 'Uploading...' : editingPage ? 'Update Page' : formData.published ? 'Publish Page' : 'Save Draft'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        loading ? (
          <div className="flex justify-center py-8">
            <div className="text-gray-500">Loading pages...</div>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Title</th>
                <th className="text-left py-3 px-4">Slug</th>
                <th className="text-left py-3 px-4">Template</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No pages yet. Create your first page!
                  </td>
                </tr>
              ) : (
                pages.map((page) => (
                  <tr key={page.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{page.title}</td>
                    <td className="py-3 px-4 text-gray-600">/{page.slug}</td>
                    <td className="py-3 px-4 capitalize">{page.template}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        page.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {page.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {page.published_at ? formatDate(page.published_at) : formatDate(page.created_at!)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-500 hover:text-blue-600"
                          onClick={() => handleVisualEdit(page)}
                          title="Visual Editor"
                        >
                          Visual Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-radio-blue"
                          onClick={() => handleEdit(page)}
                          title="Form Editor"
                        >
                          Form Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500"
                          onClick={() => handleDelete(page.id)}
                        >
                          Delete
                        </Button>
                      </div>
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

export default PagesTab;