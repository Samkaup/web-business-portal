import { format } from 'date-fns';
import {
  EnvelopeIcon,
  PhoneArrowUpRightIcon
} from '@heroicons/react/24/outline';
import { DeleteItemButton } from '../DeleteItemButton/DeleteItemButton';

export default function MemberContact({ contact }) {
  return (
    <li
      key={contact.id}
      className="flex justify-between gap-x-6 px-4 py-5 hover:bg-company-600/10 sm:px-6"
    >
      <div className="min-w-0 items-center">
        <p className="mt-1 text-sm inline-block leading-6 text-gray-900">
          {contact.full_name} ({contact.external_identifier})
        </p>
        <p className="mt-1 ml-2 inline-flex text-xs items-center leading-5 text-gray-500">
          {contact.email_address && (
            <a
              href={`mailto:${contact.email_address}`}
              className="inline-flex hover:underline items-center"
            >
              <EnvelopeIcon className="w-4 h-4 mr-1"></EnvelopeIcon>
              {contact.email_address}
            </a>
          )}
          {contact.cell_phone && (
            <a
              href={`tel:${contact.cell_phone}`}
              className="inline-flex hover:underline items-center ml-4"
            >
              <PhoneArrowUpRightIcon className="w-4 h-4 mr-1"></PhoneArrowUpRightIcon>
              {contact.cell_phone}
            </a>
          )}
        </p>
      </div>
      <div className="flex items-center gap-x-4">
        <div className="hidden sm:flex sm:flex-col sm:items-end">
          <p className="mt-1 text-xs leading-5 text-gray-500">
            {format(new Date(contact.created_at), 'dd. MMM HH:mm')}
          </p>
        </div>
        <DeleteItemButton
          id={contact.external_identifier}
          table="contact"
          verify={true}
        ></DeleteItemButton>
      </div>
    </li>
  );
}
