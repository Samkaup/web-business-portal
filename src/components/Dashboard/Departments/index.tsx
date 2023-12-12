import { Row } from '@/types';
import { useRecentDepartments } from '@/utils/react_query_hooks/department';
import classNames from '@/utils/style/classNames';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { Fragment } from 'react';

const statuses = {
  Greitt: 'text-green-700 bg-green-50 ring-green-600/20',
  Úttekið: 'text-gray-600 bg-gray-50 ring-gray-500/10',
  Eindagi: 'text-red-700 bg-red-50 ring-red-600/10'
};
const clients = [
  {
    id: 1,
    name: 'Deild_1',
    imageUrl: 'https://tailwindui.com/img/logos/48x48/tuple.svg',
    lastInvoice: {
      date: 'December 13, 2022',
      dateTime: '2022-12-13',
      amount: '129.923 kr',
      status: 'Eindagi'
    }
  },
  {
    id: 2,
    name: 'Deild_2',
    imageUrl: 'https://tailwindui.com/img/logos/48x48/tuple.svg',
    lastInvoice: {
      date: 'January 22, 2023',
      dateTime: '2023-01-22',
      amount: '49.231 kr',
      status: 'Greitt'
    }
  },
  {
    id: 3,
    name: 'Deild_3',
    imageUrl: 'https://tailwindui.com/img/logos/48x48/tuple.svg',
    lastInvoice: {
      date: 'January 23, 2023',
      dateTime: '2023-01-23',
      amount: '0 kr',
      status: 'Greitt'
    }
  }
];
export default function () {
  const departments = useRecentDepartments();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Staða deilda
          </h2>
          <Link
            href="/contacts"
            className="text-sm font-semibold leading-6 text-company-600 hover:text-company-500"
          >
            Skoða allar<span className="sr-only">, deildir</span>
          </Link>
        </div>
        <ul
          role="list"
          className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
        >
          {departments.isSuccess &&
            departments.data.map(
              (department: Row<'department'>, idx: number) => (
                <li
                  key={department.external_identifier}
                  className="overflow-hidden rounded-xl border border-gray-200"
                >
                  <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                    <img
                      src="https://tailwindui.com/img/logos/48x48/tuple.svg"
                      alt={department.name}
                      className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
                    />
                    <div className="text-sm font-medium leading-6 text-gray-900">
                      {department.name}
                    </div>
                    <Menu as="div" className="relative ml-auto">
                      <Menu.Button className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                        <span className="sr-only">Open options</span>
                        <EllipsisHorizontalIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? 'bg-gray-50' : '',
                                  'block px-3 py-1 text-sm leading-6 text-gray-900'
                                )}
                              >
                                Opna deild
                                <span className="sr-only">
                                  , {department.name}
                                </span>
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? 'bg-gray-50' : '',
                                  'block px-3 py-1 text-sm leading-6 text-gray-900'
                                )}
                              >
                                Breyta deild
                                <span className="sr-only">
                                  , {department.name}
                                </span>
                              </a>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                  <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                    <div className="flex justify-between gap-x-4 py-3">
                      <dt className="text-gray-500">Síðasta færsla</dt>
                      <dd className="text-gray-700">
                        <time dateTime={clients.at(idx).lastInvoice.dateTime}>
                          {clients.at(idx).lastInvoice.date}
                        </time>
                      </dd>
                    </div>
                    <div className="flex justify-between gap-x-4 py-3">
                      <dt className="text-gray-500">Staða á tímabili</dt>
                      <dd className="flex items-start gap-x-2">
                        <div className="font-medium text-gray-900">
                          {clients.at(idx).lastInvoice.date}
                        </div>
                        <div
                          className={classNames(
                            statuses[clients.at(idx).lastInvoice.status],
                            'rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset'
                          )}
                        >
                          {clients.at(idx).lastInvoice.status}
                        </div>
                      </dd>
                    </div>
                  </dl>
                </li>
              )
            )}
        </ul>
      </div>
    </div>
  );
}
