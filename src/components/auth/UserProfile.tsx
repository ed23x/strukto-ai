"use client";
import { useUser, useStackApp, UserButton } from "@stackframe/stack";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";

export function UserProfile() {
  const user = useUser();
  const app = useStackApp();

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm">
          <UserIcon size={16} />
          <span className="hidden sm:inline">{user.displayName ?? "User"}</span>
        </div>
        <UserButton />
      </div>
    );
  }

  return (
    <button
      onClick={() => app.redirectToSignIn()}
      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent text-sm transition-colors"
    >
      <LogIn size={16} />
      <span className="hidden sm:inline">Sign In</span>
    </button>
  );
}