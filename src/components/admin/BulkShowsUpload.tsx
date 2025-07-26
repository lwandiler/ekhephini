import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BulkShowsUploadProps {
  onUploadComplete: () => void;
}

interface ShowRow {
  title: string;
  host: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  description?: string;
  image_url?: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

const BulkShowsUpload: React.FC<BulkShowsUploadProps> = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [successCount, setSuccessCount] = useState(0);

  const downloadTemplate = () => {
    const headers = ['title', 'host', 'day_of_week', 'start_time', 'end_time', 'description', 'image_url'];
    const sampleData = [
      ['Morning Show', 'John Doe', 'Monday', '08:00', '10:00', 'Your morning dose of music and news', 'https://example.com/morning-show.jpg'],
      ['Drive Time', 'Jane Smith', 'Tuesday', '17:00', '19:00', 'Perfect music for your commute home', 'https://example.com/drive-time.jpg'],
      ['Weekend Mix', 'DJ Mike', 'Saturday', '12:00', '14:00', 'The best weekend vibes', 'https://example.com/weekend-mix.jpg']
    ];

    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'shows_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success('Template downloaded successfully!');
  };

  const validateShowData = (shows: ShowRow[]): ValidationError[] => {
    const errors: ValidationError[] = [];
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Weekdays', 'Weekends', 'Daily'];

    shows.forEach((show, index) => {
      const rowNum = index + 2; // +2 because Excel/CSV rows start at 1 and we skip header

      // Required field validation
      if (!show.title?.trim()) {
        errors.push({ row: rowNum, field: 'title', message: 'Title is required' });
      }
      if (!show.host?.trim()) {
        errors.push({ row: rowNum, field: 'host', message: 'Host is required' });
      }
      if (!show.day_of_week?.trim()) {
        errors.push({ row: rowNum, field: 'day_of_week', message: 'Day of week is required' });
      }
      if (!show.start_time?.trim()) {
        errors.push({ row: rowNum, field: 'start_time', message: 'Start time is required' });
      }
      if (!show.end_time?.trim()) {
        errors.push({ row: rowNum, field: 'end_time', message: 'End time is required' });
      }

      // Day validation
      if (show.day_of_week && !validDays.includes(show.day_of_week)) {
        errors.push({ 
          row: rowNum, 
          field: 'day_of_week', 
          message: `Invalid day. Must be one of: ${validDays.join(', ')}` 
        });
      }

      // Time format validation (HH:MM)
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (show.start_time && !timeRegex.test(show.start_time)) {
        errors.push({ 
          row: rowNum, 
          field: 'start_time', 
          message: 'Start time must be in HH:MM format (e.g., 08:00 or 17:30)' 
        });
      }
      if (show.end_time && !timeRegex.test(show.end_time)) {
        errors.push({ 
          row: rowNum, 
          field: 'end_time', 
          message: 'End time must be in HH:MM format (e.g., 08:00 or 17:30)' 
        });
      }

      // Logical time validation
      if (show.start_time && show.end_time && timeRegex.test(show.start_time) && timeRegex.test(show.end_time)) {
        const [startHour, startMin] = show.start_time.split(':').map(Number);
        const [endHour, endMin] = show.end_time.split(':').map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        
        if (startMinutes >= endMinutes) {
          errors.push({ 
            row: rowNum, 
            field: 'end_time', 
            message: 'End time must be after start time' 
          });
        }
      }
    });

    return errors;
  };

  const parseCSV = (csvText: string): ShowRow[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      throw new Error('CSV must contain at least a header row and one data row');
    }

    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    const requiredHeaders = ['title', 'host', 'day_of_week', 'start_time', 'end_time'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
    }

    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.replace(/"/g, '').trim());
      const show: any = {};
      
      headers.forEach((header, index) => {
        if (requiredHeaders.includes(header) || header === 'description' || header === 'image_url') {
          show[header] = values[index] || '';
        }
      });
      
      return show as ShowRow;
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setUploading(true);
    setValidationErrors([]);
    setSuccessCount(0);

    try {
      const text = await file.text();
      const shows = parseCSV(text);
      
      // Validate data
      const errors = validateShowData(shows);
      if (errors.length > 0) {
        setValidationErrors(errors);
        toast.error(`Found ${errors.length} validation errors. Please fix them and try again.`);
        return;
      }

      // Insert shows into database
      const showsData = shows.map(show => ({
        title: show.title,
        host: show.host,
        day_of_week: show.day_of_week,
        start_time: show.start_time,
        end_time: show.end_time,
        description: show.description || null,
        image_url: show.image_url || null,
        active: true
      }));

      const { data, error } = await supabase
        .from('shows')
        .insert(showsData)
        .select();

      if (error) {
        console.error('Database error:', error);
        toast.error('Failed to upload shows. Please check your data and try again.');
        return;
      }

      setSuccessCount(data?.length || 0);
      toast.success(`Successfully uploaded ${data?.length || 0} shows!`);
      onUploadComplete();
      
      // Reset file input
      event.target.value = '';
      
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to process CSV file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Bulk Upload Shows
        </CardTitle>
        <CardDescription>
          Upload multiple shows at once using a CSV file. Download the template to get started.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            onClick={downloadTemplate}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Template
          </Button>
          
          <div className="flex-1">
            <Label htmlFor="csv-upload" className="cursor-pointer">
              <div className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                <Upload className="h-4 w-4" />
                <span>{uploading ? 'Uploading...' : 'Choose CSV File'}</span>
              </div>
              <Input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </Label>
          </div>
        </div>

        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-2">Validation Errors Found:</div>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {validationErrors.map((error, index) => (
                  <div key={index} className="text-sm">
                    Row {error.row}, {error.field}: {error.message}
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {successCount > 0 && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Successfully uploaded {successCount} shows to the database.
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">CSV Format Requirements:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Required columns: title, host, day_of_week, start_time, end_time</li>
            <li>• Optional columns: description, image_url</li>
            <li>• Time format: HH:MM (e.g., 08:00, 17:30)</li>
            <li>• Valid days: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, Weekdays, Weekends, Daily</li>
            <li>• End time must be after start time</li>
            <li>• Image URL should be a valid web URL (e.g., https://example.com/image.jpg)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkShowsUpload;