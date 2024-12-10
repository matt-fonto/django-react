import { getNotes } from "@/actions/notes.actions";
import { LogoutButton } from "@/components/LogoutButton";
import { authenticateUser } from "@/utils/authenticateUser";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const { isAuthenticated, error } = await authenticateUser();
  const allCookies = cookies().getAll();

  if (!isAuthenticated && error) {
    // redirect("/login");
  }

  // const notes = await getNotes();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <LogoutButton />

      {/* <pre>{JSON.stringify(notes, null, 2)}</pre> */}

      <pre className="max-w-6xl mx-auto">
        {JSON.stringify(allCookies, null, 2)}
      </pre>
    </div>
  );
}
