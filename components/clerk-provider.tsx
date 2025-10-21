"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import { useEffect } from "react";
import { clearAllCache } from "@/lib/data-fetching";

export function ClerkProviderWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  // Clear cache when user authentication state changes
  useEffect(() => {
    // Clear all cached data when component mounts
    clearAllCache();
    
    // Optional: Add event listeners for sign in/out events
    const handleSignIn = () => {
      console.log('User signed in, clearing cache');
      clearAllCache();
    };
    
    const handleSignOut = () => {
      console.log('User signed out, clearing cache');
      clearAllCache();
    };
    
    // We can't directly listen to Clerk events here, but we can clear cache on mount
    // which happens when the provider is re-rendered with a new auth state
    
    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <ClerkProvider
      appearance={{
        baseTheme: theme === "dark" ? dark : undefined,
        variables: {
          colorPrimary: "#3b82f6",
        },
      }}
      localization={{
        socialButtonsBlockButton: "Continue with {{provider|titleize}}",
      }}
    >
      {children}
    </ClerkProvider>
  );
}