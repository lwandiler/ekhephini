import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { X, Palette, Type, Layout } from 'lucide-react';
import { EditorElement } from './VisualEditor';

interface PropertyPanelProps {
  element: EditorElement;
  onUpdate: (element: EditorElement) => void;
  onClose: () => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  element,
  onUpdate,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'layout'>('content');

  const updateContent = (content: string) => {
    onUpdate({ ...element, content });
  };

  const updateStyle = (property: string, value: string) => {
    onUpdate({
      ...element,
      styles: { ...element.styles, [property]: value }
    });
  };

  const updateAttribute = (attribute: string, value: any) => {
    onUpdate({
      ...element,
      attributes: { ...element.attributes, [attribute]: value }
    });
  };

  return (
    <div className="fixed right-4 top-20 bottom-4 w-80 z-40">
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Properties</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={16} />
            </Button>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-1 mt-2">
            <Button
              variant={activeTab === 'content' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('content')}
              className="flex-1"
            >
              <Type size={14} className="mr-1" />
              Content
            </Button>
            <Button
              variant={activeTab === 'style' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('style')}
              className="flex-1"
            >
              <Palette size={14} className="mr-1" />
              Style
            </Button>
            <Button
              variant={activeTab === 'layout' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('layout')}
              className="flex-1"
            >
              <Layout size={14} className="mr-1" />
              Layout
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto">
          {activeTab === 'content' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="element-content">Content</Label>
                {element.type === 'paragraph' || element.type === 'heading' ? (
                  <Textarea
                    id="element-content"
                    value={element.content}
                    onChange={(e) => updateContent(e.target.value)}
                    placeholder="Enter your content..."
                    className="mt-1"
                  />
                ) : (
                  <Input
                    id="element-content"
                    value={element.content}
                    onChange={(e) => updateContent(e.target.value)}
                    placeholder="Enter content..."
                    className="mt-1"
                  />
                )}
              </div>

              {element.type === 'image' && (
                <div>
                  <Label htmlFor="image-src">Image URL</Label>
                  <Input
                    id="image-src"
                    value={element.attributes.src || ''}
                    onChange={(e) => updateAttribute('src', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="mt-1"
                  />
                </div>
              )}

              {element.type === 'button' && (
                <div>
                  <Label htmlFor="button-link">Link URL</Label>
                  <Input
                    id="button-link"
                    value={element.attributes.href || ''}
                    onChange={(e) => updateAttribute('href', e.target.value)}
                    placeholder="https://example.com"
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'style' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="text-color">Text Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="text-color"
                    type="color"
                    value={element.styles.color || '#ffffff'}
                    onChange={(e) => updateStyle('color', e.target.value)}
                    className="w-12 h-8 p-1"
                  />
                  <Input
                    value={element.styles.color || '#ffffff'}
                    onChange={(e) => updateStyle('color', e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bg-color">Background Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="bg-color"
                    type="color"
                    value={element.styles.backgroundColor || '#transparent'}
                    onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                    className="w-12 h-8 p-1"
                  />
                  <Input
                    value={element.styles.backgroundColor || ''}
                    onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                    placeholder="transparent"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="font-size">Font Size</Label>
                <Input
                  id="font-size"
                  value={element.styles.fontSize || '1rem'}
                  onChange={(e) => updateStyle('fontSize', e.target.value)}
                  placeholder="1rem"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="font-weight">Font Weight</Label>
                <select
                  id="font-weight"
                  value={element.styles.fontWeight || 'normal'}
                  onChange={(e) => updateStyle('fontWeight', e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value="300">300</option>
                  <option value="400">400</option>
                  <option value="500">500</option>
                  <option value="600">600</option>
                  <option value="700">700</option>
                  <option value="800">800</option>
                  <option value="900">900</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'layout' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="margin">Margin</Label>
                <Input
                  id="margin"
                  value={element.styles.margin || '0'}
                  onChange={(e) => updateStyle('margin', e.target.value)}
                  placeholder="0"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="padding">Padding</Label>
                <Input
                  id="padding"
                  value={element.styles.padding || '0'}
                  onChange={(e) => updateStyle('padding', e.target.value)}
                  placeholder="0"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  value={element.styles.width || 'auto'}
                  onChange={(e) => updateStyle('width', e.target.value)}
                  placeholder="auto"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  value={element.styles.height || 'auto'}
                  onChange={(e) => updateStyle('height', e.target.value)}
                  placeholder="auto"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="border-radius">Border Radius</Label>
                <Input
                  id="border-radius"
                  value={element.styles.borderRadius || '0'}
                  onChange={(e) => updateStyle('borderRadius', e.target.value)}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyPanel;