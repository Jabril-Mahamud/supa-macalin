// components/auth/microsoft-auth.tsx
'use client';

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export const MicrosoftButton = () => {
  const handleMicrosoftSignIn = () => {
    const supabase = createClient();
    supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'email profile openid'
      }
    }).catch(error => {
      console.error('Error signing in with Microsoft:', error);
    });
  };

  return (
    <Button 
      type="button"
      onClick={handleMicrosoftSignIn}
      variant="outline"
      className="flex items-center justify-center gap-2 w-full"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"
        />
      </svg>
      Continue with Microsoft
    </Button>
  );
};

export const OrSeparator = () => (
  <div className="relative">
    <div className="absolute inset-0 flex items-center">
      <span className="w-full border-t" />
    </div>
    <div className="relative flex justify-center text-xs uppercase">
      <span className="bg-background px-2 text-muted-foreground">
        Or continue with email
      </span>
    </div>
  </div>
);