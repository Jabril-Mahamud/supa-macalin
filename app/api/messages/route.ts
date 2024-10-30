import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

// Helper function to get authenticated user
async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

// Helper function to create friendly error response
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
    
    // Check if user is authenticated
    const { user, error: authError } = await getAuthenticatedUser();
    if (authError || !user) {
      return createErrorResponse("Not authenticated", 401);
    }

    const body = await request.json();
   
    // Validate required fields
    const { text, audio_url, voice } = body;
    if (!text || !audio_url || !voice) {
      return NextResponse.json(
        { 
          error: "Missing required fields",
          friendly_message: "Oops! Some information is missing. Please make sure you've filled in everything needed."
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          text,
          audio_url,
          voice,
          user_id: user.id,  // Add the user's ID to the message
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { 
          error: "Failed to create message",
          friendly_message: "Sorry! Something went wrong while saving your message. Please try again."
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { 
        error: "Internal server error",
        friendly_message: "Sorry! Something went wrong. Please try again in a few minutes."
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { user, error: authError } = await getAuthenticatedUser();
    if (authError || !user) {
      return createErrorResponse("Not authenticated", 401);
    }

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq('user_id', user.id)  // Only fetch messages for the logged-in user
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { 
          error: "Failed to fetch messages",
          friendly_message: "Sorry! We couldn't load your messages. Please try again."
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { 
        error: "Internal server error",
        friendly_message: "Sorry! Something went wrong. Please try again in a few minutes."
      },
      { status: 500 }
    );
  }
}