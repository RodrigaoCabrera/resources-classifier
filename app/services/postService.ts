import { supabase } from '../db/client';
import { Post, GetPostsParams } from '../types';

export const postService = {
  // Create a new post
  async createPost(postData: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Promise<Post> {
    const { data, error } = await supabase
      .from('posts')
      .insert([postData])
      .select();

    if (error) throw error;
    return data[0] as Post;
  },

  // Get all posts with related data
  async getPosts({ page = 1, limit = 10, filters = {} }: GetPostsParams = {}): Promise<Post[]> {
    let query = supabase
      .from('posts')
      .select(`
        *,
        author:author_id(id, name, title),
        topic:topic_id(id, name),
        category:category_id(id, name),
        technologies:post_technologies(technology_id(id, name))
      `);

    // Apply filters if provided
    if (filters.author_id) query = query.eq('author_id', filters.author_id);
    if (filters.topic_id) query = query.eq('topic_id', filters.topic_id);
    if (filters.category_id) query = query.eq('category_id', filters.category_id);
    if (filters.search) query = query.ilike('content', `%${filters.search}%`);

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error } = await query;

    if (error) throw error;
    return data as unknown as Post[];
  },

  // Get a single post by ID
  async getPostById(id: string): Promise<Post | null> {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:author_id(id, name, title),
        topic:topic_id(id, name),
        category:category_id(id, name),
        technologies:post_technologies(technology_id(id, name))
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Record not found
      throw error;
    }
    return data as unknown as Post;
  },

  // Update a post
  async updatePost(id: string, updates: Partial<Post>): Promise<Post> {
    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0] as Post;
  },

  // Delete a post
  async deletePost(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};