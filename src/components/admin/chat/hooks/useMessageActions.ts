
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Message } from '../types/messageTypes';

export const useMessageActions = (
  onSuccess?: (message: Message) => void
) => {
  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({ status: 'approved' })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Message Approved",
        description: "The message has been approved and is now visible in the chat.",
      });
      
    } catch (error) {
      console.error('Error approving message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve message. Please try again.",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({ status: 'rejected' })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Message Rejected",
        description: "The message has been rejected and will not be shown in the chat.",
      });
      
    } catch (error) {
      console.error('Error rejecting message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reject message. Please try again.",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Message Deleted",
        description: "The message has been permanently deleted.",
      });
      
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete message. Please try again.",
      });
    }
  };

  return {
    handleApprove,
    handleReject,
    handleDelete,
  };
};
