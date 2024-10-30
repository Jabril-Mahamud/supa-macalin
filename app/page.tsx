import Hero from "@/components/hero"; // Import the Hero component
import Link from "next/link"; // Import the Link component for navigation

export default function Index() {
  return (
    <>
      <Hero /> {/* Render the Hero component */}
      
      <div className="flex flex-col items-center mt-8">
        <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
        <p className="text-lg text-center mb-6">
          Let’s begin! Click the button below to try the{" "}
          <span className="font-bold text-blue-600">Speaker</span>{" "}
          feature, which helps you{" "}
          <span className="underline hover:text-blue-600 transition duration-300">speak</span>{" "}
          and{" "}
          <span className="underline hover:text-blue-600 transition duration-300">share your thoughts</span>{" "}
          easily.
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
