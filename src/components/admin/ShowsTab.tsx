
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const ShowsTab = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted! In a real application, this would save to a database.");
    setShowForm(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Shows</h2>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-radio-accent hover:bg-radio-accent/80"
        >
          {showForm ? "Cancel" : "Add New Show"}
        </Button>
      </div>
      
      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Add New Show</CardTitle>
            <CardDescription>Create a new show for your radio station.</CardDescription>
          </CardHeader>
          <form onSubmit={handleFormSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="show-title">Show Title</Label>
                  <Input id="show-title" placeholder="Enter show title" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="show-host">Host</Label>
                  <Input id="show-host" placeholder="Enter host name" required />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="show-day">Day</Label>
                  <select id="show-day" className="w-full border border-gray-300 rounded-md h-10 px-3">
                    <option value="">Select day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="show-time">Time</Label>
                  <Input id="show-time" placeholder="e.g. 3:00 PM - 5:00 PM" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="show-description">Description</Label>
                <Textarea id="show-description" placeholder="Enter show description" rows={4} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="show-image">Image</Label>
                <Input id="show-image" type="file" />
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" className="bg-radio-accent hover:bg-radio-accent/80">Save Show</Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Show</th>
              <th className="text-left py-3 px-4">Host</th>
              <th className="text-left py-3 px-4">Day</th>
              <th className="text-left py-3 px-4">Time</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">Morning Brew</td>
              <td className="py-3 px-4">Sarah Johnson</td>
              <td className="py-3 px-4">Weekdays</td>
              <td className="py-3 px-4">6:00 AM - 9:00 AM</td>
              <td className="py-3 px-4 text-right">
                <Button variant="ghost" size="sm" className="text-radio-blue mr-2">Edit</Button>
                <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
              </td>
            </tr>
            <tr className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">Midday Mix</td>
              <td className="py-3 px-4">Jason Parker</td>
              <td className="py-3 px-4">Monday</td>
              <td className="py-3 px-4">12:00 PM - 3:00 PM</td>
              <td className="py-3 px-4 text-right">
                <Button variant="ghost" size="sm" className="text-radio-blue mr-2">Edit</Button>
                <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
              </td>
            </tr>
            <tr className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">Evening Chill</td>
              <td className="py-3 px-4">Sophia Lee</td>
              <td className="py-3 px-4">Tuesday</td>
              <td className="py-3 px-4">8:00 PM - 11:00 PM</td>
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

export default ShowsTab;
