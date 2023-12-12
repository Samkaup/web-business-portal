import { Row } from '@/types';
import { useRecentTransactions } from '@/utils/react_query_hooks/transaction';
import classNames from '@/utils/style/classNames';
import { ArrowUpCircleIcon } from '@heroicons/react/20/solid';
import { Fragment } from 'react';
const days = [
  {
    date: 'Today',
    dateTime: '2023-03-22'
  }
];

const statuses = {
  Greitt: 'text-green-700 bg-green-50 ring-green-600/20',
  Úttekið: 'text-gray-600 bg-gray-50 ring-gray-500/10',
  Eindagi: 'text-red-700 bg-red-50 ring-red-600/10'
};

export default function () {
  const recentTransactionQuery = useRecentTransactions();
  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mx-auto max-w-2xl text-base font-semibold leading-6 text-gray-900 lg:mx-0 lg:max-w-none">
          Síðustu færslur
        </h2>
      </div>
      <div className="mt-6 overflow-hidden border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <table className="w-full text-left">
              <thead className="sr-only">
                <tr>
                  <th>Upphæð</th>
                  <th className="hidden sm:table-cell">Reikningur</th>
                  <th>Skoða</th>
                </tr>
              </thead>
              <tbody>
                {days.map((day) => (
                  <Fragment key={day.dateTime}>
                    <tr className="text-sm leading-6 text-gray-900">
                      <th
                        scope="colgroup"
                        colSpan={3}
                        className="relative isolate py-2 font-semibold"
                      >
                        <time dateTime={day.dateTime}>{day.date}</time>
                        <div className="absolute inset-y-0 right-full -z-10 w-screen border-b border-gray-200 bg-gray-50" />
                        <div className="absolute inset-y-0 left-0 -z-10 w-screen border-b border-gray-200 bg-gray-50" />
                      </th>
                    </tr>
                    {recentTransactionQuery.isSuccess &&
                      recentTransactionQuery.data.map(
                        (transaction: Row<'transaction'>) => (
                          <tr key={transaction.id}>
                            <td className="relative py-5 pr-6">
                              <div className="flex gap-x-6">
                                <ArrowUpCircleIcon
                                  className="hidden h-6 w-5 flex-none text-gray-400 sm:block"
                                  aria-hidden="true"
                                />
                                <div className="flex-auto">
                                  <div className="flex items-start gap-x-3">
                                    <div className="text-sm font-medium leading-6 text-gray-900">
                                      {transaction.amount_debit} kr
                                    </div>
                                    <div
                                      className={classNames(
                                        statuses['Greitt'],
                                        'rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset'
                                      )}
                                    >
                                      Greitt
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
                              <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
                            </td>
                            <td className="hidden py-5 pr-6 sm:table-cell">
                              <div className="text-sm leading-6 text-gray-900">
                                {transaction['department'].name}
                              </div>
                              <div className="mt-1 text-xs leading-5 text-gray-500">
                                {transaction.store_number}
                              </div>
                            </td>
                            <td className="py-5 text-right">
                              <div className="flex justify-end">
                                <a
                                  href="#"
                                  className="text-sm font-medium leading-6 text-company-600 hover:text-company-500"
                                >
                                  Skoða færslu
                                  <span className="sr-only">
                                    , Rekningur #{transaction.invoice_number},{' '}
                                    {transaction.account_number}
                                  </span>
                                </a>
                              </div>
                              <div className="mt-1 text-xs leading-5 text-gray-500">
                                Reikningur{' '}
                                <span className="text-gray-900">
                                  #{transaction.invoice_number}
                                </span>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
