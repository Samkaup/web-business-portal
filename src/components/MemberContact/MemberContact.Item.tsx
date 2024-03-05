import {
  EnvelopeIcon,
  PhoneArrowUpRightIcon
} from '@heroicons/react/24/outline';
import { Badge } from '@/components/Shadcn/ui/badge';
import { AlertTriangleIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import Button from '../ui/Button/Button';
import ModalSimpleWithDismiss from '../ui/ModalSimpleWithDismiss/ModalSimpleWithDismiss';
import { Spinner } from '../ui/Spinner/Spinner';
import { useQueryClient } from '@tanstack/react-query';

export default function MemberContact({ contact, department }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorDeletingText, setErrorDeletingText] = useState('');
  const queryClient = useQueryClient();
  const verifyAction = async () => {
    setShowModal(true);
  };
  const deleteItem = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/contact/delete?id=${id}&account_no=${department.external_identifier}&contact_no=${contact.external_identifier}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const body = await response.json();

      if (body.success) {
        queryClient.invalidateQueries([`department_with_contacts`]);
        setErrorDeletingText('');
        setShowModal(false);
      } else {
        console.error(body, response.status);
        setErrorDeletingText('Operation unsuccessful');
      }
    } catch (e) {
      setErrorDeletingText(e.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <li
      key={contact.id}
      className="flex justify-between gap-x-6 px-4 py-5 hover:bg-company-600/10 sm:px-6"
    >
      <div className="items-center lg:min-w-96">
        <p className="mt-1 text-sm items-center leading-6 inline-flex text-gray-900">
          {contact.full_name} ({contact.external_identifier})
          {department.name.replace('.', '') ===
            contact.full_name.replace('.', '') && (
            <Badge
              variant="outline"
              className="ml-2"
              title="Ekki er mælt með því að hafa almenna deild sem úttektaraðila, þá er ekki hægt að rekja úttekt á viðkomandi sölu. "
            >
              Almennur úttektaraðili{' '}
              <AlertTriangleIcon className="w-4 h-4 ml-2 text-red-700/50"></AlertTriangleIcon>
            </Badge>
          )}
        </p>
        <p className="text-xs leading-5 text-gray-500">
          {contact.email_address && (
            <a
              href={`mailto:${contact.email_address}`}
              className="inline-flex hover:underline items-center"
            >
              <EnvelopeIcon className="w-4 h-4 mr-1"></EnvelopeIcon>
              {contact.email_address}
            </a>
          )}
        </p>
        <p className="text-xs leading-5 text-gray-500">
          {contact.cell_phone && (
            <a
              href={`tel:${contact.cell_phone}`}
              className="inline-flex hover:underline items-center"
            >
              <PhoneArrowUpRightIcon className="w-4 h-4 mr-1"></PhoneArrowUpRightIcon>
              {contact.cell_phone}
            </a>
          )}
        </p>
      </div>
      <div className="gap-x-4">
        <Button secondary onClick={verifyAction}>
          {loading ? (
            <Spinner></Spinner>
          ) : (
            <TrashIcon className="w-4 h-4 text-red-700"></TrashIcon>
          )}
        </Button>
        <ModalSimpleWithDismiss
          open={showModal}
          onAction={() => deleteItem(contact.id)}
          onCancel={() => setShowModal(false)}
          isLoading={loading}
          errorText={errorDeletingText}
        ></ModalSimpleWithDismiss>
      </div>
    </li>
  );
}
