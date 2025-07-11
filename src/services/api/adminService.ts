import axios from 'axios';
import bcrypt from 'bcryptjs';
import { supabase } from '@/integrations/supabase/client';

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  user?: AdminUser;
  error?: string;
}

export const adminService = {
  async login(credentials: AdminLoginRequest): Promise<AdminLoginResponse> {
    try {
      const { data: adminUsers, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', credentials.username)
        .eq('active', true)
        .single();

      if (error || !adminUsers) {
        return { success: false, error: 'Invalid username or password' };
      }

      // For now, we'll use simple password comparison
      // In production, you should use proper password hashing
      const validPassword = 
        (credentials.password === 'password123' && credentials.username === 'admin') ||
        (credentials.password === 'manager456' && credentials.username === 'manager') ||
        (credentials.password === 'defaultpassword123' && credentials.username === 'yokow');

      if (!validPassword) {
        return { success: false, error: 'Invalid username or password' };
      }

      return {
        success: true,
        user: {
          id: adminUsers.id,
          username: adminUsers.username,
          name: adminUsers.name,
          active: adminUsers.active,
          created_at: adminUsers.created_at,
          updated_at: adminUsers.updated_at,
        }
      };
    } catch (error) {
      console.error('Admin login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  },

  async createAdmin(username: string, password: string, name: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('admin_users')
        .insert([{
          username,
          password_hash: password, // In production, hash this properly
          name,
          active: true
        }]);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Create admin error:', error);
      return { success: false, error: 'Failed to create admin user' };
    }
  }
};