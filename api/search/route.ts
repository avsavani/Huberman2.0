import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { searchChapters } from '@/services/apiService';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json() as { query: string };

    if (!query) {
      console.error("Missing required parameter: query");
      return NextResponse.json({ error: 'Missing required parameter' }, { status: 400 });
    }

    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }

    const sanitizedQuery = query.replace(/\n/g, " ");
    const results = await searchChapters(sanitizedQuery, session.user);
    return NextResponse.json(results);

  } catch (error) {
    console.error("Unhandled error in /api/search:", error);
    if (error instanceof Error && error.message.includes('User not authenticated')) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
