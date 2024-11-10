"use client"
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingButton } from '@/components/LoadingButton';
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Volume2, Loader2 } from 'lucide-react';
import oswaldImage from "@/public/images/oswald.png";
import dorothyImage from "@/public/images/dorothy.png";
import { createClient } from '@/utils/supabase/client';

interface Message {
  id: number;
  text: string | null;
  created_at: string;
  voice: 'Oswald' | 'Dorothy' | null;  // Update this line
  user_id: string | null;
}

interface PlaybackState {
  messageId: number;
  isPlaying: boolean;
  isLoading: boolean;
}

const voiceMapping: { [key: string]: string } = {
  'Oswald': 'Pw7NjARk1Tw61eca5OiP',
  'Dorothy': 'ThT5KcBeYPX3keUQqHPh'
};

const voiceImages = {
  'Oswald': oswaldImage,
  'Dorothy': dorothyImage,
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playbackStates, setPlaybackStates] = useState<PlaybackState[]>([]);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    // Initial fetch of messages
    fetchMessages();

    // Set up real-time subscription
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          handleRealtimeUpdate(payload);
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleRealtimeUpdate = (payload: any) => {
    if (payload.eventType === 'INSERT') {
      setMessages(prev => [payload.new, ...prev]);
    } else if (payload.eventType === 'DELETE') {
      setMessages(prev => prev.filter(message => message.id !== payload.old.id));
    } else if (payload.eventType === 'UPDATE') {
      setMessages(prev => 
        prev.map(message => 
          message.id === payload.new.id ? payload.new : message
        )
      );
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err instanceof Error ? err.message : "Unable to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = async (message: Message) => {
    if (!message.text || !message.voice) {
      toast({
        description: 'Missing text or voice selection',
        variant: 'destructive',
      });
      return;
    }

    // Update loading state
    setPlaybackStates(prev => [
      ...prev.filter(state => state.messageId !== message.id),
      { messageId: message.id, isLoading: true, isPlaying: false }
    ]);

    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: message.text,
          selectedVoiceId: voiceMapping[message.voice] || message.voice,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const audioData = await response.arrayBuffer();
      const blob = new Blob([audioData], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(blob);
      
      // Play the audio
      const audio = new Audio(audioUrl);
      
      setPlaybackStates(prev => [
        ...prev.filter(state => state.messageId !== message.id),
        { messageId: message.id, isLoading: false, isPlaying: true }
      ]);

      audio.play();

      // Clean up when audio finishes
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        setPlaybackStates(prev => 
          prev.filter(state => state.messageId !== message.id)
        );
      };

    } catch (error) {
      console.error('Error playing audio:', error);
      toast({
        description: 'Failed to play audio. Please try again.',
        variant: 'destructive',
      });
      setPlaybackStates(prev => 
        prev.filter(state => state.messageId !== message.id)
      );
    }
  };

  const getPlaybackState = (messageId: number) => {
    return playbackStates.find(state => state.messageId === messageId) || {
      isLoading: false,
      isPlaying: false
    };
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="py-8">
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-lg">Loading your message history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="py-8">
          <p className="text-center text-lg text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center justify-center gap-2">
          <Volume2 className="h-6 w-6" />
          Message History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((message) => {
              const { isLoading, isPlaying } = getPlaybackState(message.id);
              return (
                <Card key={message.id} className="p-4">
                  <div className="flex items-center gap-4">
                    {message.voice && voiceImages[message.voice] && (
                      <div className="flex-shrink-0">
                        <Image
                          src={voiceImages[message.voice]}
                          alt={`${message.voice} voice`}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      </div>
                    )}
                    <div className="flex-grow">
                      <p className="text-lg mb-2">{message.text || "No message text."}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(message.created_at).toLocaleString()}
                      </p>
                    </div>
                    <LoadingButton
                      onClick={() => handlePlayAudio(message)}
                      isLoading={isLoading}
                      className="min-w-[100px] h-10 bg-blue-500 text-white hover:bg-blue-600 rounded-lg flex items-center justify-center gap-2"
                    >
                      {isPlaying ? 'Playing...' : 'Play'}
                    </LoadingButton>
                  </div>
                </Card>
              );
            })
          ) : (
            <p className="text-center text-lg text-muted-foreground py-8">
              No messages found.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}