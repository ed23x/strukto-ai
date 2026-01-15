"use client";
import { useUser } from "@stackframe/stack";
import { Shield, AlertCircle } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const user = useUser({ or: "redirect" });

  if (!user) {
    return fallback || (
      <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">
        <AlertCircle className="mr-2" size={20} />
        <span>Please sign in to access this feature</span>
      </div>
    );
  }

  return <>{children}</>;
}