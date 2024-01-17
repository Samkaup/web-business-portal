import type { NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/database.types';
import FormData from 'form-data';
import axios from 'axios';
import fs from 'fs';
import { JoinedTransaction, generateHTML } from './htmlGenerator';
import { TableRow } from '@/types';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const id = requestUrl.searchParams.get('id');

  if (!id) {
    return new Response('No id provided', { status: 400 });
  }

  const supabase = createRouteHandlerClient<Database>({ cookies });

  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) return new Response('Unauthorized', { status: 401 });

  const { data: transaction } = await supabase
    .from('transaction')
    .select('*, store(*), department!inner(*, company(*))')
    .eq('id', id)
    .single();

  if (!transaction) {
    return new Response('Not found', { status: 404 });
  }

  const { data: transactionLines } = await supabase
    .from('transaction_line')
    .select('*')
    .eq('invoice_number', transaction.invoice_number)
    .eq('sales_number', transaction.sales_number);

  const pdfBytes = await generatePDF(transaction, transactionLines);

  return new Response(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="transaction-${id}.pdf"`
    }
  });
}

const generatePDF = async (
  transaction: JoinedTransaction,
  transactionLines: TableRow<'transaction_line'>[]
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
          ]
        }
      ]
    })
  );

  // Append all files needed to build the PDF
  formData.append('index.html', generateHTML(transaction, transactionLines));
  formData.append('style.css', fs.createReadStream('./public/pdf/style.css'));
  formData.append(
    'samkaup_logo_blue.png',
    fs.createReadStream('./public/logos/samkaup_logo_blue.png')
  );
  formData.append(
    'netto_logo.png',
    fs.createReadStream('./public/logos/netto_logo.png')
  );
  formData.append(
    'krambudin_logo.png',
    fs.createReadStream('./public/logos/krambudin_logo.png')
  );
  formData.append(
    'kjorbudin_logo.png',
    fs.createReadStream('./public/logos/kjorbudin_logo.png')
  );
  formData.append(
    'iceland_logo.png',
    fs.createReadStream('./public/logos/iceland_logo.png')
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
  }
};
