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
  transactionLines: TableRow<'transaction_line'>[]
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
              </div>
            </div>
          </div>
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
                <tbody>
                  ${generateLineItemsHTML(transactionLines)}
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="price">Samtals</td>
                    <td class="price">${transaction.amount_debit}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="mt-10 items-center">
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
          </div>
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

function generateLineItemsHTML(items: TableRow<'transaction_line'>[]) {
  return items
    .map((item: TableRow<'transaction_line'>) => {
      return `<tr>
              <td>${item.sku}</td>
              <td>${item.description}</td>
              <td>${item.quantity}</td>
              <td class="price">${item.sales_price.toFixed(2)} T</td>
              <td class="price">${item.line_amount}</td>
            </tr>`;
    })
    .join('');
}
