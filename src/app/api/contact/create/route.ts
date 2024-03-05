import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/database.types';
import axios from 'axios';
import { NtlmClient, NtlmCredentials } from 'axios-ntlm';
import { z } from 'zod';

const bodySchema = z.object({
  full_name: z.string({
    required_error: 'Vantar fullt nafn'
  }),
  external_identifier: z.string({
    required_error: 'Vantar netfang'
  }),
  account_number: z.string({
    required_error: 'Vantar deildarnúmer'
  }),
  cell_phone: z.string({
    required_error: 'Vantar símanúmer'
  })
});

type ContactBCProps = {
  contactNo: string;
  accountNo: string;
  name: string;
  emailAddress: string;
  mobilePhoneNo: string;
};

const createContactInBusinessCentral = async ({
  contactNo,
  accountNo,
  name,
  emailAddress,
  mobilePhoneNo
}: ContactBCProps): Promise<boolean> => {
  const data = {
    Contact_No: contactNo,
    Account_No: accountNo,
    Name: name,
    E_Mail: emailAddress,
    Mobile_Phone_No: mobilePhoneNo
  };
  const credentials: NtlmCredentials = {
    username: process.env.BC_USER,
    password: process.env.BC_PASS,
    domain: ''
  };
  const client = NtlmClient(credentials);
  try {
    const response = await client.post(
      `${process.env.BC_API_URL}/MemberContactCard`,
      data,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Check if the response status is in the range of 2xx
    if (response.status >= 200 && response.status < 300) {
      return true;
    } else {
      console.error(
        `Error while creating BC user: ${response.status} ${response.statusText}`
      );
      return false;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Axios error: ${error.message}`);
    } else {
      console.error(`Unexpected error: ${error}`);
    }
    return false;
  }
};

export async function POST(request: NextRequest) {
  const supabaseRouteClient = createRouteHandlerClient<Database>({ cookies });

  const {
    data: { session }
  } = await supabaseRouteClient.auth.getSession();

  if (!session) return new NextResponse('Unauthorized', { status: 401 });
  // TODO - FIX: this essentially allow anyone to create a contact for any company.

  const body = await request.json();

  // Validate body
  try {
    bodySchema.parse(body);
  } catch (error) {
    return new NextResponse(error.errors, { status: 400 });
  }

  const didCreateUser = await createContactInBusinessCentral({
    contactNo: body.external_identifier,
    accountNo: body.account_number,
    name: body.full_name,
    emailAddress: body.email_address,
    mobilePhoneNo: body.cell_phone
  });
  if (!didCreateUser) {
    return new NextResponse(
      'Unable to create user in subsystem, please wait or try again',
      { status: 400 }
    );
  }

  return new NextResponse('User Created in subsystem', { status: 200 });
}
