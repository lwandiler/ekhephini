
import React, { ReactNode } from 'react';
import { Facebook, Mail, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Message } from './types/messageTypes';

/**
 * Returns the appropriate icon for a message provider
 */
export const getProviderIcon = (provider: string): ReactNode => {
  switch (provider) {
    case 'facebook':
      return <Facebook size={16} className="text-blue-600" />;
    case 'twitter':
      return <svg className="w-4 h-4 text-blue-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M14.258 10.152L23.176 0h-2.113l-7.747 8.813L7.133 0H0l9.352 13.328L0 24h2.113l8.176-9.309 6.531 9.309h7.133zm-2.895 3.293l-.949-1.328L2.875 1.56h3.246l6.086 8.523.945 1.328 7.91 11.078h-3.246z"></path></svg>;
    case 'google':
      return <Mail size={16} className="text-red-500" />;
    default:
      return <MessageCircle size={16} className="text-gray-400" />;
  }
};

/**
 * Returns the appropriate badge for a message status
 */
export const getStatusBadge = (status: string): ReactNode => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
    case 'approved':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
    case 'rejected':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

/**
 * Formats a date for display
 */
export const formatDate = (dateString: string): { date: string, time: string } => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString()
  };
};
