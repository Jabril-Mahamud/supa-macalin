'use client'
import { AudioConverter } from "@/components/AudioConverter";
import MessageHistory from "@/components/MessageHistory";
import React from "react";
import { useRouter } from "next/navigation";
import { Clock } from "lucide-react"; // Importing Clock icon from Lucide React

const Page = () => {
  const navigate = useRouter();

  const handleNavigateToHistory = () => {
    navigate.push("/history");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 p-6 pt-12 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-blue-800">Text to Speech Converter</h1>
        <p className="text-lg text-gray-700 max-w-md mx-auto">
          Type your text below, choose a voice, and hear it spoken aloud! Perfect for those learning a new language or needing a helping hand.
        </p>
      </div>

      <AudioConverter />

      <div className="w-full max-w-lg">
        <MessageHistory />
      </div>

      {/* History Button */}
      <button
        onClick={handleNavigateToHistory}
        className="flex items-center justify-center space-x-2 bg-blue-600 text-white text-lg font-medium px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        aria-label="Go to history page"
        title="View your history"
      >
        {/* Lucide Clock Icon */}
        <Clock className="h-6 w-6" />
        {/* Text */}
        <span>History</span>
      </button>
    </div>
  );
};

export default Page;
