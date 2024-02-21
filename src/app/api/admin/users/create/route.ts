import { Database } from '@/lib/database.types';
import supabaseAdminClient from '@/utils/supabase-admin';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';

const bodySchema = z.object({
  full_name: z.string({
    required_error: 'Vantar fullt nafn'
  }),
  email: z
    .string({
      required_error: 'Vantar netfang'
    })
    .email({ message: 'Netfang ekki á réttu formi.' }),
  companies: z.array(z.string())
});

export async function POST(request: NextRequest) {
  const supabaseRouteClient = createRouteHandlerClient<Database>({ cookies });

  const {
    data: { session }
  } = await supabaseRouteClient.auth.getSession();

  if (!session) return new NextResponse('Unauthorized', { status: 401 });

  if (session.user.app_metadata.userrole !== 'ADMIN')
    return new NextResponse('Forbidden', { status: 403 });

  // extract body from NextRequest
  const body = await request.json();

  // Validate body
  try {
    bodySchema.parse(body);
  } catch (error) {
    return new NextResponse(error.errors, { status: 400 });
  }

  const supabase = supabaseAdminClient();

  // Create user
  const userResponse = await supabase.auth.admin.createUser({
    email: body.email,
    // random password
    password: Math.random().toString(36).slice(-8),
    user_metadata: {
      full_name: body.full_name
    }
  });

  // Invite user
  await supabase.auth.admin.inviteUserByEmail(body.email);

  // Link profile to companies
  for (const companyId of body.companies) {
    await supabase.from('company_profile').insert({
      profile_id: userResponse.data.user.id,
      company_id: companyId
    });
  }

  return new NextResponse('User Created', { status: 200 });
}
