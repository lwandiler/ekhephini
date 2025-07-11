
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import MessageItem from './MessageItem';

interface Message {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string | null;
  user_avatar: string | null;
  content: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  provider: string;
}

interface MessageListProps {
  messages: Message[];
  user: any;
  setIsDialogOpen: (isOpen: boolean) => void;
}

const MessageList = ({ messages, user, setIsDialogOpen }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
          <MessageCircle size={40} className="mb-2 opacity-50" />
          <p>No messages yet! Be the first to chat.</p>
          {!user && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => setIsDialogOpen(true)}
            >
              Sign In to Chat
            </Button>
          )}
        </div>
      ) : (
        messages.map((msg) => (
          <MessageItem key={msg.id} message={msg} />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
