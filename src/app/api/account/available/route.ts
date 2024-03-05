import { Database } from '@/lib/database.types';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const supabaseRouteClient = createRouteHandlerClient<Database>({ cookies });

  const {
    data: { session }
  } = await supabaseRouteClient.auth.getSession();

  if (!session) return new Response('Unauthorized', { status: 401 });
  // TODO - FIX: this essentially allow anyone to delete a contact for any company.

  const requestUrl = new URL(request.url);
  const accountNo = requestUrl.searchParams.get('account_no');
  if (!accountNo) {
    return NextResponse.json(
      { error: 'Missing query parameters' },
      { status: 400 }
    );
  }

  const { error, data } = await supabaseRouteClient
    .from('department')
    .select('external_identifier')
    .eq('external_identifier', accountNo);

  if (error) {
    return NextResponse.json(
      { error: 'Could not query API for account number availability' },
      { status: 503 }
    );
  }

  return NextResponse.json({ available: data.length === 0 });
}
