import { downloadPDF } from '@/utils/pdf';
import { DocumentIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Spinner } from '../ui/Spinner/Spinner';

type Props = {
  transactionID: string;
};

export default function InvoiceDownloadButton({ transactionID }: Props) {
  const [downloading, setDownloading] = useState<boolean>(false);

  const handleOnClick = () => {
    setDownloading(true);
    downloadPDF(transactionID).then(() => setDownloading(false));
  };

  return (
    <button
      type="button"
      onClick={handleOnClick}
      className="hover:text-company-700 inline-flex"
    >
      {downloading ? (
        <Spinner className="mr-2" />
      ) : (
        <DocumentIcon className="h-4 w-4 mr-2" />
      )}
      Reikningur
    </button>
  );
}
