// hooks/useMessageManagement.ts
"use client";

import { useState } from 'react';

interface Message {
  id?: number;
  text: string;
  audio_url: string;
  created_at?: string;
  voice: string;
}

export function useMessageManagement() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveMessage = async (text: string, audio_url: string, voice: string) => {
    setSaving(true);
    setError(null);
    
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          audio_url,
          voice,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save message");
      }

      const savedMessage = await response.json();
      return savedMessage;
    } catch (err) {
      console.error("Error saving message:", err);
      setError(err instanceof Error ? err.message : "Failed to save message");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    saveMessage,
    saving,
    error,
  };
}