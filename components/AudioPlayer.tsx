// components/AudioPlayer.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import { LoadingButton } from '@/components/LoadingButton';
import { useToast } from '@/hooks/use-toast';

interface AudioPlayerProps {
  text: string;
  voiceId: string;
  maxLength?: number;
  onAudioGenerated?: (audioUrl: string) => void;
}

export const AudioPlayer = ({
  text,
  voiceId,
  maxLength = 1000,
  onAudioGenerated,
}: AudioPlayerProps) => {
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (audioSrc && onAudioGenerated) {
      onAudioGenerated(audioSrc); // Call the callback when the audio is generated
    }
  }, [audioSrc, onAudioGenerated]);

  const handleSubmit = useCallback(async () => {
    if (!text.trim()) {
      toast({
        description: 'Please add some text first',
        variant: 'default',
      });
      return;
    }

    setIsLoading(true);
    let newAudioUrl: string | null = null;

    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          selectedVoiceId: voiceId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate audio');
      }

      const audioData = await response.arrayBuffer();
      const blob = new Blob([audioData], { type: 'audio/mpeg' });
      newAudioUrl = URL.createObjectURL(blob); // Create a dynamic audio URL from the response data
      setAudioSrc(newAudioUrl);
    } catch (error) {
      console.error('Error generating audio:', error);
      toast({
        description: 'Sorry, please try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [text, voiceId, toast]);

  const handlePlayAudio = () => {
    if (audioSrc) {
      const audio = new Audio(audioSrc);
      setIsPlaying(true);
      audio.play()
        .then(() => {
          audio.onended = () => setIsPlaying(false);
        })
        .catch(() => {
          toast({
            description: 'Could not play audio. Please try again.',
            variant: 'destructive',
          });
          setIsPlaying(false);
        });
    } else {
      handleSubmit(); // Trigger audio generation if not already generated
    }
  };

  return (
    <div className="space-y-4">
      <LoadingButton
        onClick={handlePlayAudio}
        isLoading={isLoading}
        disabled={!text.trim()}
        className="w-full h-12 text-lg font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600"
      >
        {audioSrc ? 'Play Audio' : 'Speak It!'}
      </LoadingButton>

      {isPlaying && <p className="mt-4 text-center text-green-600">Playing audio...</p>}
      {!isPlaying && audioSrc && <p className="mt-4 text-center text-gray-600">Audio finished playing.</p>}
    </div>
  );
};
