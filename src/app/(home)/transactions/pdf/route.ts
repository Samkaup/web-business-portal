import type { NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/database.types';
import FormData from 'form-data';
import axios from 'axios';
import fs from 'fs';
import { generateHTML } from './htmlGenerator';

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
    .select('*, department!inner(*, company(*))')
    .eq('id', id)
    .single();

  const pdfBytes = await generatePDF(transaction);

  return new Response(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="transaction-${id}.pdf"`
    }
  });
}

const lineItems = [
  {
    sku: '10023486',
    label: 'Okkar Kremkex 450g',
    quantity: 1,
    unitPrice: 499,
    amount: 499
  },
  {
    sku: '250801028',
    label: 'Crawf Kremkex Súkkulaði 500g',
    quantity: 1,
    unitPrice: 327,
    amount: 327
  },
  {
    sku: '241712103',
    label: 'Frón Mjólkurkex Gróft 400g',
    quantity: 2,
    unitPrice: 429,
    amount: 858
  }
];

const generatePDF = async (transaction: any) => {
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
  formData.append('index.html', generateHTML(transaction, lineItems));
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
    const errorString = await streamToString(e.response.data);
    console.log(errorString);
  }
};

function streamToString(stream: any) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: any) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err: any) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}
