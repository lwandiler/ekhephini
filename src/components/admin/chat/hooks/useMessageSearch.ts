
import { useState, useMemo } from 'react';
import { Message } from '../types/messageTypes';

export const useMessageSearch = (messages: Message[]) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMessages = useMemo(() => {
    if (searchTerm === '') return messages;
    
    const term = searchTerm.toLowerCase();
    
    return messages.filter(message => {
      const userEmail = message.user_email.toLowerCase();
      const userName = (message.user_name || '').toLowerCase();
      const content = message.content.toLowerCase();
      
      return userEmail.includes(term) || 
             userName.includes(term) || 
             content.includes(term);
    });
  }, [messages, searchTerm]);

  return { 
    searchTerm, 
    setSearchTerm, 
    filteredMessages 
  };
};
