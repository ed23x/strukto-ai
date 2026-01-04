"use client";

import { useEffect, useState, useMemo } from "react";
import { register } from "@teamhanko/hanko-elements";
import { Hanko } from "@teamhanko/hanko-frontend-sdk";
import { useRouter } from "next/navigation";

const hankoApi = process.env.NEXT_PUBLIC_HANKO_API_URL || "";

export default function LoginPage() {
  const router = useRouter();
  const [hanko, setHanko] = useState<Hanko | null>(null);

  useEffect(() => {
    if (hankoApi) {
        // Register the custom element
        register(hankoApi).catch((error) => {
          console.error("Failed to register Hanko:", error);
        });
        
        // Initialize Hanko client
        setHanko(new Hanko(hankoApi));
    }
  }, []);
  
  // Check for existing session and handle redirect
  useEffect(() => {
     if (!hanko) return;

     // Check if already logged in
     hanko.user.getCurrent().then(() => {
         router.replace("/");
     }).catch(() => {
         // Not logged in, stay here
     });

     // Custom event listener for Hanko login success
     const handleAuth = () => {
         router.replace("/");
     };
     
     // Listener needs to be on document for the custom element bubbling
     document.addEventListener("hankoAuthSuccess", handleAuth);
     return () => document.removeEventListener("hankoAuthSuccess", handleAuth);
  }, [hanko, router]);

  if (!hankoApi) {
      return (
          <div className="flex min-h-screen items-center justify-center">
              <div className="p-4 border rounded bg-red-50 text-red-500">
                  Hanko API URL is missing. Please configure NEXT_PUBLIC_HANKO_API_URL in .env
              </div>
          </div>
      )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 border rounded-xl shadow-lg bg-card">
        <h1 className="text-2xl font-bold text-center mb-6">Login to Struckto</h1>
        <hanko-auth />
      </div>
    </div>
  );
}
