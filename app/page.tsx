import ResourcesPosts from "./components/ResourcesPosts";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="pl-4 text-3xl font-bold text-gray-900">Resources</h1>
        <section>
          <ResourcesPosts />
        </section>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p>
          copyright © {new Date().getFullYear()} by <a href="https://github.com/rodrigaocabrera">Rodrigo cabrera</a>
        </p>
      </footer>
    </div>
  );
}
