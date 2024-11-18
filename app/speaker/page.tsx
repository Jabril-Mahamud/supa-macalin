
// Main Page Component
import { AudioConverter } from "@/components/AudioConverter";
import MessageHistory from "@/components/MessageHistory";
import React from "react";

const Page = () => {
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
    </div>
  );
};

export default Page;
