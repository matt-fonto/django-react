"use client";

import { signin } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { success } = await signin(username, password);

    if (success) {
      router.push("/");
    }
  }

  return (
    <form
      className="flex items-center justify-center border rounded-md flex-col max-w-2xl mx-auto gap-y-4 p-4"
      onSubmit={onSubmit}
    >
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
