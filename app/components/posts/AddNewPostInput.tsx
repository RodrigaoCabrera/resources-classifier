"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { importPosts } from '@/app/scripts/importData';
import { useSupabaseAuth } from '@/app/hooks/useSupabaseAuth';

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

export default function AddNewPostInput() {
  const [jsonData, setJsonData] = useState('');
  const [isSubmit, setIsSubmit] = useState(false);
  const [results, setResults] = useState<{ success: string[]; errors: string[] }>({ success: [], errors: [] });
  const router = useRouter();
  const { user, loading, error } = useSupabaseAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading]);

  if (loading || !user) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleImport = async () => {
    setResults({ success: [], errors: [] });
    try {
      const postsData = JSON.parse(jsonData) as PostDataImport[];
      if (!Array.isArray(postsData)) {
        throw new Error('Data must be an array of posts');
      }
      const { success, errors } = await importPosts(postsData);
      setResults({ success, errors });
    } catch (error: any) {
      setResults({
        success: [],
        errors: [`Failed to parse JSON: ${error.message}`],
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <>
      <article className="w-full bg-white p-6 rounded-lg shadow-md mb-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">Import JSON Data</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Paste JSON Data:
            </label>
            <textarea
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded h-64 font-mono"
              placeholder='[{"id": "123", "author": "Author Name", ...}]'
            />
          </div>
          <button
            onClick={handleImport}
            disabled={loading || !jsonData.trim()}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded disabled:bg-green-400"
          >
            {isSubmit ? 'Importing...' : 'Import Data'}
          </button>
        </section>
      </article>

      {(results.success.length > 0 || results.errors.length > 0) && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Import Results</h2>

          {results.success.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-green-600 mb-2">Success:</h3>
              <div className="bg-green-50 p-4 rounded border border-green-200 max-h-64 overflow-y-auto">
                {results.success.map((msg, i) => (
                  <p key={`success-${i}`} className="text-sm mb-1">{msg}</p>
                ))}
              </div>
            </div>
          )}

          {results.errors.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-red-600 mb-2">Errors:</h3>
              <div className="bg-red-50 p-4 rounded border border-red-200 max-h-64 overflow-y-auto">
                {results.errors.map((msg, i) => (
                  <p key={`error-${i}`} className="text-sm mb-1">{msg}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}