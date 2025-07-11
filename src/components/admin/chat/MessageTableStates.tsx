
import { TableRow, TableCell } from '@/components/ui/table';
import { RefreshCw } from 'lucide-react';

interface LoadingStateProps {
  colSpan: number;
}

export const LoadingState = ({ colSpan }: LoadingStateProps) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="text-center py-10">
      <div className="flex flex-col items-center text-muted-foreground gap-2">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span>Loading messages...</span>
      </div>
    </TableCell>
  </TableRow>
);

export const EmptyState = ({ colSpan }: LoadingStateProps) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="text-center py-10 text-muted-foreground">
      No messages found
    </TableCell>
  </TableRow>
);
