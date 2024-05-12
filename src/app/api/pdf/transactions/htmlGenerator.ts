import { capitalizeFirstLetter } from '@/lib/utils';
import { FilteredTransaction, TableRow } from '@/types';
import { formatCurrency } from '@/utils/currency/currency';
import { format } from 'date-fns';
import { is } from 'date-fns/locale';

type Ledger = FilteredTransaction;
type Company = TableRow<'company'>;
type Statement = TableRow<'statement'>;

export const generateHTML = (
  ledgers: Ledger[],
  statement: Statement,
  company: Company
) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="style.css" rel="stylesheet" />
      </head>
      <body>
        <div class="bg-white p-10 m-10 text-xs">
          <div class="header">
            <div class="flex justify-between items-center mb-5">
              <div class="logo-container">
                <img class="logo" src="samkaup_logo_blue.png" alt="Samkaup Logo" />
              </div>
              <h2 class="text-2xl font-bold">Hreyfingar viðskiptamanns</h2>
            </div>
            <p>Kt:571298-3769 Vsknr:60594</p>
            <p>Krossmóa 4</p>
            <p>260 REYKJANESBÆR</p>
            <p>Sími: 4215400</p>
            <p>www.samkaup.is</p>
            <div class="flex justify-between mt-10">
              <div>
                <p>Dags skýrsla: ${format(new Date(), 'dd.MM.yyyy', {
                  locale: is
                })}</p>
                
              </div>
              <div class="text-right">
                  <p>Viðskipm.Númer: ${company.external_identifier}</p> 
                <p>${company.name}</p>
                <p>${company.address || ''}</p>
                <p>${company.city ? capitalizeFirstLetter(company.city) : ''} ${
    company.post_code ? `,${company.post_code}` : ''
  }</p>
              </div>
            </div>
          </div>
          ${generateTable(ledgers, statement)}
        </div>
        <div class="pspdfkit-footer">
          <div class="footer-columns">
            <span>{{pageNumber}}</span>
          </div>
        </div>
      </body>
    </html>
    `;
};

function generateTable(ledgers: Ledger[], statement: Statement) {
  let currentPageHeight = 0;
  let pageMaxHeight = 1000; // Example height in pixels, adjust based on your content and page size
  const marginHeight = '20mm'; // Margin height to be added at the top of a new page
  const itemHeight = 20; // Estimated height of a single item, adjust based on your actual item height

  let html = `
    <div class="mt-10">
      <div class="relative w-full overflow-auto">
        <table class="w-full">
          <thead>
            <tr class="border">
              <th>Dags.</th>
              <th>Fskj</th>
              <th>Texti</th>
              <th>Reikn. Nr</th>
              <th>Deild</th>
              <th class="price">Upphæð</th>
              <th class="price">Saldó</th>
            </tr>
          </thead>
          <tbody>`;

  html += `<tr>
  <td></td>
  <td></td>
  <td>Upphafsstaða</td>
  <td>${format(new Date(statement.from_date), 'dd.MM.yyyy')}</td>
  <td></td>
  <td class="price">${formatCurrency(statement.original_saldo)}</td>
  </tr>`;

  html += ledgers
    .map((ledger: Ledger) => {
      currentPageHeight += itemHeight;
      // Check if adding the current item exceeds the maximum page height
      if (currentPageHeight > pageMaxHeight) {
        currentPageHeight = 0;
        pageMaxHeight = 1540;

        return `
          </tbody>
        </table>
        <div style="break-before:page; height:${marginHeight};"></div>
        <table style="width: 100%;">
          <tbody>
            <tr>
              <td>${ledger.date}</td>
              <td>${ledger.voucher}</td>
              <td>${ledger.description}</td>
              <td>${
                ledger.description.startsWith('Reikn') && ledger.voucher
              }</td>
              <td>${ledger.department_name}</td>
              <td class="price">${formatCurrency(ledger.amount_debit)}</td>
              <td class="price">${formatCurrency(ledger.statement_saldo)}</td>
            </tr>`;
      } else {
        // No page break needed, render item normally
        return `<tr>
          <td>${ledger.date}</td>
          <td>${ledger.voucher}</td>
          <td>${ledger.description}</td>
          <td>${
            ledger.description.startsWith('Reikn') ? ledger.voucher : ''
          }</td>
          <td>${ledger.department_name}</td>
          <td class="price">${formatCurrency(ledger.amount_debit)}</td>
          <td class="price">${formatCurrency(ledger.statement_saldo)}</td>
              </tr>`;
      }
    })
    .join('');

  // Render the total amount and VAT
  html += `<tr>
          <td></td>
          <td></td>
          <td>Lokastaða</td>
          <td>${format(new Date(statement.to_date), 'dd.MM.yyyy')}</td>
          <td></td>
          <td class="price">${formatCurrency(statement.end_saldo)}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>`;

  // Add a page break if the footer will exceed the maximum page height
  if (currentPageHeight > pageMaxHeight + 200)
    html =
      html + `<div style="break-before:page; height:${marginHeight};"></div>`;

  return html;
}
