import { supabase } from '@/integrations/supabase/client';

export const updateUserPassword = async (email: string, newPassword: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('update-user-password', {
      body: { email, newPassword }
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating user password:', error);
    throw error;
  }
};