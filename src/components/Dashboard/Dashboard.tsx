'use client';
import classNames from '@/utils/style/classNames';
import RecentTransactions from './RecentTransactions';
import Departments from './Departments';
import { useEffect, useState } from 'react';
import { useTransactionSumByDate } from '@/utils/react_query_hooks/stats';
import {
  getDateDaysAgo,
  getDateNow,
  getEndOfMonth,
  getEndOfYear,
  getStartOfYear,
  getStartOfMonth,
} from '@/utils/dateUtils';
import { formatCurrency } from '@/utils/currency/currency';

const secondaryNavigation = [
  { name: 'Síðustu 7 dagar', id: 'last_7_days', href: '#' },
  { name: 'Þessi mánuður', id: 'current_month', href: '#' },
  { name: 'Þetta ár', id: 'this_year', href: '#' },
];
const stats = [
  {
    name: 'Upphæð',
    id: 'amount',
    value: '223.329 kr',
    changeType: 'positive',
  },
  {
    name: 'Staða á heimild',
    id: 'limit_status',
    value: '-14.002 kr',
    change: '',
    changeType: 'positive',
  },
  {
    name: 'Heimild á fyrirtæki',
    id: 'total_limit',
    value: '500.000 kr',
    change: '',
    changeType: 'positive',
  },
  {
    name: 'Fjöldi deilda',
    id: 'num_of_departments',
    value: '24',
    change: '',
    changeType: 'positive',
  },
];

export default function Dashboard() {
  const [dateFilter, setDateFilter] = useState('current_month');
  const [dateFrom, setDateFrom] = useState(getStartOfMonth);
  const [dateTo, setDateTo] = useState(getEndOfMonth);

  useEffect(() => {
    console.log(dateFilter);
    switch (dateFilter) {
      case 'current_month':
        setDateFrom(getStartOfMonth());
        setDateTo(getEndOfMonth());
        break;
      case 'this_year':
        setDateFrom(getStartOfYear());
        setDateTo(getEndOfYear());
        break;
      case 'last_7_days':
        setDateFrom(getDateDaysAgo(7));
        setDateTo(getDateNow());
        break;
    }
  }, [dateFilter]);

  const { data: transactionSum } = useTransactionSumByDate({
    dateFrom,
    dateTo,
  });

  return (
    <>
      <div className="relative isolate overflow-hidden">
        {/* Secondary navigation */}
        <header className="pb-4 pt-6 sm:pb-6">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Staðan
            </h1>
            <div className="order-last flex w-full gap-x-8 text-sm font-semibold leading-6 sm:order-none sm:w-auto sm:border-l sm:border-gray-200 sm:pl-6 sm:leading-7">
              {secondaryNavigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setDateFilter(item.id)}
                  className={
                    item.id === dateFilter
                      ? 'text-company-800'
                      : 'text-gray-700'
                  }
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="border-b border-b-gray-900/10 lg:border-t lg:border-t-gray-900/5">
          <dl className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:px-2 xl:px-0">
            {stats.map((stat, statIdx) => (
              <div
                key={stat.name}
                className={classNames(
                  statIdx % 2 === 1
                    ? 'sm:border-l'
                    : statIdx === 2
                    ? 'lg:border-l'
                    : '',
                  'flex items-baseline flex-wrap justify-between gap-y-2 gap-x-4 border-t border-gray-900/5 px-4 py-10 sm:px-6 lg:border-t-0 xl:px-8'
                )}
              >
                <dt className="text-sm font-medium leading-6 text-gray-500">
                  {stat.name}
                </dt>
                <dd
                  className={classNames('text-gray-700', 'text-xs font-medium')}
                >
                  {stat.change}
                </dd>
                <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
                  {stat.id === 'amount' ? (
                    <>{formatCurrency(transactionSum)}</>
                  ) : (
                    <>{stat.value}</>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="space-y-16 py-16 xl:space-y-20">
        <RecentTransactions />
        <Departments />
      </div>
    </>
  );
}
