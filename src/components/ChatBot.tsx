
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Send, X } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m RadioBot. How can I help you today?',
      isBot: true,
      timestamp: new Date()
    }
  ]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isBot: false,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setMessage('');
    
    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponses = [
        "Thanks for your message! Our team will get back to you soon.",
        "I can help you find information about our shows. What are you looking for?",
        "Our live stream is available 24/7. You can listen by clicking the play button at the bottom of the page.",
        "Would you like to know more about our upcoming events?",
        "You can find our schedule on the Shows page."
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage: Message = {
        id: Date.now().toString(),
        text: randomResponse,
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
    }, 1000);
  };

  return (
    <>
      {/* Chat button */}
      <Button 
        className={`fixed z-40 bottom-20 md:bottom-24 right-4 md:right-8 rounded-full w-12 h-12 shadow-lg ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-radio-accent hover:bg-radio-accent/80'}`}
        size="icon" 
        onClick={toggleChat}
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </Button>
      
      {/* Chat window */}
      {isOpen && (
        <div className="fixed z-40 bottom-36 md:bottom-40 right-4 md:right-8 w-80 md:w-96 bg-white rounded-lg shadow-xl border border-gray-200">
          <div className="bg-radio-blue text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <Bot size={20} className="mr-2" />
              <h3 className="font-semibold">RadioBot</h3>
            </div>
            <span className="text-xs bg-green-500 px-2 py-1 rounded-full">Online</span>
          </div>
          
          <div className="h-80 overflow-y-auto p-4 flex flex-col space-y-3">
            {messages.map(msg => (
              <div 
                key={msg.id} 
                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.isBot 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'bg-radio-accent text-white'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" className="bg-radio-accent hover:bg-radio-accent/80">
              <Send size={18} />
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
