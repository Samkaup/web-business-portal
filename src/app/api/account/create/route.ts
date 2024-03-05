import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/database.types';
import axios from 'axios';
import { NtlmClient, NtlmCredentials } from 'axios-ntlm';
import { z } from 'zod';

const bodySchema = z.object({
  no: z.string({
    required_error: ''
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
  accountNo: string;
  description: string;
  schemeCode: string;
  accountType: string;
  linkedToCustomerNo: string;
};

const createMemberAccountInBC = async ({
  accountNo,
  description,
  schemeCode,
  accountType,
  linkedToCustomerNo
}: ContactBCProps): Promise<boolean> => {
  const data = {
    No: accountNo,
    Description: description,
    Scheme_Code: schemeCode,
    Account_Type: accountType,
    Linked_To_Customer_No: linkedToCustomerNo
  };
  const credentials: NtlmCredentials = {
    username: process.env.BC_USER,
    password: process.env.BC_PASS,
    domain: ''
  };
  const client = NtlmClient(credentials);
  try {
    const response = await client.post(
      `${process.env.BC_API_URL}/MemberAccountCard`,
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
        `Error while creating BC member acount: ${response.status} ${response.statusText}`
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

  // Need to fetch scheme code from other departments or perhaps company?
  const didCreateUser = await createMemberAccountInBC({
    accountNo: body.department_number,
    description: body.department_name,
    schemeCode: body.department_scheme_code,
    accountType: body.account_type,
    linkedToCustomerNo: body.customer_number
  });
  if (!didCreateUser) {
    return new NextResponse(
      'Unable to create member account in subsystem, please wait or try again',
      { status: 400 }
    );
  }

  return new NextResponse('Member Account Created in subsystem', {
    status: 200
  });
}
