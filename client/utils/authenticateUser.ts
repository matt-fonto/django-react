import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { fetchWithAuth } from "./fetchWithAuth";

type AuthenticateUserReturn = {
  isAuthenticated: boolean;
  token: string | null;
  error: unknown;
};

export async function authenticateUser(): Promise<AuthenticateUserReturn> {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("ACCESS_TOKEN")?.value ?? undefined;
  const refreshToken = cookieStore.get("REFRESH_TOKEN")?.value ?? undefined;

  if (!accessToken || !refreshToken) {
    return {
      isAuthenticated: false,
      token: null,
      error: "No access or refresh token",
    };
  }

  try {
    const decoded = jwtDecode(accessToken);
    const tokenExpiration = decoded.exp;
    const now = Math.floor(Date.now() / 1000); // current time in seconds

    // if token is expired, refresh it
    if (tokenExpiration && tokenExpiration < now) {
      const newAccessToken = await getNewAccessToken(refreshToken);

      if (!newAccessToken) {
        return {
          isAuthenticated: false,
          token: null,
          error: "Could not refresh token",
        };
      }

      return { token: newAccessToken, isAuthenticated: true, error: null };
    }

    console.log("token is not expired", accessToken);
    return {
      token: accessToken,
      isAuthenticated: true,
      error: null,
    };
  } catch (error) {
    console.log("Error authenticating user: ", error);
    return {
      isAuthenticated: false,
      token: null,
      error,
    };
  }
}

async function getNewAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const response = await fetchWithAuth("token/refresh/", {
      method: "POST",
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error(`Http error: ${response.statusText}`);
    }

    const data = await response.json();

    cookies().set("ACCESS_TOKEN", data.access, {
      httpOnly: true,
      secure: true,
    });

    return data.access;
  } catch (error) {
    console.log("Error refreshing token: ", error);
    return null;
  }
}
