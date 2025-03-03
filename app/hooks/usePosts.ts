// hooks/usePosts.ts
import { useEffect, useState } from 'react';
import { Post, GetPostsParams } from '../types';
import { postService } from '../services/postService';

export function usePosts(params: GetPostsParams = {}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await postService.getPosts(params);
        setPosts(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [params.page, params.limit, JSON.stringify(params.filters)]);

  return { posts, loading, error };
}

// Similar hooks for other entities...