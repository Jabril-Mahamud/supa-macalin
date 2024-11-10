'use client'
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Voice {
  voice_id: string;
  name: string;
}

async function updateUserVoicePreference(userId: string, voiceId: string) {
    try {
      const response = await fetch('/api/voice-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ userId, voiceId }),  
      });
  
      const data = await response.json();
      console.log('Response data:', data);  // Log the response to see what is being returned
  
      if (!data || !data.success) {
        throw new Error('Failed to update preference');
      }
  
    } catch (error) {
      console.error('Error updating voice preference:', error);
    }
  }
  

export default function VoiceDropdown({ userId }: { userId: string }) {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');

  // Fetch voices from your backend API
  useEffect(() => {
    async function fetchVoices() {
      const res = await fetch('/api/voices'); 
      const data = await res.json();
      if (data.voices) {
        setVoices(data.voices);
        // Set default voice if available
        if (data.voices.length > 0) {
          setSelectedVoice(data.voices[0].voice_id);
        }
      }
    }

    fetchVoices();
  }, []);

  const handleVoiceChange = (voiceId: string) => {
    setSelectedVoice(voiceId);
    if (userId) {
      updateUserVoicePreference(userId, voiceId);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="font-semibold text-lg text-foreground mb-2">Select Your Voice</h3>
      <Select value={selectedVoice} onValueChange={handleVoiceChange}>
        <SelectTrigger className="w-full px-4 py-3 bg-white text-foreground border border-muted-foreground rounded-md">
          <SelectValue placeholder="Choose a voice" />
        </SelectTrigger>
        <SelectContent>
          {voices.map((voice) => (
            <SelectItem key={voice.voice_id} value={voice.voice_id}>
              {voice.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
