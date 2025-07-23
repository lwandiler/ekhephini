import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Type, Image, Square, Columns, Grid3X3, List, 
  Play, MessageSquare, Calendar, Star, MapPin 
} from 'lucide-react';

interface ComponentLibraryProps {
  onAddComponent: (componentType: string, config?: any) => void;
  onClose: () => void;
}

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  onAddComponent,
  onClose
}) => {
  const basicComponents = [
    { id: 'heading', name: 'Heading', icon: Type, description: 'Add a heading text' },
    { id: 'paragraph', name: 'Paragraph', icon: Type, description: 'Add paragraph text' },
    { id: 'image', name: 'Image', icon: Image, description: 'Add an image' },
    { id: 'button', name: 'Button', icon: Square, description: 'Add a clickable button' },
    { id: 'separator', name: 'Separator', icon: Separator, description: 'Add a divider line' }
  ];

  const layoutComponents = [
    { id: 'section', name: 'Section', icon: Square, description: 'Add a content section' },
    { id: 'columns', name: 'Columns', icon: Columns, description: 'Add column layout' },
    { id: 'grid', name: 'Grid', icon: Grid3X3, description: 'Add grid layout' },
    { id: 'card', name: 'Card', icon: Square, description: 'Add a card container' }
  ];

  const advancedComponents = [
    { id: 'podcast-player', name: 'Podcast Player', icon: Play, description: 'Add podcast player' },
    { id: 'chat-widget', name: 'Chat Widget', icon: MessageSquare, description: 'Add chat interface' },
    { id: 'schedule', name: 'Schedule', icon: Calendar, description: 'Add show schedule' },
    { id: 'featured-content', name: 'Featured Content', icon: Star, description: 'Add featured content block' },
    { id: 'social-feed', name: 'Social Feed', icon: List, description: 'Add social media feed' },
    { id: 'contact-info', name: 'Contact Info', icon: MapPin, description: 'Add contact information' }
  ];

  const renderComponentSection = (title: string, components: any[]) => (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      <div className="grid grid-cols-1 gap-2">
        {components.map((component) => (
          <Button
            key={component.id}
            variant="ghost"
            className="justify-start h-auto p-3 border border-gray-200 hover:border-blue-300"
            onClick={() => onAddComponent(component.id)}
          >
            <div className="flex items-start gap-3">
              <component.icon size={20} className="text-gray-600 mt-0.5" />
              <div className="text-left">
                <div className="font-medium text-sm">{component.name}</div>
                <div className="text-xs text-gray-500">{component.description}</div>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed right-4 top-4 bottom-4 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Component Library</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            Drag and drop components to add them to your page
          </p>
        </CardHeader>
        
        <CardContent className="overflow-y-auto">
          {renderComponentSection('Basic Elements', basicComponents)}
          {renderComponentSection('Layout', layoutComponents)}
          {renderComponentSection('Advanced', advancedComponents)}
          
          <Separator className="my-4" />
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-1">Pro Tip</h4>
            <p className="text-xs text-blue-600">
              Click any component to add it to your page. You can then drag it to reposition 
              and use the toolbar to customize its appearance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComponentLibrary;