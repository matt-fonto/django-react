"use server";

export async function getNotes() {
  console.log("DJANGO_ACCESS_TOKEN", process.env.DJANGO_ACCESS_TOKEN);

  const result = await fetch("http://127.0.0.1:8000/api/notes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DJANGO_ACCESS_TOKEN}`,
    },
  });

  return await result.json();
}
