import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export type BlogPost = Tables<'blog_posts'>;
export type NewBlogPost = TablesInsert<'blog_posts'>;

export const blogService = {
  // Fetch all published blog posts
  async getPublishedPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }

    return data || [];
  },

  // Fetch all blog posts (admin only)
  async getAllPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all blog posts:', error);
      throw error;
    }

    return data || [];
  },

  // Create a new blog post
  async createPost(post: Omit<NewBlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        ...post,
        published_at: post.published ? new Date().toISOString() : null
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }

    return data;
  },

  // Update a blog post
  async updatePost(id: string, post: Partial<NewBlogPost>): Promise<BlogPost> {
    const updateData: any = { ...post };
    
    // If publishing the post, set published_at
    if (post.published && !updateData.published_at) {
      updateData.published_at = new Date().toISOString();
    }
    
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }

    return data;
  },

  // Delete a blog post
  async deletePost(id: string): Promise<void> {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  },

  // Get a single blog post by ID
  async getPostById(id: string): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .eq('published', true)
      .single();

    if (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    }

    return data;
  },

  // Get posts by category
  async getPostsByCategory(category: string): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .eq('category', category)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts by category:', error);
      throw error;
    }

    return data || [];
  }
};