import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import VoiceDropdown from "@/components/VoiceDropdown"; 

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
    <div className="flex flex-col gap-6 p-4 bg-background">
      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-6">
        <Link href="/speaker">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-md text-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
            Speaker
          </button>
        </Link>
        <Link href="/history">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-md text-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
            History
          </button>
        </Link>
      </div>

      <h2 className="font-semibold text-2xl text-foreground mb-4">Your Information</h2>

      <div className="bg-muted p-6 rounded-lg border border-muted-foreground">
        <p className="text-sm font-medium text-gray-700">Full Name:</p>
        <p className="text-lg font-mono text-foreground">{userInfo.fullName}</p>

        <p className="text-sm font-medium text-gray-700 mt-4">Email:</p>
        <p className="text-lg font-mono text-foreground">{userInfo.email}</p>

        <p className="text-sm font-medium text-gray-700 mt-4">Account Created On:</p>
        <p className="text-lg font-mono text-foreground">
          {new Date(userInfo.createdAt).toLocaleDateString() || "Not provided"}
        </p>
      </div>

      {/* Voice Selection Dropdown */}
      <VoiceDropdown userId={user.id} />
    </div>
  );
}
