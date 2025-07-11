
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Facebook, Mail, MessageCircle } from 'lucide-react';

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

interface MessageItemProps {
  message: Message;
}

const MessageItem = ({ message }: MessageItemProps) => {
  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'facebook':
        return <Facebook size={14} className="text-blue-600" />;
      case 'twitter':
        return <svg className="w-3.5 h-3.5 text-blue-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M14.258 10.152L23.176 0h-2.113l-7.747 8.813L7.133 0H0l9.352 13.328L0 24h2.113l8.176-9.309 6.531 9.309h7.133zm-2.895 3.293l-.949-1.328L2.875 1.56h3.246l6.086 8.523.945 1.328 7.91 11.078h-3.246z"></path></svg>;
      case 'google':
        return <Mail size={14} className="text-red-500" />;
      default:
        return <MessageCircle size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className="flex items-start space-x-2">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={message.user_avatar || ''} />
            <AvatarFallback className="bg-purple-200 text-purple-700">
              {message.user_name?.[0] || message.user_email[0]}
            </AvatarFallback>
          </Avatar>
        </HoverCardTrigger>
        <HoverCardContent className="w-56">
          <div className="flex items-center space-x-2">
            <Avatar className="h-12 w-12">
              <AvatarImage src={message.user_avatar || ''} />
              <AvatarFallback className="bg-purple-200 text-purple-700">
                {message.user_name?.[0] || message.user_email[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{message.user_name || message.user_email.split('@')[0]}</p>
              <div className="flex items-center text-xs text-gray-500">
                {getProviderIcon(message.provider)}
                <span className="ml-1">
                  via {message.provider === 'google' ? 'Gmail' : message.provider === 'twitter' ? 'X' : message.provider}
                </span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>

      <div className="flex-1">
        <div className="bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-1 mb-1">
            <span className="font-medium text-sm">
              {message.user_name || message.user_email.split('@')[0]}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(message.created_at).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            {getProviderIcon(message.provider)}
          </div>
          <p className="text-gray-800 whitespace-pre-wrap break-words">{message.content}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
