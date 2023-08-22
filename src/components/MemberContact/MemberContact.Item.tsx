import { ChevronRightIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { format } from 'date-fns';

export default function MemberContact({ contact }) {
  return (
    <li
      key={contact.id}
      className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-company-600/10 sm:px-6"
    >
      <div className="flex min-w-0 gap-x-4">
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-900">
            <Link href={`contacts/${contact.external_identifier}`}>
              <span className="absolute inset-x-0 -top-px bottom-0" />
              {contact.full_name}
            </Link>
          </p>
          <p className="mt-1 flex text-xs leading-5 text-gray-500">
            <a
              href={`mailto:${contact.email_address}`}
              className="relative truncate hover:underline"
            >
              {contact.email_address}
            </a>
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-x-4">
        <div className="hidden sm:flex sm:flex-col sm:items-end">
          <p className="text-sm leading-6 text-gray-900">
            {contact.cell_phone?.substring(0, 3)}{' '}
            {contact.cell_phone?.substring(3)}
          </p>
          <p className="mt-1 text-xs leading-5 text-gray-500">
            Bætt við: {format(new Date(contact.created_at), 'dd. MMM HH:mm')}
          </p>
        </div>
        <ChevronRightIcon
          className="h-5 w-5 flex-none text-gray-400"
          aria-hidden="true"
        />
      </div>
    </li>
  );
}
