import { HLChapter } from "@/types";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const handleSearch = async (
  query: string
): Promise<HLChapter[]> => {
  const supabase = createClientComponentClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('User not authenticated');
  }

  const response = await fetch('/api/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'An error occurred during search');
  }

  return response.json();
};
