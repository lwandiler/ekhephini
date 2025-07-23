import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { newsletterService } from '@/services/api/newsletterService';
import { useToast } from '@/hooks/use-toast';

interface NewsletterFormProps {
  variant?: 'modern' | 'classic' | 'news';
  className?: string;
}

const NewsletterForm = ({ variant = 'modern', className = '' }: NewsletterFormProps) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const result = await newsletterService.subscribe({
        email: email.trim(),
        name: name.trim() || undefined
      });

      if (result.success) {
        toast({
          title: "Success!",
          description: "You've been successfully subscribed to our newsletter.",
        });
        setEmail('');
        setName('');
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to subscribe. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'modern') {
    return (
      <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row items-center gap-4 max-w-lg mx-auto ${className}`}>
        <Input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address" 
          className="w-full px-6 py-4 rounded-full flex-1 bg-white/10 border border-green-400/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
          disabled={loading}
        />
        <Button 
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-full px-8 py-4"
        >
          <Mail className="mr-2" />
          {loading ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
    );
  }

  if (variant === 'news') {
    return (
      <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 ${className}`}>
        <Input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address" 
          className="px-4 py-2 border rounded-md flex-1"
          disabled={loading}
        />
        <Button 
          type="submit"
          disabled={loading}
          className="bg-radio-accent hover:bg-radio-accent/80 text-white px-6 py-2 rounded-md font-medium"
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
    );
  }

  // Default/classic variant
  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-4 max-w-md mx-auto ${className}`}>
      <Input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address" 
        className="flex-1"
        disabled={loading}
      />
      <Button 
        type="submit"
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        <Mail className="mr-2" />
        {loading ? 'Subscribing...' : 'Subscribe'}
      </Button>
    </form>
  );
};

export default NewsletterForm;