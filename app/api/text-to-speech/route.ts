// app/api/text-to-speech/route.ts
import { NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server"; // Adjust based on your project structure
export const runtime = 'edge'; // Optional: Use edge runtime for better performance


async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

function createErrorResponse(message: string, status: number) {
  return NextResponse.json(
    { 
      error: message,
      friendly_message: "Sorry! You need to be signed in to use this. Please sign in and try again.", 
    },
    { status }
  );
}


export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { user, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return createErrorResponse("Not authenticated", 401);
    }

    const { text, selectedVoiceId } = await request.json();
    const VOICE_ID = selectedVoiceId || process.env.ELEVENLABS_VOICE_ID;
    const API_KEY = process.env.ELEVENLABS_API_KEY;

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (!API_KEY || !VOICE_ID) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Generate audio data from ElevenLabs API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': API_KEY
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.detail?.message || 'Failed to generate audio' },
        { status: response.status }
      );
    }

    const audioData = await response.arrayBuffer();
    const fileName = `audio/${user.id}-${Date.now()}.mp3`;

    // Upload audio data to Supabase bucket
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('audio') // Replace with your actual bucket name
      .upload(fileName, new Blob([audioData], { type: 'audio/mpeg' }), { upsert: true });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload audio" },
        { status: 500 }
      );
    }

    // Directly download the audio file from Supabase after upload
    const { data: downloadedAudio, error: downloadError } = await supabase
      .storage
      .from('audio')
      .download(fileName);

    if (downloadError) {
      console.error("Supabase download error:", downloadError);
      return NextResponse.json(
        { error: "Failed to retrieve audio from bucket" },
        { status: 500 }
      );
    }

    // Return the downloaded audio data as the response
    return new NextResponse(downloadedAudio, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': downloadedAudio.size.toString(),
      },
    });
  } catch (error) {
    console.error("Text-to-speech error:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
