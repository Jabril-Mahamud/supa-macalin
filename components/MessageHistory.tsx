"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import oswaldImage from "../app/public/images/oswald.png";
import dorothyImage from "../app/public/images/dorothy.png";
import type { StaticImageData } from "next/image"; // Import StaticImageData

interface Message {
  id: number;
  text: string;
  audio_url: string;
  created_at: string;
  voice: string;
}

// Define the voiceImages object with StaticImageData type
const voiceImages: { [key: string]: StaticImageData } = {
  Oswald: oswaldImage,
  Dorothy: dorothyImage,
  // Add other voices and their images here
};

export default function MessageHistory() {
  const [latestMessage, setLatestMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestMessage = async () => {
    try {
      const response = await fetch("/api/messages");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.friendly_message || "Failed to fetch message");
      }
      const data = await response.json();
      setLatestMessage(data[0] || null);
    } catch (err) {
      console.error("Error fetching message:", err);
      setError(err instanceof Error ? err.message : "Unable to load your latest message");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestMessage();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(fetchLatestMessage, 3000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-lg">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription className="text-center text-lg">{error}</AlertDescription>
      </Alert>
    );
  }

  if (!latestMessage) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-lg">No messages found.</p>
        </CardContent>
      </Card>
    );
  }

  const voiceImageSrc = voiceImages[latestMessage.voice] || null; // Get the image for the voice

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-center">Latest Message</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center p-6 bg-card">
        {voiceImageSrc && (
          <img
            src={voiceImageSrc.src} // Use `src` to access the URL of StaticImageData
            alt={latestMessage.voice}
            className="h-16 w-16 mb-4 rounded-full border-2 border-gray-300" // Added border for emphasis
          />
        )}
        <p className="text-lg text-center mb-4">{latestMessage.text}</p>
        <audio
          controls
          src={latestMessage.audio_url}
          className="w-full rounded-lg"
          preload="auto"
        >
          Your browser does not support audio playback.
        </audio>
        <p className="text-sm text-muted-foreground mt-4">
          Created: {new Date(latestMessage.created_at).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}
