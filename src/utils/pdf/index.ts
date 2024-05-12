import { format } from 'date-fns';

type Props = {
  url: string;
  identifier: string;
};

type InvoiceProps = {
  id: string;
};

type TransactionsProps = {
  dateFrom: Date;
  dateTo: Date;
  companyId: string;
};
export const downloadTransactionsPDF = async ({
  dateFrom,
  dateTo,
  companyId
}: TransactionsProps) => {
  const url = `/api/pdf/transactions?dateFrom=${format(
    dateFrom,
    'dd-MM-yyyy'
  )}&dateTo=${format(dateTo, 'dd-MM-yyyy')}&company=${companyId}`;
  await downloadPDF({
    url,
    identifier: `hreyfingar-${format(dateFrom, 'ddMMyyyy')}-${format(
      dateTo,
      'ddMMyyyy'
    )}`
  });
};
export const downloadInvoicesPDF = async ({ id }: InvoiceProps) => {
  const url = `/api/pdf/invoices?${new URLSearchParams({ id })}`;
  await downloadPDF({
    url,
    identifier: `reikningur-${id}`
  });
};

export const downloadPDF = async ({ url, identifier }: Props) => {
  const res = await fetch(`${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    throw new Error('Failed to download PDF');
  }

  const blob = await res.blob();
  const newBlob = new Blob([blob], {
    type: 'data:text/csv;charset=utf-8,'
  });

  const blobUrl = window.URL.createObjectURL(newBlob);

  const link = document.createElement('a');
  link.href = blobUrl;
  link.setAttribute('download', `${identifier}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);

  // clean up Url
  window.URL.revokeObjectURL(blobUrl);
};
