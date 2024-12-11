import { cookies } from "next/headers";

type Options = Record<string, string> | undefined;

export async function api({
  query,
  options = {},
  method = "GET",
}: {
  query: string;
  options?: Options;
  method?: "GET" | "POST" | "PUT" | "DELETE";
}) {
  const ACCESS_TOKEN = cookies().get("ACCESS_TOKEN")?.value; // instead of getting from the env.variables, getting from the cookies

  try {
    const defaultHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ACCESS_TOKEN ?? ""}`,
    };

    const fetchOptions = {
      ...options,
      method,
      headers: {
        ...defaultHeaders,
        ...(typeof options?.headers === "object" ? options.headers : {}),
      },
    };

    const url = `${process.env.SERVER_ENDPOINT}/api/${query}/`;
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`Http error: ${response.statusText}`);
    }

    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    return null;
  } catch (error) {
    console.log(JSON.stringify(error));

    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An error occurred");
    }
  }
}
