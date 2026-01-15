"use client";

import { useState } from "react";
import { useUser, useStackApp } from "@stackframe/stack";
import { Shield, Mail, Key, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

export default function SignInPage() {
  const [authMethod, setAuthMethod] = useState<"email" | "passkey">("email");
  const [email, setEmail] = useState("");
  const [passkey, setPasskey] = useState("");
  const [loading, setLoading] = useState(false);
  const app = useStackApp();

  const handleEmailSignIn = async () => {
    setLoading(true);
    try {
      await app.signInWithOAuth({ email, password: "temp" });
      toast.success("Successfully signed in with email!");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handlePasskeySignIn = async () => {
    setLoading(true);
    try {
      await app.signInWithPasskey({ passkey });
      toast.success("Successfully signed in with passkey!");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const user = useUser();

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-6">Sign In</h1>
          <p className="text-muted-foreground mb-6">
            You are already signed in. Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
        
        {/* Auth Method Selector */}
        <div className="bg-card p-6 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">Choose Authentication Method</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setAuthMethod("email")}
              className={`flex-1 items-center gap-2 p-3 rounded-md border-2 transition-colors ${
                authMethod === "email" 
                  ? "border-blue-500 bg-blue-50 text-blue-700" 
                  : "border-gray-200 bg-white text-gray-700"
              }`}
            >
              <Mail className="w-5 h-5" />
              <span>Email</span>
            </button>
            <button
              onClick={() => setAuthMethod("passkey")}
              className={`flex-1 items-center gap-2 p-3 rounded-md border-2 transition-colors ${
                authMethod === "passkey" 
                  ? "border-green-500 bg-green-50 text-green-700" 
                  : "border-gray-200 bg-white text-gray-700"
              }`}
            >
              <Key className="w-5 h-5" />
              <span>Passkey</span>
            </button>
          </div>
        </div>

        {/* Email Form */}
        {authMethod === "email" && (
          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Sign In with Email</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium">Password</label>
                <input
                  id="password"
                  type="password"
                  value="temp" // For demo - in production, you'd use actual password
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                  placeholder="Enter your password"
                />
              </div>
              <button
                onClick={handleEmailSignIn}
                disabled={loading || !email.trim()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Signing In..." : "Sign In with Email"}
              </button>
            </div>
          </div>
        )}

        {/* Passkey Form */}
        {authMethod === "passkey" && (
          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Sign In with Passkey</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="passkey" className="block text-sm font-medium">Passkey</label>
                <input
                  id="passkey"
                  type="text"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground font-mono"
                  placeholder="Enter your passkey"
                />
              </div>
              <button
                onClick={handlePasskeySignIn}
                disabled={loading || !passkey.trim()}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Signing In..." : "Sign In with Passkey"}
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => window.location.href = "/"}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}