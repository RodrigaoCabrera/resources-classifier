import { postService } from "../services/postService";

// Mock data
const mockData = [
  {
    id: '7295093221129383936',
    author: 'Miguel Ángel Durán García',
    authorTitle:
      'Programación JavaScript y Desarrollo Web. Reconocido Google Developer Expert, Microsoft MVP y GitHub Star. ⭐',
    timeAgo: '2 semanas',
    content:
      '¡Proyectazo! Crea productos o startups más rápido.\n¡Esta plantilla de código abierto tiene lo que necesitas!\n\n✓ Basado en Next.js\n✓ Pagos con Stripe o Lemon Squeezy\n✓ Auth de usuarios y base de datos\n✓ Envío de correos con Mailgun\n\n$ git clone shipfree',
    hasImage: true,
    imageUrl:
      'https://media.licdn.com/dms/image/v2/D4D10AQHJsaa9Uk99vg/image-shrink_480/B4DZT1gmtGHkAw-/0/1739285755028?e=1741446000&amp;v=beta&amp;t=TMkBfln1g5UZK6eJ0Sne3UnlMDgbTB-EPKslEFS3CLs',
    topic: 'Web Development',
    category: 'Starter Template',
    technology: ['Next.js', 'Stripe', 'Lemon Squeezy', 'Authentication', 'Database', 'Mailgun'],
  },
  {
    id: '7286049366694391809',
    author: 'Miguel Ángel Durán García',
    authorTitle:
      'Programación JavaScript y Desarrollo Web. Reconocido Google Developer Expert, Microsoft MVP y GitHub Star. ⭐',
    timeAgo: '1 mes',
    content:
      '¿La mejor alternativa a WordPress? ¡Ojo con esto!\nPayload es un framework que funciona con Next.js\n\nPuedes crear Tiendas, Blogs, Landings y más.\n\nSi este post llega a 2000 likes, hago un curso gratuito.\n\n$ npx create-payload-app',
    hasImage: true,
    imageUrl:
      'https://media.licdn.com/dms/image/v2/D4D10AQHFIsKWsALeUQ/image-shrink_480/image-shrink_480/0/1737129532288?e=1741446000&amp;v=beta&amp;t=MzEV3rnIo2SEo-dhJN5i_gEgBR7lAQPfK3o4v_PJY68',
    imageAlt: 'El backend para construir la web moderna, Payload.',
    topic: 'Web Development',
    category: 'CMS',
    technology: ['Payload', 'Next.js'],
  },
  {
    id: '7293659507136593920',
    author: 'Miguel Ángel Durán García',
    authorTitle:
      'Programación JavaScript y Desarrollo Web. Reconocido Google Developer Expert, Microsoft MVP y GitHub Star. ⭐',
    timeAgo: '3 semanas',
    content:
      'HTML parece fácil pero...\n\n¿Puedes usar un <ul> dentro de un <p>?\n¿Y un <span> dentro de un <button>?\n\n¡Demasiadas combinaciones que recordar!\n\nEste recurso te ayuda con la semántica de tu web:\n→ caninclude.glitch.me',
    hasImage: true,
    imageUrl:
      'https://media.licdn.com/dms/image/v2/D4D10AQHcbFRe8EnmnQ/image-shrink_480/B4DZThIqipG4Ak-/0/1738943933615?e=1741446000&amp;v=beta&amp;t=QGWsWtDyboM3HIBAgrGO4bhWLv74H4N6sD__Rvag-hs',
    topic: 'Web Development',
    category: 'HTML Reference',
    technology: ['HTML', 'Web Semantics'],
  },
];

const posts = await postService.getPosts({ limit: 10 });
console.log({ author: posts[0].author })
export default function ResourcePosts() {
  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {mockData.map((resource) => (
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
                      alt={resource.author}
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {resource.author}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {resource.authorTitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <p className="text-gray-700 whitespace-pre-line">
                  {resource.content}
                </p>
                {resource.hasImage && (
                  <img
                    src={resource.imageUrl}
                    alt={resource.imageAlt || 'Resource image'}
                    className="mt-4 rounded-lg"
                  />
                )}
              </div>

              {/* Metadata Section */}
              <div className="p-6 bg-gray-50">
                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                  <span className="px-2 py-1 bg-gray-200 rounded-full">
                    {resource.topic}
                  </span>
                  <span className="px-2 py-1 bg-gray-200 rounded-full">
                    {resource.category}
                  </span>
                  {resource.technology.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-gray-200 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  Posted {resource.timeAgo}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}