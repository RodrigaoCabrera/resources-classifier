import { supabase } from '../db/client';
import { v4 as uuidv4 } from 'uuid';

async function seedDatabase() {
  if (!supabase) {
    console.error('Supabase admin client is not initialized.');
    return;
  }

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: 'rodrigaodev@gmail.com',
      password: '5a@r8iQV!u$jQLG',
    });

    if (error) {
      throw error;
    }
    console.log("Login successful");
    // Step 1: Insert sample authors
    console.log('Inserting sample authors...');
    const authorId1 = uuidv4(); // Generate a valid UUID
    const authorId2 = uuidv4(); // Generate a valid UUID
    const { data: authors, error: authorError } = await supabase
      .from('authors')
      .insert([
        { id: authorId1, name: 'David Cabrera', title: 'Frontend Engineer' },
      ])
      .select();

    if (authorError) {
      throw authorError;
    }
    console.log('✅ Authors inserted:', authors);

    // Step 2: Insert sample categories
    console.log('Inserting sample categories...');
    const categoryId1 = uuidv4(); // Generate a valid UUID
    const categoryId2 = uuidv4(); // Generate a valid UUID
    const { data: categories, error: categoryError } = await supabase
      .from('categories')
      .insert([
        { id: categoryId1, name: 'Web Development' },
        { id: categoryId2, name: 'Data Science' },
      ])
      .select();

    if (categoryError) {
      throw categoryError;
    }
    console.log('✅ Categories inserted:', categories);

    // Step 3: Insert sample topics
    console.log('Inserting sample topics...');
    const topicId1 = uuidv4(); // Generate a valid UUID
    const topicId2 = uuidv4(); // Generate a valid UUID
    const { data: topics, error: topicError } = await supabase
      .from('topics')
      .insert([
        { id: topicId1, name: 'React.js' },
        { id: topicId2, name: 'Machine Learning' },
      ])
      .select();

    if (topicError) {
      throw topicError;
    }
    console.log('✅ Topics inserted:', topics);

    // Step 4: Insert sample technologies
    console.log('Inserting sample technologies...');
    const technologyId1 = uuidv4(); // Generate a valid UUID
    const technologyId2 = uuidv4(); // Generate a valid UUID
    const { data: technologies, error: technologyError } = await supabase
      .from('technologies')
      .insert([
        { id: technologyId1, name: 'JavaScript' },
        { id: technologyId2, name: 'Python' },
      ])
      .select();

    if (technologyError) {
      throw technologyError;
    }
    console.log('✅ Technologies inserted:', technologies);

    // Step 5: Insert sample posts
    console.log('Inserting sample posts...');
    const postId1 = uuidv4(); // Generate a valid UUID
    const postId2 = uuidv4(); // Generate a valid UUID
    const { data: posts, error: postError } = await supabase
      .from('posts')
      .insert([
        {
          id: postId1,
          author_id: authorId1, // John Doe
          category_id: categoryId1, // Web Development
          topic_id: topicId1, // React.js
          content: 'This is a post about React.js best practices.',
          has_image: false,
        },
        {
          id: postId2,
          author_id: authorId2, // Jane Smith
          category_id: categoryId2, // Data Science
          topic_id: topicId2, // Machine Learning
          content: 'This is a post about machine learning algorithms.',
          has_image: false,
        },
      ])
      .select();

    if (postError) {
      throw postError;
    }
    console.log('✅ Posts inserted:', posts);

    // Step 6: Insert sample post-technologies relationships
    console.log('Inserting post-technologies relationships...');
    const { data: postTechnologies, error: postTechError } = await supabase
      .from('post_technologies')
      .insert([
        { post_id: postId1, technology_id: technologyId1 }, // React.js post -> JavaScript
        { post_id: postId2, technology_id: technologyId2 }, // Machine Learning post -> Python
      ])
      .select();

    if (postTechError) {
      throw postTechError;
    }
    console.log('✅ Post-technologies relationships inserted:', postTechnologies);

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

// Run the seed script
seedDatabase();