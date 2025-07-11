
export interface Message {
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

export type MessageFilter = 'all' | 'pending' | 'approved' | 'rejected';
