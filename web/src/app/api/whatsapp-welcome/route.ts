// app/api/whatsapp-welcome/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Get API URL from environment variables
  const apiUrl = process.env.FUBUU_CORE_API_URL;

  // Validate environment variable
  if (!apiUrl) {
    return NextResponse.json(
      { error: 'API URL not configured' },
      { status: 500 },
    );
  }

  try {
    // Parse request body
    const { user_phone } = await request.json();

    // Validate required field
    if (!user_phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 },
      );
    }

    // Forward request to external service
    const externalResponse = await fetch(`${apiUrl}/whatsapp-welcome`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.FUBUU_CORE_API_KEY && {
          'X-Api-Key': process.env.FUBUU_CORE_API_KEY,
        }),
      },
      body: JSON.stringify({ user_phone }),
    });

    // Handle external service errors
    if (!externalResponse.ok) {
      const errorText = await externalResponse.text();
      return NextResponse.json(
        { error: errorText },
        { status: externalResponse.status },
      );
    }

    // Return successful response
    const responseData = await externalResponse.json();
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in WhatsApp welcome API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
