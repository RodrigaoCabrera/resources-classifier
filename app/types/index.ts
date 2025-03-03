// types/index.ts

export type Author = {
  id: string;
  name: string;
  title?: string;
  created_at?: string;
  updated_at?: string;
}

export type Topic = {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export type Category = {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export type Technology = {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export type Post = {
  id: string;
  external_id?: string;
  author_id: string;
  topic_id: string;
  category_id: string;
  content: string;
  has_image: boolean;
  image_url?: string;
  image_alt?: string;
  posted_at?: string;
  created_at?: string;
  updated_at?: string;

  // Join fields (not in the actual table)
  author?: Author;
  topic?: Topic;
  category?: Category;
  technologies?: Technology[];
}

export type PostTechnology = {
  id: string;
  post_id: string;
  technology_id: string;
  created_at?: string;
}

export type UserRole = 'admin' | 'editor' | 'user';

export type UserProfile = {
  id: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

export type User = {
  id: string;
  email?: string;
  profile?: UserProfile;
}

// Filter types
export type PostFilters = {
  author_id?: string;
  topic_id?: string;
  category_id?: string;
  search?: string;
  technology_id?: string;
}

export type PaginationParams = {
  page?: number;
  limit?: number;
}

export type GetPostsParams = PaginationParams & {
  filters?: PostFilters;
}