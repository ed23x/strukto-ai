"use client";
import { useUser } from "@stackframe/stack";
import { UserButton } from "@stackframe/stack";

export default function ProfilePage() {
  const user = useUser({ or: "redirect" });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center p-8 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        
        {user ? (
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">User Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <p className="font-medium">Display Name</p>
                  <p className="text-muted-foreground">{user.displayName || "Not set"}</p>
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">{user.primaryEmail || "Not set"}</p>
                </div>
                <div>
                  <p className="font-medium">User ID</p>
                  <p className="text-muted-foreground">{user.id}</p>
                </div>
                <div>
                  <p className="font-medium">Authentication Method</p>
                  <p className="text-muted-foreground">Passkey Authentication</p>
                </div>
                <div>
                  <p className="font-medium">Last Sign In</p>
                  <p className="text-muted-foreground">{user.lastSignedInAt ? new Date(user.lastSignedInAt).toLocaleString() : "Never"}</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Account Actions</h2>
              <div className="space-y-3">
                <a 
                  href="/dashboard" 
                  className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Dashboard
                </a>
                <a 
                  href="/" 
                  className="flex items-center justify-center w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Back to Struckto AI
                </a>
              </div>
            </div>

            <div className="mt-6">
              <UserButton />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Access Denied</h2>
            <p className="text-muted-foreground">
              You need to be signed in to view your profile.
            </p>
            <div className="mt-6">
              <a 
                href="/handler/sign-in" 
                className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Sign In
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}