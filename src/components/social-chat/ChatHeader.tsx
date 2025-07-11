
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle } from 'lucide-react';

interface ChatHeaderProps {
  user: any;
  handleSignOut: () => Promise<void>;
  setIsDialogOpen: (isOpen: boolean) => void;
}

const ChatHeader = ({ user, handleSignOut, setIsDialogOpen }: ChatHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white p-4 rounded-t-lg flex justify-between items-center">
      <div className="flex items-center">
        <MessageCircle size={20} className="mr-2" />
        <h3 className="font-semibold">Community Chat</h3>
      </div>
      {user ? (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="ghost" className="p-0 hover:bg-transparent">
              <Avatar className="h-8 w-8 border-2 border-white">
                <AvatarImage src={user.user_metadata?.avatar_url || ''} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.email ? user.email[0].toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-56">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.user_metadata?.avatar_url || ''} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.email ? user.email[0].toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.user_metadata?.full_name || user.user_metadata?.name || user.email}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          </HoverCardContent>
        </HoverCard>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          className="text-white border-white hover:bg-white/20"
          onClick={() => setIsDialogOpen(true)}
        >
          Sign In
        </Button>
      )}
    </div>
  );
};

export default ChatHeader;
