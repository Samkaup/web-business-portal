import {
  EnvelopeIcon,
  PhoneArrowUpRightIcon
} from '@heroicons/react/24/outline';
import { Badge } from '@/components/Shadcn/ui/badge';
import { DeleteItemButton } from '../DeleteItemButton/DeleteItemButton';
import { AlertTriangleIcon } from 'lucide-react';

export default function MemberContact({ contact, departmentName }) {
  return (
    <li
      key={contact.id}
      className="flex justify-between gap-x-6 px-4 py-5 hover:bg-company-600/10 sm:px-6"
    >
      <div className="items-center lg:min-w-96">
        <p className="mt-1 text-sm items-center leading-6 inline-flex text-gray-900">
          {contact.full_name} ({contact.external_identifier})
          {departmentName.replace('.', '') ===
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
        <DeleteItemButton
          id={contact.id}
          table="contact"
          verify={true}
        ></DeleteItemButton>
      </div>
    </li>
  );
}
