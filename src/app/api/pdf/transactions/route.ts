import type { NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/database.types';
import FormData from 'form-data';
import axios from 'axios';
import fs from 'fs';
import { generateHTML } from './htmlGenerator';
import path from 'path';
import { FilteredTransaction, TableRow } from '@/types';
import { getAllTransactions } from '@/utils/supabase_queries/transaction';
import { getLastStatement } from '@/utils/supabase_queries/statement';

type Ledger = FilteredTransaction;
type Company = TableRow<'company'>;
type Statement = TableRow<'statement'>;
function parseIcelandicDate(dateStr) {
  const parts = dateStr.split('-');
  return new Date(parts[2], parts[1] - 1, parts[0]);
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const dateFrom = requestUrl.searchParams.get('dateFrom');
  const dateTo = requestUrl.searchParams.get('dateTo');
  const companyId = requestUrl.searchParams.get('company');
  console.log(dateFrom, dateTo);
  if (!dateFrom && !dateTo) {
    return new Response('No date range provided', { status: 400 });
  }

  const parsedDateFrom = new Date(parseIcelandicDate(dateFrom));
  const parsedDateTo = new Date(parseIcelandicDate(dateTo));

  console.log(parsedDateFrom, parsedDateTo);
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) return new Response('Unauthorized', { status: 401 });

  const ledgers = await getAllTransactions({
    supabaseClient: supabase,
    dateRange: [parsedDateFrom, parsedDateTo],
    companyId: companyId
  });

  const { data: company } = await supabase
    .from('company')
    .select('*')
    .eq('external_identifier', companyId)
    .single();

  const statement = await getLastStatement({
    supabase,
    date: parsedDateTo,
    accountNumber: companyId
  });

  const pdfBytes = await generatePDF(ledgers, statement, company);

  return new Response(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="transactions-${dateFrom}-${dateTo}.pdf"`
    }
  });
}

const generatePDF = async (
  ledgers: Ledger[],
  statement: Statement,
  company: Company
) => {
  const formData = new FormData();
  formData.append(
    'instructions',
    JSON.stringify({
      parts: [
        {
          html: 'index.html',
          assets: [
            'style.css',
            'samkaup_logo_blue.png',
            'netto_logo.png',
            'krambudin_logo.png',
            'kjorbudin_logo.png',
            'iceland_logo.png'
          ],
          layout: {
            size: 'A4',
            margins: {
              top: 20,
              right: 20,
              bottom: 20,
              left: 20
            }
          }
        }
      ]
    })
  );

  // Append all files needed to build the PDF
  formData.append('index.html', generateHTML(ledgers, statement, company));
  formData.append(
    'style.css',
    fs.createReadStream(path.resolve('public/pdf/style.css'))
  );
  formData.append(
    'samkaup_logo_blue.png',
    fs.createReadStream(path.resolve('public/logos/samkaup_logo_blue.png'))
  );
  formData.append(
    'netto_logo.png',
    fs.createReadStream(path.resolve('public/logos/netto_logo.png'))
  );
  formData.append(
    'krambudin_logo.png',
    fs.createReadStream(path.resolve('public/logos/krambudin_logo.png'))
  );
  formData.append(
    'kjorbudin_logo.png',
    fs.createReadStream(path.resolve('public/logos/kjorbudin_logo.png'))
  );
  formData.append(
    'iceland_logo.png',
    fs.createReadStream(path.resolve('public/logos/iceland_logo.png'))
  );

  // Request to generate a PDF
  try {
    const response = await axios.post(
      'https://api.pspdfkit.com/build',
      formData,
      {
        headers: formData.getHeaders({
          Authorization: `Bearer ${process.env.PSPDFKIT_API_KEY}`
        }),
        responseType: 'stream'
      }
    );

    return response.data;
  } catch (e) {
    console.log(e);
    return new Response('Error', { status: 500 });
  }
};
