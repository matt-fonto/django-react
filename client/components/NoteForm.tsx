"use client";

import { createNote } from "@/actions/notes.actions";
import { FormEvent, useState } from "react";

export function NoteForm() {
  // title, content, author
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    // createNote
    e.preventDefault();

    const res = await createNote(title, content, "1"); // fetch the author
  }

  return (
    <form
      className="flex items-center justify-center border rounded-md flex-col max-w-2xl mx-auto gap-y-4 p-4"
      onSubmit={onSubmit}
    >
      <h1>Create Note</h1>

      <label>
        Title:
        <input
          type="text"
          className="border rounded-md p-2 text-black ml-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label>
        Content:
        <input
          type="text"
          className="border rounded-md p-2 text-black ml-2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
}
