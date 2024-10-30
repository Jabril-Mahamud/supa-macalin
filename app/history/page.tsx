"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import oswaldImage from "@/app/images/oswald.png"
import dorothyImage from "@/app/images/dorothy.png"

import type { StaticImageData } from "next/image"; 

interface Message {
  id: number;
  text: string | null; // Allowing null for messages without text
  audio_url: string | null; // Allowing null for messages without audio
  created_at: string;
  voice: string | null; // Add voice to the Message interface
}

// Define the voiceImages object with StaticImageData type
const voiceImages: { [key: string]: StaticImageData } = {
  Oswald: oswaldImage,
  Dorothy: dorothyImage,
  // Add other voices and their images here
};

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/messages"); // Fetch from your existing GET API
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.friendly_message || "Failed to fetch messages");
      }
      const data = await response.json();
      setMessages(data); // Set messages from the response
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError(err instanceof Error ? err.message : "Unable to load your message history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-lg">Loading your message history...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-lg">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-center">Message History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Message</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Playback</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Voice</th>
              </tr>
            </thead>
            <tbody>
              {messages.length > 0 ? (
                messages.map((message) => (
                  <tr key={message.id}>
                    <td className="border border-gray-300 px-4 py-2">
                      {message.text || "No message text."}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(message.created_at).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {message.audio_url ? (
                        <audio controls src={message.audio_url} className="w-full rounded-lg">
                          Your browser does not support audio playback.
                        </audio>
                      ) : (
                        "No audio available."
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {message.voice ? (
                        <img
                          src={voiceImages[message.voice]?.src} // Use `src` to access the URL of StaticImageData
                          alt={message.voice}
                          className="h-8 w-8 rounded-full mx-auto" // Adjust size as needed
                        />
                      ) : (
                        "No voice icon."
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="border border-gray-300 px-4 py-2 text-center">
                    No messages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default Page;
