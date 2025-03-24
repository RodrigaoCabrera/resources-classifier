'use client'
import Link from 'next/link';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

export default function AddPostButton() {
  const { user } = useSupabaseAuth()

  return (
    <Link
      href={user ? '/posts/create-post' : '/login'}
      className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
    >
      Add New Post
    </Link>
  );
}