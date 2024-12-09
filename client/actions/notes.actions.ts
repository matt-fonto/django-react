"use server";

import { fetchWithAuth } from "@/utils/fetchWithAuth";

export async function getNotes() {
  return fetchWithAuth("notes");
}
