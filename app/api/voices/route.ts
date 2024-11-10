import { NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";
export const runtime = 'edge';

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
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const voiceId = formData.get('voiceId') as string;

    if (!userId || !voiceId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || user.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Upsert the preference
    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        preferred_voice_id: voiceId,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('Error updating preference:', error);
      return NextResponse.json(
        { error: 'Failed to update preference' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { user, error: authError } = await getAuthenticatedUser();

    if (authError || !user) {
      return createErrorResponse("Not authenticated", 401);
    }

    const API_KEY = process.env.ELEVENLABS_API_KEY;

    if (!API_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error' }, 
        { status: 500 }
      );
    }

    // Fetch voices from ElevenLabs API
    const response = await fetch(
      'https://api.elevenlabs.io/v1/voices',
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'xi-api-key': API_KEY
        }
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.detail?.message || 'Failed to fetch voices' },
        { status: response.status }
      );
    }

    const voicesData = await response.json();

    // Transform the response to include only necessary information
    const processedVoices = voicesData.voices.map((voice: any) => ({
      voice_id: voice.voice_id,
      name: voice.name,
      preview_url: voice.preview_url,
      description: voice.description,
      category: voice.category,
      labels: voice.labels,
      settings: {
        stability: voice.settings?.stability || 0.5,
        similarity_boost: voice.settings?.similarity_boost || 0.75
      }
    }));

    // Cache the response in Supabase if needed
    const { error: cacheError } = await supabase
      .from('voice_cache')
      .upsert({
        user_id: user.id,
        voices: processedVoices,
        last_updated: new Date().toISOString()
      });

    if (cacheError) {
      console.error("Cache update error:", cacheError);
      // Continue even if caching fails
    }

    return NextResponse.json({
      voices: processedVoices,
      total: processedVoices.length
    });

  } catch (error) {
    console.error("Voice fetch error:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}