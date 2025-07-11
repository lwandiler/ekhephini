
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getProviderIcon, getStatusBadge, formatDate } from './messageUtils';
import { Message } from './types/messageTypes';

interface MessageViewDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  message: Message | null;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

const MessageViewDialog = ({ 
  isOpen, 
  onOpenChange, 
  message, 
  onApprove, 
  onReject 
}: MessageViewDialogProps) => {
  if (!message) return null;

  const { date, time } = formatDate(message.created_at);
  const formattedDateTime = new Date(message.created_at).toLocaleString();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Message Details</DialogTitle>
          <DialogDescription>
            View the complete message and user information
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
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
          
          <div>
            <div className="text-sm font-medium mb-1">Message:</div>
            <div className="bg-gray-50 p-3 rounded-md border whitespace-pre-wrap">
              {message.content}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium mb-1">Posted:</div>
              <div className="text-sm">
                {formattedDateTime}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1">Status:</div>
              <div>{getStatusBadge(message.status)}</div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          {message.status === 'pending' && (
            <div className="flex space-x-2 w-full">
              <Button
                onClick={() => {
                  onApprove(message.id);
                  onOpenChange(false);
                }}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Approve
              </Button>
              <Button
                onClick={() => {
                  onReject(message.id);
                  onOpenChange(false);
                }}
                variant="outline"
                className="flex-1"
              >
                Reject
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MessageViewDialog;
