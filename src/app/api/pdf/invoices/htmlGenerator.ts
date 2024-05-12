import { TableRow } from '@/types';

type JoinedDepartment = TableRow<'department'> & {
  company: TableRow<'company'>;
};
export type JoinedTransaction = TableRow<'transaction'> & {
  department: JoinedDepartment;
  store: TableRow<'store'>;
};

export const generateHTML = (
  transaction: JoinedTransaction,
  transactionLines: TableRow<'transaction_line'>[],
  invoiceReference: string | null,
  contact?: TableRow<'contact'>
) => {
  const getContact = () => {
    if (!invoiceReference) return 'Enginn úttextaraðili skráður';
    if (!contact) return invoiceReference;
    return `${contact.full_name} (${contact.external_identifier})`;
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="style.css" rel="stylesheet" />
      </head>
      <body>
        <div class="watermark">AFRIT</div>
        <div class="bg-white p-10 m-10 text-xs">
          <div class="header">
            <div class="flex justify-between items-center mb-5">
              <div class="logo-container">
                <img class="logo" src="samkaup_logo_blue.png" alt="Samkaup Logo" />
              </div>
              <h2 class="text-2xl font-bold">REIKNINGUR</h2>
            </div>
            <p>Kt:571298-3769 Vsknr:60594</p>
            <p>Krossmóa 4</p>
            <p>260 REYKJANESBÆR</p>
            <p>Sími: 4215400</p>
            <p>www.samkaup.is</p>
            <div class="flex justify-between mt-10">
              <div>
                <p>${transaction.department.company.name}</p>
                <p>${transaction.department.company.address || ''}</p>
                <p>${transaction.department.company.post_code || ''} ${
    transaction.department.company.city || ''
  }</p>
              </div>
              <div class="text-right">
                <p>Reikningur: ${transaction.invoice_number}</p>
                <p>Dagsetning: ${transaction.date}</p>
                <p>Viðskiptanúmer: ${transaction.department.company_id}</p>
                <p>Kennitala: ${transaction.department.company_id}</p>
                <p>Gjalddagi: ${transaction.due_date}</p>
                <p>Verslun: ${transaction.store.name}</p>
                <p>Úttektaraðili: ${getContact()}</p>
              </div>
            </div>
          </div>
          ${generateTable(transaction, transactionLines)}
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

function generateTable(
  transaction: JoinedTransaction,
  items: TableRow<'transaction_line'>[]
) {
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
              <th>Vörunr.</th>
              <th>Lýsing</th>
              <th>Magn</th>
              <th class="price">Ein. Verð</th>
              <th class="price">Upphæð</th>
            </tr>
          </thead>
          <tbody>`;

  html =
    html +
    items
      .map((item: TableRow<'transaction_line'>) => {
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
              <td>${item.sku}</td>
              <td>${item.description}</td>
              <td>${item.quantity}</td>
              <td class="price">${item.sales_price.toFixed(2)} T</td>
              <td class="price">${item.line_amount}</td>
            </tr>`;
        } else {
          // No page break needed, render item normally
          return `<tr>
                <td>${item.sku}</td>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td class="price">${item.sales_price.toFixed(2)} T</td>
                <td class="price">${item.line_amount}</td>
              </tr>`;
        }
      })
      .join('');

  // Render the total amount and VAT
  html =
    html +
    `
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td class="price">Samtals</td>
              <td class="price">${transaction.amount_debit}</td>
            </tr>
            <tr>
              <td></td>
              <td>VSK stofn 11%=T ${Math.round(transaction.vat_dutiable1)}</td>
              <td>VSK Upph. ${Math.round(transaction.vat1)}</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td>VSK stofn 24%=S ${Math.round(transaction.vat_dutiable2)}</td>
              <td>VSK Upph. ${Math.round(transaction.vat2)}</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td class="price">Reikningsupphæð</td>
              <td class="price">${transaction.amount_debit}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>`;

  // Add a page break if the footer will exceed the maximum page height
  if (currentPageHeight > pageMaxHeight + 200)
    html =
      html + `<div style="break-before:page; height:${marginHeight};"></div>`;

  return (
    html +
    `<div class="mt-10 items-center">
        <p class="text-center mb-10">
          Reikningur þessi á uppruna í rafrænubókhaldi skv. reglugerð nr.
          505/2013
        </p>
        <div class="flex justify-end">
          <img class="brand-logo" src="netto_logo.png" alt="Nettó Logo" />
          <img
            class="brand-logo"
            src="krambudin_logo.png"
            alt="Krambúðin Logo"
          />
          <img
            class="brand-logo"
            src="kjorbudin_logo.png"
            alt="Kjörbúðin Logo"
          />
          <img class="brand-logo" src="iceland_logo.png" alt="Iceland Logo" />
        </div>
      </div>`
  );
}
