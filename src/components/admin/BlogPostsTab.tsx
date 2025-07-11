
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const BlogPostsTab = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted! In a real application, this would save to a database.");
    setShowForm(false);
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
                <Label htmlFor="post-title">Post Title</Label>
                <Input id="post-title" placeholder="Enter post title" required />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="post-category">Category</Label>
                  <Input id="post-category" placeholder="e.g. News, Events" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="post-author">Author</Label>
                  <Input id="post-author" placeholder="Enter author name" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="post-content">Content</Label>
                <Textarea id="post-content" placeholder="Write your blog post content here..." rows={8} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="post-image">Featured Image</Label>
                <Input id="post-image" type="file" />
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" className="bg-radio-accent hover:bg-radio-accent/80">Publish Post</Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Title</th>
              <th className="text-left py-3 px-4">Category</th>
              <th className="text-left py-3 px-4">Author</th>
              <th className="text-left py-3 px-4">Date</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">Local Music Festival Announces Lineup</td>
              <td className="py-3 px-4">Events</td>
              <td className="py-3 px-4">Jessica Winters</td>
              <td className="py-3 px-4">Apr 28, 2025</td>
              <td className="py-3 px-4 text-right">
                <Button variant="ghost" size="sm" className="text-radio-blue mr-2">Edit</Button>
                <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
              </td>
            </tr>
            <tr className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">New Morning Show Host Joins Radio Wave Hub</td>
              <td className="py-3 px-4">Station News</td>
              <td className="py-3 px-4">Editorial Team</td>
              <td className="py-3 px-4">Apr 25, 2025</td>
              <td className="py-3 px-4 text-right">
                <Button variant="ghost" size="sm" className="text-radio-blue mr-2">Edit</Button>
                <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BlogPostsTab;
