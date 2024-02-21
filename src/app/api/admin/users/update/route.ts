import { Database } from '@/lib/database.types';
import supabaseAdminClient from '@/utils/supabase-admin';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { TableRow } from '@/types';

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
type TBodyProps = {
  id: string;
  full_name: string;
  password: string;
  email: string;
  companies: string[];
};

export async function PUT(request: NextRequest, response: NextResponse) {
  const supabaseRouteClient = createRouteHandlerClient<Database>({ cookies });

  const {
    data: { session }
  } = await supabaseRouteClient.auth.getSession();

  if (!session) return new Response('Unauthorized', { status: 401 });

  if (session.user.app_metadata.userrole !== 'ADMIN')
    return new NextResponse('Forbidden', { status: 403 });

  // extract body from NextRequest
  const body: TBodyProps = await request.json();

  // Validate body
  try {
    bodySchema.parse(body);
  } catch (error) {
    return new NextResponse(error.errors, { status: 400 });
  }

  const supabase = supabaseAdminClient();
  const updateObj = {
    email: body.email,
    user_metadata: {
      full_name: body.full_name
    }
  };

  // Update user
  try {
    await supabase.auth.admin.updateUserById(body.id, updateObj);
  } catch (error) {
    return new Response(error.errors, { status: 400 });
  }

  // Update company profiles linked table
  // Get all company_profiles
  const { data: companyProfilesRaw } = await supabase
    .from('company_profile')
    .select('*')
    .eq('profile_id', body.id);

  const companyProfiles: TableRow<'company_profile'>[] | null =
    companyProfilesRaw as TableRow<'company_profile'>[] | null;

  // Delete companies requested to be removed
  for (const companyProfile of companyProfiles) {
    if (body.companies.includes(companyProfile.company_id) === false) {
      await supabase
        .from('company_profile')
        .delete()
        .eq('company_id', companyProfile.company_id)
        .eq('profile_id', body.id);
    }
  }

  // Add new companies
  for (const companyId of body.companies) {
    const hasNotBeenCreated =
      companyProfiles.filter(
        (companyProfile) => companyProfile.company_id === companyId
      ).length === 0;
    if (hasNotBeenCreated) {
      await supabase.from('company_profile').insert({
        profile_id: body.id,
        company_id: companyId
      });
    }
  }

  return new NextResponse('User Updated', { status: 200 });
}
