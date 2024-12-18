import Hero from "@/components/hero";
import Link from "next/link";

export default function Index() {
  return (
    <>
      <Hero /> {}
      
      <div className="flex flex-col items-center mt-6"> {}
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">Get Started</h2>
        <p className="text-lg text-center mb-6">
          Login or register to get started
        </p>
        <div className="flex gap-4">
          <Link 
            href="/protected"
            className="text-align:cente px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Getting Started
          </Link>
          
        </div>
      </div>
    </>
  );
}
