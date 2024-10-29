import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const userInfo = {
    fullName: user.user_metadata?.full_name || "Not provided",
    email: user.email || "Not provided",
    createdAt: user.created_at || "Not provided",
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-6 p-4 bg-background">
      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-4">
        <Link href="/speaker">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Speaker
          </button>
        </Link>
        <Link href="/history">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            History
          </button>
        </Link>
      </div>

      <h2 className="font-bold text-xl text-foreground">Your Information</h2>

      <div className="bg-muted p-4 rounded border border-muted-foreground">
        <p className="text-sm font-medium">Full Name:</p>
        <p className="text-lg font-mono text-foreground">{userInfo.fullName}</p>

        <p className="text-sm font-medium mt-2">Email:</p>
        <p className="text-lg font-mono text-foreground">{userInfo.email}</p>

        <p className="text-sm font-medium mt-2">Account Created On:</p>
        <p className="text-lg font-mono text-foreground">
          {new Date(userInfo.createdAt).toLocaleDateString() || "Not provided"}
        </p>
      </div>
    </div>
  );
}
