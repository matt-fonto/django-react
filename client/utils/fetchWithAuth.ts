import { cookies } from "next/headers";

type Options = Record<string, string> | undefined;

export async function fetchWithAuth(
  query: string,
  options: Options = undefined
) {
  const ACCESS_TOKEN = cookies().get("ACCESS_TOKEN")?.value; // instead of getting from the env.variables, getting from the cookies

  try {
    const defaultHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ACCESS_TOKEN ?? ""}`,
    };

    const fetchOptions = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(typeof options?.headers === "object" ? options.headers : {}),
      },
    };

    const response = await fetch(
      `${process.env.SERVER_ENDPOINT}/api/${query}`,
      fetchOptions
    );

    if (!response.ok) {
      throw new Error(`Http error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An error occurred");
    }
  }
}
