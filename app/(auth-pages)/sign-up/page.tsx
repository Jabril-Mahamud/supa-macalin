// app/(auth)/signup/page.tsx
import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { MicrosoftButton, OrSeparator } from "@/app/(auth-pages)/MicrosoftButton";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col min-w-64 max-w-64 mx-auto">
        <h1 className="text-2xl font-medium">Sign up</h1>
        <p className="text-sm text text-foreground">
          Already have an account?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>

        <div className="mt-8 flex flex-col gap-6">
          {/* OAuth Button */}
          <div className="flex flex-col gap-4">
            <MicrosoftButton />
            <OrSeparator />
          </div>

          {/* Email/Password Form */}
          <form className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              name="email" 
              placeholder="you@example.com" 
              required 
            />
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="Your password"
              minLength={6}
              required
            />
            <SubmitButton 
              formAction={signUpAction} 
              pendingText="Signing up..."
            >
              Sign up with email
            </SubmitButton>
            <FormMessage message={searchParams} />
          </form>
        </div>
      </div>
      <SmtpMessage />
    </>
  );
}