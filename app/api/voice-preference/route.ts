import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Helper function to get authenticated user
async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

// Helper function to create a friendly error response
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
        return NextResponse.json(
          { 
            success: false, 
            error: "Not authenticated", 
            friendly_message: "Sorry! You need to be signed in to use this. Please sign in and try again." 
          },
          { status: 401 }
        );
      }
    
      const body = await request.json();
      const { voiceId } = body;
    
      if (!voiceId) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Missing required field: voiceId",
            friendly_message: "Oops! Some information is missing. Please make sure you've filled in everything needed."
          },
          { status: 400 }
        );
      }
    
      const { data, error } = await supabase
        .from("user_preferences")
        .upsert([
          {
            user_id: user.id,
            preferred_voice_id: voiceId,
            updated_at: new Date().toISOString(),
          },
        ], { onConflict: 'user_id' });
    
      if (error) {
        console.error("Database error:", error);
        return NextResponse.json(
          { 
            success: false,
            error: "Failed to update preference",
            friendly_message: "Sorry! Something went wrong while saving your preference. Please try again."
          },
          { status: 500 }
        );
      }
    
      return NextResponse.json({ success: true, data });
    
    } catch (err) {
      console.error("Server error:", err);
      return NextResponse.json(
        { 
          success: false,
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

    // Fetch the user's preference from 'user_preferences'
    const { data, error } = await supabase
      .from("user_preferences")
      .select("preferred_voice_id")
      .eq('user_id', user.id)  // Fetch only for the logged-in user

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { 
          error: "Failed to fetch voice preference",
          friendly_message: "Sorry! We couldn't load your voice preference. Please try again."
        },
        { status: 500 }
      );
    }

    // If the user doesn't have a preference, return a default response
    if (data?.length === 0) {
      return NextResponse.json(
        { 
          error: "No voice preference set",
          friendly_message: "You haven't set a voice preference yet. Please choose one."
        },
        { status: 404 }
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
