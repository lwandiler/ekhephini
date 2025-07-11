
import { useState, useEffect } from 'react';
import { chatService, ChatMessageResponse } from '@/services/api/chatService';
import { toast } from '@/components/ui/use-toast';

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

export const useChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await chatService.getApprovedMessages();
        
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
      }
    };

    fetchMessages();

    // Set up polling for real-time updates (every 5 seconds)
    const interval = setInterval(fetchMessages, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const sendMessage = async (user: any, content: string) => {
    if (!user || !content.trim()) return;
    
    try {
      // Extract provider from user metadata
      const provider = user.app_metadata?.provider || 'email';
      
      // Get user details 
      const userEmail = user.email;
      const userName = user.user_metadata?.full_name || user.user_metadata?.name || userEmail.split('@')[0];
      const userAvatar = user.user_metadata?.avatar_url || null;
      
      // Send message via API
      await chatService.createMessage({
        user_id: user.id,
        user_email: userEmail,
        user_name: userName,
        user_avatar: userAvatar,
        content,
        provider
      });
      
      toast({
        title: "Message Sent",
        description: "Your message has been sent for approval.",
      });
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
      return false;
    }
  };

  return {
    messages,
    sendMessage
  };
};
