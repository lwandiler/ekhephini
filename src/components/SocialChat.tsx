
import { useState, useEffect, useRef } from 'react';
import { useChatMessages } from './social-chat/useChatMessages';
import { useAuth } from './social-chat/useAuth';
import ChatButton from './social-chat/ChatButton';
import ChatWindow from './social-chat/ChatWindow';
import LoginDialog from './social-chat/LoginDialog';

const SocialChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { messages, sendMessage } = useChatMessages();
  const { user, handleSignIn, handleSignOut } = useAuth();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmitMessage = async (content: string) => {
    if (user) {
      await sendMessage(user, content);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <ChatButton isOpen={isOpen} toggleChat={toggleChat} />

      {/* Chat Window */}
      <ChatWindow 
        isOpen={isOpen}
        user={user}
        messages={messages}
        setIsDialogOpen={setIsDialogOpen}
        handleSignOut={handleSignOut}
        handleSignIn={handleSignIn}
        onSubmitMessage={handleSubmitMessage}
      />

      {/* Login Dialog */}
      <LoginDialog 
        isOpen={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        handleSignIn={handleSignIn} 
      />
    </>
  );
};

export default SocialChat;
