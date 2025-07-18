import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export type Page = Tables<'pages'>;
export type NewPage = TablesInsert<'pages'>;

export const pagesService = {
  // Fetch all published pages
  async getPublishedPages(): Promise<Page[]> {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('published', true)
      .order('title', { ascending: true });

    if (error) {
      console.error('Error fetching published pages:', error);
      throw error;
    }

    return data || [];
  },

  // Fetch all pages (admin only)
  async getAllPages(): Promise<Page[]> {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all pages:', error);
      throw error;
    }

    return data || [];
  },

  // Get a single page by ID
  async getPageById(id: string): Promise<Page> {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', id)
      .eq('published', true)
      .single();

    if (error) {
      console.error('Error fetching page:', error);
      throw error;
    }

    return data;
  },

  // Get a single page by slug
  async getPageBySlug(slug: string): Promise<Page> {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) {
      console.error('Error fetching page by slug:', error);
      throw error;
    }

    return data;
  },

  // Create a new page
  async createPage(page: Omit<NewPage, 'id' | 'created_at' | 'updated_at'>): Promise<Page> {
    const { data, error } = await supabase
      .from('pages')
      .insert({
        ...page,
        published_at: page.published ? new Date().toISOString() : null
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating page:', error);
      throw error;
    }

    return data;
  },

  // Update a page
  async updatePage(id: string, page: Partial<NewPage>): Promise<Page> {
    const updateData: any = { ...page };
    
    // If publishing the page, set published_at
    if (page.published && !updateData.published_at) {
      updateData.published_at = new Date().toISOString();
    }
    
    const { data, error } = await supabase
      .from('pages')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating page:', error);
      throw error;
    }

    return data;
  },

  // Delete a page
  async deletePage(id: string): Promise<void> {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting page:', error);
      throw error;
    }
  },

  // Generate slug from title
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
};