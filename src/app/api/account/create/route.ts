import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/database.types';
import axios from 'axios';
import { NtlmClient, NtlmCredentials } from 'axios-ntlm';
import { z } from 'zod';
import { createDepartment } from '@/utils/supabase_queries/department';

const bodySchema = z.object({
  department_number: z.optional(z.string()),
  department_name: z.string({
    required_error: 'Nafn deildar vantar'
  }),
  customer_number: z.string({
    required_error: 'Númer fyrirtæki vantar'
  })
});

type ContactBCProps = {
  accountNo?: string;
  description: string;
  schemeCode: string;
  linkedToCustomerNo: string;
};

type BCMemberAccountResponse = {
  '@odata.context': string;
  '@odata.etag': string;
  No: string;
  Description: string;
  Club_Code: string;
  Scheme_Code: string;
  Account_Type: string;
  Price_Group: string;
  Cust_Disc_Group: string;
  Linked_To_Customer_No: string;
  Expiration_Period_Type: string;
  Language_Code: string;
  Blocked: boolean;
  Date_Blocked: Date;
  Reason_Blocked: string;
  Blocked_By: string;
  No_Series: string;
};

const createMemberAccountInBC = async ({
  accountNo,
  description,
  schemeCode,
  linkedToCustomerNo
}: ContactBCProps): Promise<BCMemberAccountResponse> => {
  const credentials: NtlmCredentials = {
    username: process.env.BC_USER,
    password: process.env.BC_PASS,
    domain: ''
  };
  const client = NtlmClient(credentials);
  try {
    const data = {
      Description: description,
      Scheme_Code: schemeCode,
      Account_Type: 'Company',
      Linked_To_Customer_No: linkedToCustomerNo
    };
    if (accountNo) {
      data['No'] = accountNo;
    }
    const response = await client.post(
      `${process.env.BC_API_URL}/MemberAccountCard`,
      data,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const bcData: BCMemberAccountResponse = response.data;

    // Check if the response status is in the range of 2xx
    if (response.status >= 200 && response.status < 300) {
      return bcData;
    } else {
      throw Error(
        `Error while creating BC member acount: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
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
  const schemeCode = 'ENGINN'; //TODO: laga

  try {
    const bcUser = await createMemberAccountInBC({
      accountNo: body.department_number,
      description: body.department_name,
      schemeCode: schemeCode,
      linkedToCustomerNo: body.customer_number
    });

    console.log('BCUSER CREATED: ', bcUser);
    if (!bcUser.No) {
      throw new Error('Unable to create in BC system');
    }

    const department = {
      name: body.department_name,
      external_identifier: bcUser.No,
      discount_scheme: schemeCode,
      company_id: body.customer_number
    };

    await createDepartment({ supabase: supabaseRouteClient, department });
  } catch (e) {
    console.error(e);
    return new NextResponse('Error creating member account', { status: 503 });
  }

  return new NextResponse('Member Account Created in subsystem', {
    status: 200
  });
}
