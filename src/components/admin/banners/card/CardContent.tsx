
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface CardContentProps {
  title: string;
  subtitle?: string;
  url?: string;
  onDelete?: () => void;
  onEdit?: () => void;
}

const CardContent = ({ title, subtitle, url, onDelete, onEdit }: CardContentProps) => {
  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold leading-tight">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        {url && (
          <p className="text-xs text-gray-500 truncate">
            <span className="font-medium">Link:</span> {url}
          </p>
        )}
      </div>
      
      {/* Only render action buttons if handlers are provided */}
      {(onEdit || onDelete) && (
        <div className="flex justify-end space-x-2 pt-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-blue-600"
              onClick={onEdit}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          )}
          
          {onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete this banner?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This banner will be permanently removed
                    from the website.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="bg-red-600">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      )}
    </div>
  );
};

export default CardContent;
