// scripts/test-db-connection.ts
import { postService } from '../services/postService';
import { supabase } from '../db/client';
import { config } from 'dotenv';
config();

async function testDatabaseConnection() {
  try {
    // Test basic Supabase connection
    console.log('Testing Supabase connection...');
    const { count, error } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true });

    if (error) {
      throw error;
    }

    console.log('✅ Supabase connection successful');
    console.log(`Total posts in database: ${count}`);

    // Test creating a post
    console.log('\nTesting post creation...');
    const newPost = await postService.createPost({
      author_id: "a3f29993-95f2-4b03-827b-f0ecabc1ac5f", // Use the authenticated user's ID
      topic_id: '06f93799-6f24-4665-8b5c-26689e4ba14f',
      category_id: 'f7f189f2-1463-4f1f-a57a-92678a473b29',
      content: 'This is a test post created by the connection test script with a RLS active',
      has_image: false
    });

    console.log('✅ Post created successfully:');
    console.log(JSON.stringify(newPost, null, 2));

    // Test getting posts
    console.log('\nTesting getting posts...');
    const posts = await postService.getPosts({ limit: 5 });

    console.log(`✅ Retrieved ${posts.length} posts successfully`);
    console.log('First post sample:');
    console.log(JSON.stringify(posts[0], null, 2));

    // Test getting single post
    console.log('\nTesting getting a single post...');
    const singlePost = await postService.getPostById("066c9487-ba0f-4a16-872e-ff330ee11e97");

    console.log('✅ Retrieved single post successfully:');
    console.log(JSON.stringify(singlePost, null, 2));


    // Test updating a post
    console.log('\nTesting post update...');
    const updatedPost = await postService.updatePost("066c9487-ba0f-4a16-872e-ff330ee11e97", {
      content: 'This post was updated by the test script'
    });

    console.log('✅ Post updated successfully:');
    console.log(JSON.stringify(updatedPost, null, 2));


    // Test deleting the post (clean up)
    console.log('\nCleaning up - deleting test post...');
    const deleteResult = await postService.deletePost("066c9487-ba0f-4a16-872e-ff330ee11e97");

    console.log(`✅ Post deleted successfully: ${deleteResult}`);

    console.log('\n🎉 All database tests completed successfully!');
  } catch (error) {
    console.error('❌ Error testing database connection:', error);
  } finally {
    // Close the connection
    await supabase.auth.signOut();
  }
}

// Run the test
testDatabaseConnection()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Unhandled error:', err);
    process.exit(1);
  });