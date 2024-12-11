"use client";

import { deleteNote, editNote } from "@/actions/notes.actions";

export function NoteButton({
  behavior,
  noteId,
}: {
  behavior: "edit" | "delete";
  noteId: number;
}) {
  async function onClick() {
    if (behavior === "edit") {
      const result = await editNote(noteId);
    } else {
      const result = await deleteNote(noteId);
    }
  }

  return (
    <button
      className={`${
        behavior === "edit" ? "bg-blue-500" : "bg-red-500"
      } rounded-md border px-2 py-1 cursor-pointer  w-full`}
      onClick={onClick}
    >
      {behavior === "edit" ? "Edit" : "Delete"}
    </button>
  );
}
