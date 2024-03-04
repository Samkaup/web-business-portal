import { Database } from '@/lib/database.types';
import supabaseAdminClient from '@/utils/supabase-admin';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function DELETE(request: NextRequest) {
  const supabaseRouteClient = createRouteHandlerClient<Database>({ cookies });

  const {
    data: { session }
  } = await supabaseRouteClient.auth.getSession();

  if (!session) return new Response('Unauthorized', { status: 401 });

  if (session.user.app_metadata.userrole !== 'ADMIN')
    return new NextResponse('Forbidden', { status: 403 });

  // Extract pageSize and page from query params
  const requestUrl = new URL(request.url);

  const id = requestUrl.searchParams.get('id');
  const supabase = supabaseAdminClient();
  const { data, error } = await supabase.auth.admin.deleteUser(id);

  if (error) {
    return new NextResponse(error.name, { status: 503 });
  }

  return NextResponse.json({ data }, { status: 200 });
}
