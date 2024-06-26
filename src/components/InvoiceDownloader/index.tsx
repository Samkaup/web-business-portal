import { downloadInvoicesPDF } from '@/utils/pdf';
import { DocumentIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Spinner } from '../ui/Spinner/Spinner';
import toast from 'react-hot-toast';

type Props = {
  id: string;
  btnText?: string;
};

export default function InvoiceDownloadButton({
  id,
  btnText = 'Reikningur'
}: Props) {
  const [downloading, setDownloading] = useState<boolean>(false);

  const handleOnClick = () => {
    setDownloading(true);
    downloadInvoicesPDF({ id })
      .then(() => setDownloading(false))
      .catch(() => {
        toast.error(
          'Ekki var hægt að hlaða niður reikningi. Vinsamlegast reynið aftur eða hafið samband við þjónustuver Samkaupa.'
        );
        setDownloading(false);
      });
  };

  return (
    <button
      type="button"
      onClick={handleOnClick}
      disabled={downloading}
      className="hover:text-company-700 inline-flex items-center"
    >
      {downloading ? (
        <Spinner className="mr-2" />
      ) : (
        <DocumentIcon className="h-4 w-4 mr-2" />
      )}
      {btnText}
    </button>
  );
}
