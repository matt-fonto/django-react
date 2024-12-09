import { getNotes } from "@/actions/notes.actions";

export default async function Home() {
  const notes = await getNotes();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h2>Hey</h2>

      <pre>{JSON.stringify(notes, null, 2)}</pre>
    </div>
  );
}
