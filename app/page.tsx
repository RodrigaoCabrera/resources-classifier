import AddPostButton from "@/app/components/AddPostsButton";
import ResourcesPosts from "@/app/components/ResourcesPosts";

export default function Home() {
  return (
    <>
      <section className="px-4 flex justify-between gap-4 w-full">
        <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
        <AddPostButton />
      </section>
      <section>
        <ResourcesPosts />
      </section>
    </>
  );
}
