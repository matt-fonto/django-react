"use server";

import { cookies } from "next/headers";

type SignInReturn = {
  success: boolean;
  errorMessage: string | null;
  errorStatus: string | null;
};

type JWTResponse = {
  refresh: string;
  access: string;
};

/**
 * Fetch the access and refresh tokens based on username and password
 * Set them in the cookies
 */
export async function signIn(
  username: string,
  password: string
): Promise<SignInReturn> {
  try {
    const response = await fetch(`${process.env.SERVER_ENDPOINT}/api/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();

      return {
        success: false,
        errorMessage: error.detail || "An error occurred",
        errorStatus: String(error.status),
      };
    }

    const data: JWTResponse = await response.json();

    const cookiesStore = cookies();
    cookiesStore.set("ACCESS_TOKEN", data.access, {
      httpOnly: true,
      secure: true,
      path: "/",
    });
    cookiesStore.set("REFRESH_TOKEN", data.access, {
      httpOnly: true,
      secure: true,
      path: "/",
    });

    return {
      success: true,
      errorMessage: null,
      errorStatus: null,
    };
  } catch (error) {
    console.log("error during sign in", error);

    return {
      success: false,
      errorMessage: "Unexpected error",
      errorStatus: "500",
    };
  }
}
