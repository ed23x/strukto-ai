"use client";
import { useUser, useStackApp } from "@stackframe/stack";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

export default function UserProfile() {
  const user = useUser();
  const app = useStackApp();

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