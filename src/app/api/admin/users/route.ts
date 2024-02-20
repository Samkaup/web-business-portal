import { Database } from '@/lib/database.types';
import supabaseAdminClient from '@/utils/supabase-admin';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const supabaseRouteClient = createRouteHandlerClient<Database>({ cookies });

  const {
    data: { session }
  } = await supabaseRouteClient.auth.getSession();

  if (!session) return new Response('Unauthorized', { status: 401 });

  if (session.user.app_metadata.userrole !== 'ADMIN')
    return new Response('Forbidden', { status: 403 });

  // Extract pageSize and page from query params
  const requestUrl = new URL(request.url);

  const pageSizeParam = Number(requestUrl.searchParams.get('pageSize'));
  const pageParam = Number(requestUrl.searchParams.get('page'));

  const pageSize = pageSizeParam > 0 ? pageSizeParam : 10;
  const page = pageParam > 0 ? pageParam : 1;

  const searchParam = requestUrl.searchParams.get('search');

  const supabase = supabaseAdminClient();

  let baseQuery = supabase
    .from('profile')
    .select('id, full_name, email, company(*)', { count: 'exact' })
    .range((page - 1) * pageSize, page * pageSize - 1)
    .order('full_name', { ascending: true });

  if (searchParam) {
    const searchTerm = `%${searchParam}%`;
    baseQuery = baseQuery.or(
      `full_name.ilike.${searchTerm},email.ilike.${searchTerm}`
    );
  }

  const profiles = await baseQuery;
  const lastPage = Math.ceil(profiles.count / pageSize);

  const pagination = {
    lastPage,
    nextPage: page + 1 > lastPage ? null : page + 1,
    total: profiles.count
  };

  const payload = {
    profiles: profiles.data,
    pagination
  };

  return Response.json(payload);
}
