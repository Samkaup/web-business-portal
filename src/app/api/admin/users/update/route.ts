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

export async function PUT(request: NextRequest, response: NextResponse) {
  const supabaseRouteClient = createRouteHandlerClient<Database>({ cookies });

  const {
    data: { session }
  } = await supabaseRouteClient.auth.getSession();

  if (!session) return new Response('Unauthorized', { status: 401 });

  if (session.user.app_metadata.userrole !== 'ADMIN')
    return new Response('Forbidden', { status: 403 });

  // extract body from NextRequest
  const body = await request.json();

  console.log('body', body);

  // Validate body
  try {
    bodySchema.parse(body);
  } catch (error) {
    return new Response(error.errors, { status: 400 });
  }

  const supabase = supabaseAdminClient();
  const updateObj = {
    email: body.email,
    user_metadata: {
      full_name: body.full_name
    }
  };
  if (body.password) {
    updateObj['password'] = body.password;
  }

  // Update user
  try {
    await supabase.auth.admin.updateUserById(body.id, updateObj);
  } catch (error) {
    return new Response(error.errors, { status: 400 });
  }

  // Update company profiles linked table
  const newCompanyProfiles = [];
  // Get all company_profiles
  const { data: companyProfiles } = await supabase
    .from('company_profile')
    .select('*')
    .eq('profile_id', body.id);

  // First check which companies are being removed or added
  for (const companyId of body.companies) {
    if (companyProfiles.filter((cp) => cp.company_id !== companyId)) {
      newCompanyProfiles.push({ id: companyId });
    }
  }
  // Add new companies
  for (const newCompany of newCompanyProfiles) {
    await supabase.from('company_profile').insert({
      profile_id: body.id,
      company_id: newCompany.id
    });
  }

  return new NextResponse('User Created', { status: 200 });
}
