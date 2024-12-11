import { getNotes } from "@/actions/notes.actions";
import { LogoutButton } from "@/components/LogoutButton";
import { NoteButton } from "@/components/NoteButton";
import { NoteForm } from "@/components/NoteForm";
import { authenticateUser } from "@/utils/authenticateUser";
// import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const { isAuthenticated, error } = await authenticateUser();
  // const allCookies = cookies().getAll();

  if (!isAuthenticated && error) {
    redirect("/login");
  }

  const notes = await getNotes();
  // const note = await getNote(2);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <LogoutButton />

      <NoteForm />

      <div className="grid grid-cols-3 max-w-7xl gap-4">
        {notes?.map(({ title, id, content }) => (
          <div
            className="border border-gray rounded-md p-4 min-w-[300px] flex justify-between"
            key={id}
          >
            <div className="flex flex-col gap-2">
              <h2 className="font-bold text-2xl">{title}</h2>
              <p>{content}</p>
            </div>

            <div className="flex flex-col gap-2 items-start">
              <NoteButton behavior="edit" noteId={id} />
              <NoteButton behavior="delete" noteId={id} />
            </div>
          </div>
        ))}
      </div>

      {/* <pre className="max-w-6xl mx-auto">
        {JSON.stringify(allCookies, null, 2)}
      </pre> */}
    </div>
  );
}
