import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { pagesService, Page } from '@/services/api/pagesService';
import { useToast } from '@/hooks/use-toast';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { Code, Eye, Save, X, Layout, Image, Type, Settings } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ImageEditor } from './ImageEditor';

interface PageBuilderProps {
  page: Page;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPage: Page) => void;
}

const PageBuilder: React.FC<PageBuilderProps> = ({ page, isOpen, onClose, onSave }) => {
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
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();
  
  const { isUploading, handleMediaUpload } = useMediaUpload({
    mediaType: 'image',
    onUploadSuccess: (url) => {
      setFormData(prev => ({ ...prev, featured_image: url }));
    }
  });

  useEffect(() => {
    if (page) {
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
    }
  }, [page]);

  const handleSave = async () => {
    try {
      let finalFormData = { ...formData };
      
      // Upload featured image if one is selected
      if (featuredImageFile && !finalFormData.featured_image) {
        await handleMediaUpload(featuredImageFile);
        await new Promise(resolve => setTimeout(resolve, 1000));
        finalFormData = { ...formData };
      }
      
      const updatedPage = await pagesService.updatePage(page.id, finalFormData);
      toast({
        title: "Success",
        description: "Page updated successfully"
      });
      onSave(updatedPage);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update page",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImageFile(file);
    }
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

  const renderPreview = () => (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-green-200">
      {formData.featured_image && (
        <div className="mb-6">
          <img 
            src={formData.featured_image} 
            alt={formData.title}
            className="w-full h-64 object-cover rounded-lg border border-green-100"
          />
        </div>
      )}
      <h1 className="text-3xl font-bold mb-4 text-black">{formData.title}</h1>
      {formData.excerpt && (
        <p className="text-lg text-gray-600 mb-6">{formData.excerpt}</p>
      )}
      <div 
        className="prose prose-lg max-w-none text-black"
        dangerouslySetInnerHTML={{ __html: formData.content }}
      />
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col bg-white border-2 border-green-600 shadow-2xl">
        <DialogHeader className="flex-shrink-0 bg-green-600 text-white p-4 rounded-t-lg border-b-2 border-green-700">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-white text-xl font-bold">Page Builder - {formData.title}</DialogTitle>
              <DialogDescription className="text-green-100">
                Edit your page content using the visual builder
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-1 bg-white text-green-600 border-white hover:bg-green-50 font-medium"
              >
                <Eye className="w-4 h-4" />
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
              <Button
                onClick={handleSave}
                disabled={isUploading}
                className="flex items-center gap-1 bg-black text-white hover:bg-gray-800 font-medium"
              >
                <Save className="w-4 h-4" />
                {isUploading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" size="sm" onClick={onClose} className="bg-white text-gray-600 border-white hover:bg-gray-50">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden bg-white">
          {previewMode ? (
            <div className="h-full overflow-y-auto p-4 bg-gray-50">
              {renderPreview()}
            </div>
          ) : (
            <Tabs defaultValue="content" className="h-full flex flex-col bg-white">
              <TabsList className="flex-shrink-0 bg-green-100 border-b-2 border-green-200 rounded-none justify-start p-1">
                <TabsTrigger 
                  value="content" 
                  className="flex items-center gap-1 data-[state=active]:bg-green-600 data-[state=active]:text-white bg-white text-green-600 border border-green-300 mr-1 font-medium"
                >
                  <Type className="w-4 h-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger 
                  value="layout" 
                  className="flex items-center gap-1 data-[state=active]:bg-green-600 data-[state=active]:text-white bg-white text-green-600 border border-green-300 mr-1 font-medium"
                >
                  <Layout className="w-4 h-4" />
                  Layout
                </TabsTrigger>
                <TabsTrigger 
                  value="media" 
                  className="flex items-center gap-1 data-[state=active]:bg-green-600 data-[state=active]:text-white bg-white text-green-600 border border-green-300 mr-1 font-medium"
                >
                  <Image className="w-4 h-4" />
                  Media
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="flex items-center gap-1 data-[state=active]:bg-green-600 data-[state=active]:text-white bg-white text-green-600 border border-green-300 font-medium"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto bg-white">
                <TabsContent value="content" className="p-4 space-y-4 bg-white m-0">
                  <Card className="bg-white border-2 border-green-200 shadow-sm">
                    <CardHeader className="bg-green-50 border-b border-green-200">
                      <CardTitle className="text-green-800 font-bold">Page Content</CardTitle>
                      <CardDescription className="text-green-600">Edit your page content using the rich text editor</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 bg-white p-6">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-black font-medium">Page Title</Label>
                        <Input 
                          id="title" 
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="Enter page title" 
                          className="border-green-300 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="excerpt" className="text-black font-medium">Page Excerpt</Label>
                        <Textarea 
                          id="excerpt" 
                          name="excerpt"
                          value={formData.excerpt}
                          onChange={handleInputChange}
                          placeholder="Brief description of the page..."
                          rows={3}
                          className="border-green-300 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label className="text-black font-medium">Content</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setIsHtmlMode(!isHtmlMode)}
                            className="flex items-center gap-1 border-green-300 text-green-600 hover:bg-green-50"
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
                            className="min-h-[400px] font-mono text-sm border-green-300 focus:border-green-500 focus:ring-green-500 bg-gray-50"
                            style={{ fontFamily: 'monospace' }}
                          />
                        ) : (
                          <div className="border-2 border-green-300 rounded-md overflow-hidden">
                            <ReactQuill
                              value={formData.content}
                              onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                              placeholder="Write your page content here..."
                              theme="snow"
                              style={{ height: '400px', marginBottom: '50px' }}
                              modules={quillModules}
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="layout" className="p-4 m-0">
                  <Card className="bg-white border-2 border-green-200 shadow-sm">
                    <CardHeader className="bg-green-50 border-b border-green-200">
                      <CardTitle className="text-green-800 font-bold">Page Layout</CardTitle>
                      <CardDescription className="text-green-600">Configure the layout and appearance of your page</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 bg-white p-6">
                      <div className="space-y-2">
                        <Label htmlFor="template" className="text-black font-medium">Template</Label>
                        <Select 
                          value={formData.template} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, template: value }))}
                        >
                          <SelectTrigger className="border-green-300 focus:border-green-500 focus:ring-green-500">
                            <SelectValue placeholder="Select template" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-green-300">
                            {templates.map((template) => (
                              <SelectItem key={template.value} value={template.value} className="hover:bg-green-50">
                                {template.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="slug" className="text-black font-medium">URL Slug</Label>
                        <Input 
                          id="slug" 
                          name="slug"
                          value={formData.slug}
                          onChange={handleInputChange}
                          placeholder="page-url-slug" 
                          className="border-green-300 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="media" className="p-4 m-0">
                  <Card className="bg-white border-2 border-green-200 shadow-sm">
                    <CardHeader className="bg-green-50 border-b border-green-200">
                      <CardTitle className="text-green-800 font-bold">Featured Image</CardTitle>
                      <CardDescription className="text-green-600">Set a featured image for your page</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 bg-white p-6">
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
                              className="cursor-pointer text-green-600 hover:text-green-800 underline font-medium"
                            >
                              Click here to upload image
                            </label>
                          </div>
                          {isUploading && (
                            <div className="text-sm text-green-600 font-medium">
                              Uploading...
                            </div>
                          )}
                        </div>
                        {(formData.featured_image || featuredImageFile) && (
                          <div className="relative w-full max-w-md h-48 border-2 border-green-300 rounded-lg overflow-hidden bg-gray-50">
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
                          className="border-green-300 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="p-4 m-0">
                  <Card className="bg-white border-2 border-green-200 shadow-sm">
                    <CardHeader className="bg-green-50 border-b border-green-200">
                      <CardTitle className="text-green-800 font-bold">Page Settings</CardTitle>
                      <CardDescription className="text-green-600">Configure SEO and publication settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 bg-white p-6">
                      <div className="space-y-2">
                        <Label htmlFor="meta_title" className="text-black font-medium">Meta Title (SEO)</Label>
                        <Input 
                          id="meta_title" 
                          name="meta_title"
                          value={formData.meta_title}
                          onChange={handleInputChange}
                          placeholder="SEO title (optional)" 
                          className="border-green-300 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="meta_description" className="text-black font-medium">Meta Description (SEO)</Label>
                        <Textarea 
                          id="meta_description" 
                          name="meta_description"
                          value={formData.meta_description}
                          onChange={handleInputChange}
                          placeholder="SEO description (optional)"
                          rows={3}
                          className="border-green-300 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>

                      <div className="flex items-center space-x-2 p-4 border border-green-300 rounded-lg bg-green-50">
                        <Switch 
                          id="published" 
                          checked={formData.published}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                          className="data-[state=checked]:bg-green-600"
                        />
                        <Label htmlFor="published" className="cursor-pointer text-black font-medium">
                          {formData.published ? 'Page is published' : 'Save as draft'}
                        </Label>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          )}
        </div>
      </DialogContent>

      {imageEditorOpen && currentImageFile && (
        <ImageEditor
          isOpen={imageEditorOpen}
          onClose={() => setImageEditorOpen(false)}
          imageFile={currentImageFile}
          onSave={handleEditedImageSave}
        />
      )}
    </Dialog>
  );
};

export default PageBuilder;