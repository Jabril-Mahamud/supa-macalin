// Main Page Component
import { AudioConverter } from "@/components/AudioConverter";
import MessageHistory from "@/components/MessageHistory";
import React from "react";

const Page = () => {
  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">Welcome</h1>
      <AudioConverter />
      <MessageHistory />
    </div>
  );
};

export default Page;