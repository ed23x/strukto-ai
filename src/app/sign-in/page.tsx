"use client";

import { useState } from "react";
import { useUser, useStackApp, SignIn } from "@stackframe/stack";
import { Shield, Mail, Key, User as UserIcon, Fingerprint, Settings } from "lucide-react";
import { toast } from "sonner";

export default function SignInPage() {
  const [authMethod, setAuthMethod] = useState<"email" | "passkey" | "stack">("email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const app = useStackApp();

  const handleEmailSignIn = async () => {
    setLoading(true);
    try {
      await app.signInWithOAuth("google"); // Using Google OAuth as example
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
      // Proper passkey authentication using WebAuthn
      await app.signInWithPasskey();
      toast.success("Successfully signed in with passkey!");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with passkey");
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
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setAuthMethod("email")}
              className={`flex items-center gap-2 p-3 rounded-md border-2 transition-colors justify-center ${
                authMethod === "email" 
                  ? "border-blue-500 bg-blue-50 text-blue-700" 
                  : "border-gray-200 bg-white text-gray-700"
              }`}
            >
              <Mail className="w-5 h-5" />
              <span className="text-sm">Email</span>
            </button>
            <button
              onClick={() => setAuthMethod("passkey")}
              className={`flex items-center gap-2 p-3 rounded-md border-2 transition-colors justify-center ${
                authMethod === "passkey" 
                  ? "border-green-500 bg-green-50 text-green-700" 
                  : "border-gray-200 bg-white text-gray-700"
              }`}
            >
              <Key className="w-5 h-5" />
              <span className="text-sm">Passkey</span>
            </button>
            <button
              onClick={() => setAuthMethod("stack")}
              className={`flex items-center gap-2 p-3 rounded-md border-2 transition-colors justify-center ${
                authMethod === "stack" 
                  ? "border-purple-500 bg-purple-50 text-purple-700" 
                  : "border-gray-200 bg-white text-gray-700"
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm">Stack Auth</span>
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
            <h3 className="text-lg font-semibold mb-4">Passkey Authentication</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Fingerprint className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Use your biometric data or security key</p>
                  <p className="text-xs text-blue-700">Touch ID, Face ID, Windows Hello, or USB security key</p>
                </div>
              </div>
              
              <button
                onClick={handlePasskeySignIn}
                disabled={loading}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Fingerprint className="w-5 h-5" />
                {loading ? "Authenticating..." : "Sign In with Passkey"}
              </button>
              
              <div className="text-xs text-muted-foreground text-center">
                Note: Passkeys must be created in your Stack Auth dashboard first
              </div>
            </div>
          </div>
        )}

        {/* Stack Auth Built-in Component */}
        {authMethod === "stack" && (
          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Stack Auth Sign In</h3>
            <div className="text-sm text-muted-foreground mb-4">
              Use the built-in Stack Auth component. Passkey option will appear automatically if enabled in your Stack Auth dashboard.
            </div>
            <div className="border rounded-lg p-4">
              <SignIn />
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