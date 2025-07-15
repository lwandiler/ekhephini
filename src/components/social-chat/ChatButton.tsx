
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';

interface ChatButtonProps {
  isOpen: boolean;
  toggleChat: () => void;
}

const ChatButton = ({ isOpen, toggleChat }: ChatButtonProps) => {
  return (
    <Button
      className={`fixed z-40 bottom-40 md:bottom-44 right-4 md:right-8 rounded-full w-12 h-12 shadow-lg ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}
      size="icon"
      onClick={toggleChat}
    >
      {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
    </Button>
  );
};

export default ChatButton;
