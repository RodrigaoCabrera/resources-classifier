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
export async function importPosts(postsData: PostDataImport[]): Promise<{ success: string[]; errors: string[] }> {
  const successMessages: string[] = [];
  const errorMessages: string[] = [];

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
        successMessages.push(`Found existing author: ${postData.author}`);
      } else {
        const { data: newAuthor, error: authorError } = await supabase
          .from('authors')
          .insert({ name: postData.author, title: postData.authorTitle })
          .select();

        if (authorError) throw authorError;
        authorId = newAuthor[0].id;
        successMessages.push(`Created new author: ${postData.author}`);
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
        successMessages.push(`Found existing topic: ${postData.topic}`);
      } else {
        const { data: newTopic, error: topicError } = await supabase
          .from('topics')
          .insert({ name: postData.topic })
          .select();
        if (topicError) throw topicError;
        topicId = newTopic[0].id;
        successMessages.push(`Created new topic: ${postData.topic}`);
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
        successMessages.push(`Found existing category: ${postData.category}`);
      } else {
        const { data: newCategory, error: categoryError } = await supabase
          .from('categories')
          .insert({ name: postData.category })
          .select();

        if (categoryError) throw categoryError;
        categoryId = newCategory[0].id;
        successMessages.push(`Created new category: ${postData.category}`);
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
          posted_at: new Date().toISOString(), // You could parse postData.timeAgo into a proper date
        })
        .select();

      if (postError) throw postError;
      successMessages.push(`Created post: ${postData.id}`);

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
            successMessages.push(`Found existing technology: ${techName}`);
          } else {
            const { data: newTech, error: techError } = await supabase
              .from('technologies')
              .insert({ name: techName })
              .select();

            if (techError) throw techError;
            techId = newTech[0].id;
            successMessages.push(`Created new technology: ${techName}`);
          }

          // Create relationship
          const { error: relError } = await supabase
            .from('post_technologies')
            .insert({
              post_id: newPost[0].id,
              technology_id: techId,
            });

          if (relError) throw relError;
          successMessages.push(`Linked technology: ${techName} to post: ${postData.id}`);
        }
      }
    } catch (error: any) {
      errorMessages.push(`Error importing post ${postData.id}: ${error.message}`);
    }
  }

  return { success: successMessages, errors: errorMessages };
}

const mockPostsData: PostDataImport[] = [
  {
    "id": "7295093221129383936",
    "author": "Miguel Ángel Durán García",
    "authorTitle": "Programación JavaScript y Desarrollo Web. Reconocido Google Developer Expert, Microsoft MVP y GitHub Star. ⭐",
    "timeAgo": "2 semanas",
    "content": "¡Proyectazo! Crea productos o startups más rápido.\n¡Esta plantilla de código abierto tiene lo que necesitas!\n\n✓ Basado en Next.js\n✓ Pagos con Stripe o Lemon Squeezy\n✓ Auth de usuarios y base de datos\n✓ Envío de correos con Mailgun\n\n$ git clone shipfree",
    "hasImage": true,
    "imageUrl": "https://media.licdn.com/dms/image/v2/D4D10AQHJsaa9Uk99vg/image-shrink_480/B4DZT1gmtGHkAw-/0/1739285755028?e=1741446000&amp;v=beta&amp;t=TMkBfln1g5UZK6eJ0Sne3UnlMDgbTB-EPKslEFS3CLs",
    "topic": "Web Development",
    "category": "Starter Template",
    "technology": ["Next.js", "Stripe", "Lemon Squeezy", "Authentication", "Database", "Mailgun"]
  },
  {
    "id": "7286049366694391809",
    "author": "Miguel Ángel Durán García",
    "authorTitle": "Programación JavaScript y Desarrollo Web. Reconocido Google Developer Expert, Microsoft MVP y GitHub Star. ⭐",
    "timeAgo": "1 mes",
    "content": "¿La mejor alternativa a WordPress? ¡Ojo con esto!\nPayload es un framework que funciona con Next.js\n\nPuedes crear Tiendas, Blogs, Landings y más.\n\nSi este post llega a 2000 likes, hago un curso gratuito.\n\n$ npx create-payload-app",
    "hasImage": true,
    "imageUrl": "https://media.licdn.com/dms/image/v2/D4D10AQHFIsKWsALeUQ/image-shrink_480/image-shrink_480/0/1737129532288?e=1741446000&amp;v=beta&amp;t=MzEV3rnIo2SEo-dhJN5i_gEgBR7lAQPfK3o4v_PJY68",
    "imageAlt": "El backend para construir la web moderna, Payload.",
    "topic": "Web Development",
    "category": "CMS",
    "technology": ["Payload", "Next.js"]
  },
  {
    "id": "7293659507136593920",
    "author": "Miguel Ángel Durán García",
    "authorTitle": "Programación JavaScript y Desarrollo Web. Reconocido Google Developer Expert, Microsoft MVP y GitHub Star. ⭐",
    "timeAgo": "3 semanas",
    "content": "HTML parece fácil pero...\n\n¿Puedes usar un <ul> dentro de un <p>?\n¿Y un <span> dentro de un <button>?\n\n¡Demasiadas combinaciones que recordar!\n\nEste recurso te ayuda con la semántica de tu web:\n→ caninclude.glitch.me",
    "hasImage": true,
    "imageUrl": "https://media.licdn.com/dms/image/v2/D4D10AQHcbFRe8EnmnQ/image-shrink_480/B4DZThIqipG4Ak-/0/1738943933615?e=1741446000&amp;v=beta&amp;t=QGWsWtDyboM3HIBAgrGO4bhWLv74H4N6sD__Rvag-hs",
    "topic": "Web Development",
    "category": "HTML Reference",
    "technology": ["HTML", "Web Semantics"]
  }
]