
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Send, Smile } from 'lucide-react';
import data from '@emoji-mart/data';
// Using direct imports from the packages
import Picker from '@emoji-mart/react';

interface ChatInputProps {
  user: any;
  onSubmit: (content: string) => Promise<void>;
}

const ChatInput = ({ user, onSubmit }: ChatInputProps) => {
  const [input, setInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    await onSubmit(input);
    setInput('');
  };

  const addEmoji = (emoji: any) => {
    setInput(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
      <div className="flex items-center space-x-2">
        <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
          <PopoverTrigger asChild>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="text-gray-500 hover:text-purple-600"
            >
              <Smile size={20} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 border-none" align="start">
            <div className="emoji-picker-container">
              <Picker 
                data={data} 
                onEmojiSelect={addEmoji}
                theme="light"
              />
            </div>
          </PopoverContent>
        </Popover>
        
        <Input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1"
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={!input.trim()}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Send size={18} />
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Messages will be reviewed before appearing in the chat
      </p>
    </form>
  );
};

export default ChatInput;
