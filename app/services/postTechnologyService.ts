import { supabase } from '@/app/db/client';
import { PostTechnology } from '@/app/types';

export const postTechnologyService = {
  // Add technologies to a post
  async addTechnologiesToPost(postId: string, technologyIds: string[]): Promise<PostTechnology[]> {
    const relationships = technologyIds.map(techId => ({
      post_id: postId,
      technology_id: techId
    }));

    const { data, error } = await supabase
      .from('post_technologies')
      .insert(relationships)
      .select();

    if (error) throw error;
    return data as PostTechnology[];
  },

  // Remove a technology from a post
  async removeTechnologyFromPost(postId: string, technologyId: string): Promise<boolean> {
    const { error } = await supabase
      .from('post_technologies')
      .delete()
      .match({ post_id: postId, technology_id: technologyId });

    if (error) throw error;
    return true;
  },

  // Get all technologies for a post
  async getPostTechnologies(postId: string): Promise<PostTechnology[]> {
    const { data, error } = await supabase
      .from('post_technologies')
      .select('*, technology:technology_id(*)')
      .eq('post_id', postId);

    if (error) throw error;
    return data as unknown as PostTechnology[];
  }
};