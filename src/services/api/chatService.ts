
import { supabaseApi } from './config';

export interface ChatMessageResponse {
  id: string;
  user_id: string;
  user_email: string;
  user_name?: string;
  user_avatar?: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  provider: string;
  created_at: string;
}

export const chatService = {
  // Get approved messages
  async getApprovedMessages(): Promise<ChatMessageResponse[]> {
    const response = await supabaseApi.get('/chat_messages', {
      params: {
        status: 'eq.approved',
        order: 'created_at.asc'
      }
    });
    return response.data;
  },

  // Get all messages (for admin)
  async getAllMessages(): Promise<ChatMessageResponse[]> {
    const response = await supabaseApi.get('/chat_messages', {
      params: {
        order: 'created_at.desc'
      }
    });
    return response.data;
  },

  // Get messages by status
  async getMessagesByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<ChatMessageResponse[]> {
    const response = await supabaseApi.get('/chat_messages', {
      params: {
        status: `eq.${status}`,
        order: 'created_at.desc'
      }
    });
    return response.data;
  },

  // Create a new message
  async createMessage(message: {
    user_id: string;
    user_email: string;
    user_name?: string;
    user_avatar?: string;
    content: string;
    provider?: string;
  }): Promise<ChatMessageResponse> {
    const messageData = {
      ...message,
      status: 'pending',
      provider: message.provider || 'email'
    };
    
    const response = await supabaseApi.post('/chat_messages', messageData);
    return response.data[0];
  },

  // Update message status
  async updateMessageStatus(id: string, status: 'approved' | 'rejected'): Promise<ChatMessageResponse> {
    const response = await supabaseApi.patch(`/chat_messages?id=eq.${id}`, { status });
    return response.data[0];
  },

  // Delete a message
  async deleteMessage(id: string): Promise<void> {
    await supabaseApi.delete(`/chat_messages?id=eq.${id}`);
  }
};
