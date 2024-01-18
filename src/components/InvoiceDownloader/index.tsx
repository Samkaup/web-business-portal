import { downloadPDF } from '@/utils/pdf';
import { DocumentIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Spinner } from '../ui/Spinner/Spinner';
import toast from 'react-hot-toast';

type Props = {
  transactionID: string;
};

export default function InvoiceDownloadButton({ transactionID }: Props) {
  const [downloading, setDownloading] = useState<boolean>(false);

  const handleOnClick = () => {
    setDownloading(true);
    downloadPDF(transactionID)
      .then(() => setDownloading(false))
      .catch(() =>
        toast.error(
          'Ekki var hægt að hlaða niður reikning. Vinsamlegast reynið aftur eða hafið samband við þjónustuver Samkaupa.'
        )
      );
  };

  return (
    <button
      type="button"
      onClick={handleOnClick}
      className="hover:text-company-700 inline-flex items-center"
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
