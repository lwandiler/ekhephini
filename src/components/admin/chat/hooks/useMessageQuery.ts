
import { useState, useEffect } from 'react';
import { chatService, ChatMessageResponse } from '@/services/api/chatService';
import { toast } from '@/components/ui/use-toast';
import { Message, MessageFilter } from '../types/messageTypes';

export const useMessageQuery = (filter: MessageFilter) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      let data: ChatMessageResponse[];
      
      if (filter === 'all') {
        data = await chatService.getAllMessages();
      } else {
        data = await chatService.getMessagesByStatus(filter);
      }
      
      // Map API response to Message interface
      const formattedMessages: Message[] = data.map((msg: ChatMessageResponse) => ({
        id: msg.id,
        user_id: msg.user_id,
        user_email: msg.user_email,
        user_name: msg.user_name || null,
        user_avatar: msg.user_avatar || null,
        content: msg.content,
        created_at: msg.created_at,
        status: msg.status,
        provider: msg.provider
      }));
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load messages. Please try again.",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
    
    // Set up polling for real-time updates (every 3 seconds for admin)
    const interval = setInterval(fetchMessages, 3000);
    
    return () => {
      clearInterval(interval);
    };
  }, [filter]);

  return { messages, loading, fetchMessages };
};
