"use client";
import { useUser } from "@stackframe/stack";

export default function DashboardPage() {
  const user = useUser({ or: "redirect" });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        
        {user ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Welcome back!</h2>
            <p className="text-muted-foreground">
              Hello, {user.displayName || "User"}! You've successfully authenticated with passkey authentication.
            </p>
            <div className="space-y-2">
              <p><strong>Email:</strong> {user.primaryEmail || "Not set"}</p>
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>Display Name:</strong> {user.displayName || "Not set"}</p>
              <p><strong>Auth Method:</strong> Passkey Authentication</p>
              <p><strong>Authentication Method:</strong> Passkey</p>
              <p><strong>Last Sign In:</strong> {user.lastSignedInAt ? new Date(user.lastSignedInAt).toLocaleString() : "Never"}</p>
            </div>
            
            <div className="mt-6">
              <div className="mt-6 space-y-2">
              <a 
                href="/" 
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
              >
                Go to Home
              </a>
              <a 
                href="/profile" 
                className="inline-block px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-center"
              >
                Profile
              </a>
            </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-red-600">Access Denied</h2>
            <p className="text-muted-foreground">
              You need to be authenticated to access this page.
            </p>
            <div className="mt-6">
              <button
                onClick={() => window.location.href = '/handler/sign-in'}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}