
import { Button } from '@/components/ui/button';
import { Facebook, Mail } from 'lucide-react';

interface LoginSectionProps {
  handleSignIn: (provider: 'facebook' | 'twitter' | 'google') => Promise<void>;
}

const LoginSection = ({ handleSignIn }: LoginSectionProps) => {
  return (
    <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg flex flex-col items-center">
      <p className="text-sm text-gray-600 mb-3">Sign in to join the conversation</p>
      <div className="flex space-x-2">
        <Button 
          onClick={() => handleSignIn('facebook')} 
          variant="outline" 
          size="sm"
          className="flex items-center space-x-1"
        >
          <Facebook size={16} className="text-blue-600" />
          <span>Facebook</span>
        </Button>
        <Button 
          onClick={() => handleSignIn('google')} 
          variant="outline" 
          size="sm"
          className="flex items-center space-x-1"
        >
          <Mail size={16} className="text-red-500" />
          <span>Gmail</span>
        </Button>
        <Button 
          onClick={() => handleSignIn('twitter')} 
          variant="outline" 
          size="sm"
          className="flex items-center space-x-1"
        >
          <svg className="w-4 h-4 text-blue-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M14.258 10.152L23.176 0h-2.113l-7.747 8.813L7.133 0H0l9.352 13.328L0 24h2.113l8.176-9.309 6.531 9.309h7.133zm-2.895 3.293l-.949-1.328L2.875 1.56h3.246l6.086 8.523.945 1.328 7.91 11.078h-3.246z"></path></svg>
          <span>X</span>
        </Button>
      </div>
    </div>
  );
};

export default LoginSection;
