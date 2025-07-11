
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Facebook, Mail } from 'lucide-react';

interface LoginDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  handleSignIn: (provider: 'facebook' | 'twitter' | 'google') => Promise<void>;
}

const LoginDialog = ({ isOpen, onOpenChange, handleSignIn }: LoginDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Sign in to Chat</DialogTitle>
          <DialogDescription className="text-center">
            Connect with your social account to join the conversation
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <Button 
            onClick={() => {
              handleSignIn('facebook');
              onOpenChange(false);
            }} 
            variant="outline" 
            className="w-full flex items-center justify-center space-x-2"
          >
            <Facebook size={20} className="text-blue-600" />
            <span>Continue with Facebook</span>
          </Button>
          <Button 
            onClick={() => {
              handleSignIn('google');
              onOpenChange(false);
            }} 
            variant="outline" 
            className="w-full flex items-center justify-center space-x-2"
          >
            <Mail size={20} className="text-red-500" />
            <span>Continue with Gmail</span>
          </Button>
          <Button 
            onClick={() => {
              handleSignIn('twitter');
              onOpenChange(false);
            }} 
            variant="outline" 
            className="w-full flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5 text-blue-400 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M14.258 10.152L23.176 0h-2.113l-7.747 8.813L7.133 0H0l9.352 13.328L0 24h2.113l8.176-9.309 6.531 9.309h7.133zm-2.895 3.293l-.949-1.328L2.875 1.56h3.246l6.086 8.523.945 1.328 7.91 11.078h-3.246z"></path></svg>
            <span>Continue with X</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
