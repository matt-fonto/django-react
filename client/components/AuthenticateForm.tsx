"use client";

import { authenticate } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function AuthenticateForm({
  behavior,
}: {
  behavior: "login" | "signup";
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { success } = await authenticate(username, password, behavior);

    if (success) {
      router.push(behavior === "login" ? "/" : "/login?success=true");
    }
  }

  return (
    <form
      className="flex items-center justify-center border rounded-md flex-col max-w-2xl mx-auto gap-y-4 p-4"
      onSubmit={onSubmit}
    >
      <h1>{behavior === "login" ? "Login" : "Sign Up"}</h1>

      <label>
        Username:
        <input
          type="text"
          className="border rounded-md p-2 text-black ml-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          className="border rounded-md p-2 text-black ml-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}
