// scripts/importData.ts
import { supabase } from '@/app/db/client';

interface PostDataImport {
  id: string;
  author: string;
  authorTitle?: string;
  timeAgo: string;
  content: string;
  hasImage?: boolean;
  imageUrl?: string;
  imageAlt?: string;
  topic: string;
  category: string;
  technology?: string[];
}

/**
 * Import posts from JSON data
 * @param postsData - Array of post objects from your JSON
 */
export async function importPosts(postsData: PostDataImport[]): Promise<void> {
  for (const postData of postsData) {
    try {
      // 1. Find or create author
      let authorId: string;
      const { data: existingAuthor } = await supabase
        .from('authors')
        .select('id')
        .eq('name', postData.author)
        .single();

      if (existingAuthor) {
        authorId = existingAuthor.id;
      } else {
        const { data: newAuthor, error: authorError } = await supabase
          .from('authors')
          .insert({ name: postData.author, title: postData.authorTitle })
          .select();

        if (authorError) throw authorError;
        authorId = newAuthor[0].id;
      }

      // 2. Find or create topic
      let topicId: string;
      const { data: existingTopic } = await supabase
        .from('topics')
        .select('id')
        .eq('name', postData.topic)
        .single();

      if (existingTopic) {
        topicId = existingTopic.id;
      } else {
        const { data: newTopic, error: topicError } = await supabase
          .from('topics')
          .insert({ name: postData.topic })
          .select();

        if (topicError) throw topicError;
        topicId = newTopic[0].id;
      }

      // 3. Find or create category
      let categoryId: string;
      const { data: existingCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('name', postData.category)
        .single();

      if (existingCategory) {
        categoryId = existingCategory.id;
      } else {
        const { data: newCategory, error: categoryError } = await supabase
          .from('categories')
          .insert({ name: postData.category })
          .select();

        if (categoryError) throw categoryError;
        categoryId = newCategory[0].id;
      }

      // 4. Create the post
      const { data: newPost, error: postError } = await supabase
        .from('posts')
        .insert({
          external_id: postData.id,
          author_id: authorId,
          topic_id: topicId,
          category_id: categoryId,
          content: postData.content,
          has_image: postData.hasImage || false,
          image_url: postData.imageUrl || null,
          image_alt: postData.imageAlt || null,
          posted_at: new Date().toISOString()  // You could parse postData.timeAgo into a proper date
        })
        .select();

      if (postError) throw postError;

      // 5. Create technology relationships
      if (postData.technology && Array.isArray(postData.technology)) {
        for (const techName of postData.technology) {
          // Find or create technology
          let techId: string;
          const { data: existingTech } = await supabase
            .from('technologies')
            .select('id')
            .eq('name', techName)
            .single();

          if (existingTech) {
            techId = existingTech.id;
          } else {
            const { data: newTech, error: techError } = await supabase
              .from('technologies')
              .insert({ name: techName })
              .select();

            if (techError) throw techError;
            techId = newTech[0].id;
          }

          // Create relationship
          const { error: relError } = await supabase
            .from('post_technologies')
            .insert({
              post_id: newPost[0].id,
              technology_id: techId
            });

          if (relError) throw relError;
        }
      }

      console.log(`Successfully imported post: ${postData.id}`);
    } catch (error) {
      console.error(`Error importing post ${postData.id}:`, error);
    }
  }

  console.log('Import complete');
}

// Example usage for your testing:
/*
import { posts } from './your-json-data';

// Run the import (you would execute this script directly)
(async () => {
  try {
    await importPosts(posts);
  } catch (error) {
    console.error('Import failed:', error);
  }
})();
*/