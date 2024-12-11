"use server";

import { Note } from "@/types";
import { api } from "@/utils/api";
import { revalidatePath } from "next/cache";

export async function getNotes(): Promise<Note[] | undefined> {
  return await api({ query: "notes" });
}

export async function getNote(
  noteId: number | string
): Promise<Note | undefined> {
  return await api({ query: `notes/${String(noteId)}` });
}

export async function createNote(
  title: string,
  content: string,
  author: string
) {
  const res = await api({
    query: "notes",
    method: "POST",
    options: {
      body: JSON.stringify({ title, content, author }),
    },
  });

  revalidatePath("/notes");

  return res;
}

export async function deleteNote(noteId: number | string) {
  const res = await api({
    query: `notes/${String(noteId)}`,
    method: "DELETE",
  });

  revalidatePath("/notes");

  return res;
}

export async function editNote(noteId: number | string) {
  console.log("noteId", noteId);
}
