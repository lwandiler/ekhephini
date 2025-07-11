
// Re-export from sonner directly
import { toast } from 'sonner';

export { toast };

// Export the useToast hook for compatibility where needed
export const useToast = () => {
  return { toast };
};
