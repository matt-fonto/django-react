import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchWithAuth } from "./fetchWithAuth";

type Token = string;

// TODO: When we login, we should set the access and refresh tokens on the cookies
export async function authenticateUser(): Promise<Token | null> {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("ACCESS_TOKEN")?.value ?? undefined;
  const refreshToken = cookieStore.get("REFRESH_TOKEN")?.value ?? undefined;

  if (!accessToken || !refreshToken) {
    redirect("/login");
  }

  try {
    const decoded = jwtDecode(accessToken);
    const tokenExpiration = decoded.exp;
    const now = Math.floor(Date.now() / 1000); // current time in seconds

    // if token is expired, refresh it
    if (tokenExpiration && tokenExpiration < now) {
      const newAccessToken = await getNewAccessToken(refreshToken);

      if (!newAccessToken) {
        redirect("/login");
      }

      return newAccessToken;
    }

    console.log("token is not expired", accessToken);
    return accessToken;
  } catch (error) {
    console.log("error", error);
    redirect("/login");
  }
}

async function getNewAccessToken(refreshToken: string): Promise<Token | null> {
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
