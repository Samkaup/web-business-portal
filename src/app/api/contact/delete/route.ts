import { Database } from '@/lib/database.types';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { NtlmClient, NtlmCredentials } from 'axios-ntlm';
import { AxiosRequestConfig } from 'axios';

type DeleteContactProps = {
  accountNo: string;
  contactNo: string;
};
const deleteContactInBC = async ({
  accountNo,
  contactNo
}: DeleteContactProps) => {
  const credentials: NtlmCredentials = {
    username: process.env.BC_USER,
    password: process.env.BC_PASS,
    domain: ''
  };

  const config: AxiosRequestConfig = {
    baseURL: process.env.BC_API_URL,
    method: 'DELETE'
  };

  const client = NtlmClient(credentials, config);

  const url = `/MemberContactCard('${accountNo}','${contactNo}')`;
  try {
    const response = await client.delete(url);
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    if (error.response) {
      // Output more detailed error information
      if (error.response.status == 404) {
        // already deleted then.. consider successful
        console.log(
          `Already deleted (${accountNo}, ${contactNo}), deleting locally`
        );
        return true;
      }
      console.error(
        `Error in deleteContactInBC: ${error.response.status} - ${error.response.statusText}`
      );
    } else {
      console.error(`Error in deleteContactInBC: ${error.message}`);
    }
    return false;
  }
};

export async function DELETE(request: NextRequest) {
  const supabaseRouteClient = createRouteHandlerClient<Database>({ cookies });

  const {
    data: { session }
  } = await supabaseRouteClient.auth.getSession();

  if (!session) return new Response('Unauthorized', { status: 401 });
  // TODO - FIX: this essentially allow anyone to delete a contact for any company.

  const requestUrl = new URL(request.url);
  const id = requestUrl.searchParams.get('id');
  const contactNo = requestUrl.searchParams.get('contact_no');
  const accountNo = requestUrl.searchParams.get('account_no');
  if (!contactNo || !accountNo) {
    return NextResponse.json(
      { error: 'Missing query parameters' },
      { status: 400 }
    );
  }
  const didDeleteContact = await deleteContactInBC({ contactNo, accountNo });

  if (didDeleteContact) {
    const { error } = await supabaseRouteClient
      .from('contact')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: 'Unable to delete contact' },
        { status: 400 }
      );
    }
  }

  return NextResponse.json({ success: didDeleteContact });
}
