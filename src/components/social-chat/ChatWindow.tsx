
import { useState } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import LoginSection from './LoginSection';

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

interface ChatWindowProps {
  isOpen: boolean;
  user: any;
  messages: Message[];
  setIsDialogOpen: (isOpen: boolean) => void;
  handleSignOut: () => Promise<void>;
  handleSignIn: (provider: 'facebook' | 'twitter' | 'google') => Promise<void>;
  onSubmitMessage: (content: string) => Promise<void>;
}

const ChatWindow = ({ 
  isOpen, 
  user, 
  messages, 
  setIsDialogOpen, 
  handleSignOut, 
  handleSignIn, 
  onSubmitMessage 
}: ChatWindowProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed z-40 bottom-56 md:bottom-60 right-4 md:right-8 w-80 md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 animate-fade-in">
      <ChatHeader 
        user={user} 
        handleSignOut={handleSignOut} 
        setIsDialogOpen={setIsDialogOpen} 
      />
      
      <MessageList 
        messages={messages} 
        user={user} 
        setIsDialogOpen={setIsDialogOpen} 
      />
      
      {user ? (
        <ChatInput 
          user={user} 
          onSubmit={onSubmitMessage} 
        />
      ) : (
        <LoginSection handleSignIn={handleSignIn} />
      )}
    </div>
  );
};

export default ChatWindow;
