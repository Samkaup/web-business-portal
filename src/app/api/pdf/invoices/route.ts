import type { NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/database.types';
import FormData from 'form-data';
import axios from 'axios';
import fs from 'fs';
import { JoinedTransaction, generateHTML } from './htmlGenerator';
import { TableRow } from '@/types';
import path from 'path';

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

  let contact: TableRow<'contact'> | undefined = undefined;

  if (transaction.invoice_reference) {
    const { data } = await supabase
      .from('contact')
      .select('*')
      .eq('external_identifier', transaction.invoice_reference)
      .single();

    if (data) contact = data;
  }

  const pdfBytes = await generatePDF(
    transaction,
    transactionLines,
    transaction.invoice_reference,
    contact
  );

  return new Response(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="transaction-${id}.pdf"`
    }
  });
}

const generatePDF = async (
  transaction: JoinedTransaction,
  transactionLines: TableRow<'transaction_line'>[],
  invoice_reference: string | null,
  contact?: TableRow<'contact'>
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
  formData.append(
    'index.html',
    generateHTML(transaction, transactionLines, invoice_reference, contact)
  );
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
