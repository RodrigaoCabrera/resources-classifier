import { postService } from "../services/postService";
import getRelativeTime from "../utils/getRelativeTime";

const posts = await postService.getPosts({ limit: 10 });

export default function ResourcePosts() {
  if (!posts || posts.length === 0) return null;
  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {posts.map((resource) => {
            const relativeTime = getRelativeTime(resource.created_at)

            return (
              <div
                key={resource.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {/* Author Section */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        className="h-12 w-12 rounded-full"
                        src="https://via.placeholder.com/150" // Replace with actual author image URL
                        alt={resource?.author?.name || 'Author image'}
                      />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {resource?.author?.name}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {resource?.author?.title}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <p className="text-gray-700 whitespace-pre-line">
                    {resource.content}
                  </p>
                  {resource.has_image && (
                    <img
                      src={resource.image_url}
                      alt={resource.image_alt || 'Resource image'}
                      className="mt-4 rounded-lg"
                    />
                  )}
                </div>

                {/* Metadata Section */}
                <div className="p-6 bg-gray-50">
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-gray-200 rounded-full">
                      {resource.topic?.name}
                    </span>
                    <span className="px-2 py-1 bg-gray-200 rounded-full">
                      {resource.category?.name}
                    </span>
                    {resource.technologies && resource.technologies.map((tech) => (
                      <span
                        key={tech.technology_id.id}
                        className="px-2 py-1 bg-gray-200 rounded-full"
                      >
                        {tech.technology_id.name}
                      </span>
                    ))}
                  </div>
                  {relativeTime && <p className="mt-4 text-sm text-gray-500">
                    Posted {relativeTime}
                  </p>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}