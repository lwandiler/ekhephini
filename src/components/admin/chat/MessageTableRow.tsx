
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X } from 'lucide-react';
import { getProviderIcon, getStatusBadge, formatDate } from './messageUtils';
import { Message } from './types/messageTypes';

interface MessageTableRowProps {
  message: Message;
  onView: (message: Message) => void;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const MessageTableRow = ({ message, onView, onApprove, onReject, onDelete }: MessageTableRowProps) => {
  const { date, time } = formatDate(message.created_at);
  
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={message.user_avatar || ''} />
            <AvatarFallback className="bg-purple-200 text-purple-700">
              {message.user_name?.[0] || message.user_email[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">
              {message.user_name || message.user_email.split('@')[0]}
            </div>
            <div className="text-sm text-muted-foreground flex items-center space-x-1">
              <span>{message.user_email}</span>
              {getProviderIcon(message.provider)}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div 
          className="max-w-xs truncate cursor-pointer hover:text-purple-700" 
          onClick={() => onView(message)}
        >
          {message.content}
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm">{date}</div>
        <div className="text-xs text-muted-foreground">{time}</div>
      </TableCell>
      <TableCell>
        {getStatusBadge(message.status)}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          {message.status === 'pending' && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onApprove(message.id)}
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onReject(message.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(message)}
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(message.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default MessageTableRow;
