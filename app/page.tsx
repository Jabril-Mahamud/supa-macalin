import Hero from "@/components/hero";
import Link from "next/link";

export default function Index() {
  return (
    <>
      <Hero /> {/* Render the Hero component */}
      
      <div className="flex flex-col items-center mt-6"> {/* Reduced the margin-top */}
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">Get Started</h2>
        <p className="text-lg text-center mb-6">
          Try the <span className="font-bold text-blue-600">Speaker</span> feature to talk and share.
        </p>
        <div className="flex gap-4">
          <Link 
            href="/speaker"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Speaker
          </Link>
          <Link 
            href="/history"
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition duration-300"
          >
            History
          </Link>
        </div>
      </div>
    </>
  );
}
