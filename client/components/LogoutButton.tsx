"use client";

import { logout } from "@/actions/auth.actions";

export function LogoutButton() {
  async function onClick() {
    const res = await logout();
    console.log("res", res);
  }

  return (
    <button className="bg-red-500 rounded-md px-2 py-1" onClick={onClick}>
      Logout
    </button>
  );
}
