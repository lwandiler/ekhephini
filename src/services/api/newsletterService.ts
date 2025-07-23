import { supabase } from '@/integrations/supabase/client';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  subscribed_at: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubscriptionRequest {
  email: string;
  name?: string;
}

export const newsletterService = {
  // Subscribe a new email to the newsletter
  async subscribe(data: NewsletterSubscriptionRequest): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{
          email: data.email,
          name: data.name || null,
        }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          return { success: false, error: 'This email is already subscribed.' };
        }
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      return { success: false, error: 'Failed to subscribe. Please try again.' };
    }
  },

  // Get all newsletter subscribers (admin only)
  async getSubscribers(): Promise<NewsletterSubscriber[]> {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching newsletter subscribers:', error);
      return [];
    }
  },

  // Unsubscribe an email (admin only)
  async unsubscribe(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ active: false })
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error unsubscribing:', error);
      return { success: false, error: 'Failed to unsubscribe.' };
    }
  },

  // Delete a subscriber (admin only)
  async deleteSubscriber(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      return { success: false, error: 'Failed to delete subscriber.' };
    }
  }
};