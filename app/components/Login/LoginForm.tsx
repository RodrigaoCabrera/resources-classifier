'use client'
import { useSupabaseAuth } from '@/app/hooks/useSupabaseAuth';
import { authService } from '@/app/services/authService';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Credentials {
  email: string;
  password: string;
}
export default function LoginForm() {
  const router = useRouter()
  const [credentials, setCredentials] = useState<Credentials>({
    email: '',
    password: '',
  }); const { user, loading, error } = useSupabaseAuth();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user]);

  if (loading || user) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleChange = async (event: any) => {
    const credentialKey = event.target.name;
    const credentialValue = event.target.value;

    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [credentialKey]: credentialValue,
    }));
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const { user } = await authService.signIn(credentials);
      if (!user) {
        console.error('Error logging in');
        return;
      }
      console.log('redirecting to /posts/create-post');
      router.push('/posts/create-post');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  }


  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}