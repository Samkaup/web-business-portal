import { TableRow } from '@/types';

type JoinedDepartment = TableRow<'department'> & {
  company: TableRow<'company'>;
};
export type JoinedTransaction = TableRow<'transaction'> & {
  department: JoinedDepartment;
  store: TableRow<'store'>;
};

export type LineItem = {
  sku: string;
  label: string;
  quantity: number;
  unitPrice: number;
  amount: number;
};

export const generateHTML = (
  transaction: JoinedTransaction,
  lineItems: LineItem[]
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
                <p>Ármúli 3 (STATIC)</p>
                <p>108 REYKJAVIK (STATIC)</p>
              </div>
              <div class="text-right">
                <p>Reikningur: ${transaction.invoice_number}</p>
                <p>Dagsetning: ${transaction.date}</p>
                <p>Viðskiptanúmer: ${transaction.department.company_id}</p>
                <p>Kennitala: ${transaction.department.company_id}</p>
                <p>Gjalddagi: ${transaction.due_date}</p>
                <p>Verslun: Nettó Ísafirði (STATIC)</p>
                <p>Úttekt af: 200760-3369 Eygló Jónsdóttir (STATIC)</p>
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
                    <th>Ein. Verð</th>
                    <th>Upphæð</th>
                  </tr>
                </thead>
                <tbody>
                  ${generateLineItemsHTML(lineItems)}
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>Samtals</td>
                    <td>${transaction.amount_debit}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>VSK stofn 11.00% = T 3.286 (STATIC)</td>
                    <td>VSK Upph. 361 (STATIC)</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>VSK stofn 24.00% = 40 (STATIC)</td>
                    <td>VSK Upph. 10 (STATIC)</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>Reikningsuppæð</td>
                    <td>${transaction.amount_debit}</td>
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

function generateLineItemsHTML(items: LineItem[]) {
  return items
    .map((item: any) => {
      return `<tr>
              <td>${item.sku}</td>
              <td>${item.label}</td>
              <td>${item.quantity}</td>
              <td>${item.unitPrice.toFixed(2)} T</td>
              <td>${item.amount}</td>
            </tr>`;
    })
    .join('');
}
