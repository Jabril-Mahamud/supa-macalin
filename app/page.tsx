import Hero from "@/components/hero";
//cleared cache hopefully it works
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";

export default async function Index() {
  return (
    <>
      <Hero />
      <main className="flex-1 flex flex-col gap-6 px-4">
        <h2 className="font-medium text-xl mb-4">Next steps</h2>
        <Link href="/speaker">Speaker</Link>
      </main>
    </>
  );
}
