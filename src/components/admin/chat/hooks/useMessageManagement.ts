
import { useState } from 'react';
import { Message, MessageFilter } from '../types/messageTypes';
import { useMessageQuery } from './useMessageQuery';
import { useMessageActions } from './useMessageActions';
import { useMessageSearch } from './useMessageSearch';

export const useMessageManagement = () => {
  const [filter, setFilter] = useState<MessageFilter>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  const { messages, loading } = useMessageQuery(filter);
  const { handleApprove, handleReject, handleDelete } = useMessageActions();
  const { searchTerm, setSearchTerm, filteredMessages } = useMessageSearch(messages);

  const viewMessage = (message: Message) => {
    setSelectedMessage(message);
    setIsViewDialogOpen(true);
  };

  return {
    messages: filteredMessages,
    loading,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    selectedMessage,
    setSelectedMessage,
    isViewDialogOpen,
    setIsViewDialogOpen,
    handleApprove,
    handleReject,
    handleDelete,
    viewMessage
  };
};
