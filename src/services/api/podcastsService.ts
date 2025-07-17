
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Podcast = Tables<'podcasts'>;
export type PodcastInsert = TablesInsert<'podcasts'>;
export type PodcastUpdate = TablesUpdate<'podcasts'>;

export const podcastsService = {
  async getAllPodcasts() {
    const { data, error } = await supabase
      .from('podcasts')
      .select('*')
      .eq('active', true)
      .order('publish_date', { ascending: false });

    if (error) {
      console.error('Error fetching podcasts:', error);
      throw error;
    }

    return data || [];
  },

  async getAllPodcastsForAdmin() {
    const { data, error } = await supabase
      .from('podcasts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching podcasts for admin:', error);
      throw error;
    }

    return data || [];
  },

  async createPodcast(podcast: PodcastInsert) {
    const { data, error } = await supabase
      .from('podcasts')
      .insert([podcast])
      .select()
      .single();

    if (error) {
      console.error('Error creating podcast:', error);
      throw error;
    }

    return data;
  },

  async updatePodcast(id: string, podcast: PodcastUpdate) {
    const { data, error } = await supabase
      .from('podcasts')
      .update(podcast)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating podcast:', error);
      throw error;
    }

    return data;
  },

  async deletePodcast(id: string) {
    const { error } = await supabase
      .from('podcasts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting podcast:', error);
      throw error;
    }
  },

  async togglePodcastStatus(id: string, active: boolean) {
    return this.updatePodcast(id, { active });
  }
};
