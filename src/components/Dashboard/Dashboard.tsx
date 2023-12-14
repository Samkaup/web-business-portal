'use client';

import Image from 'next/image';
import RecentTransactions from './RecentTransactions';
import { useTransactionSumByDate } from '@/utils/react_query_hooks/stats';
import { useDepartmentsWithContacts } from '@/utils/react_query_hooks/department';
import { formatCurrency } from '@/utils/currency/currency';
import { CalendarDateRangePicker } from '../DateRangePicker/DateRangePicker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../Shadcn/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../Shadcn/ui/card';
import { useDateRange } from '@/hooks/useDateRange';
import { Spinner } from '../ui/Spinner/Spinner';
import { addYears } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  ChartBarIcon,
  CreditCardIcon,
  DocumentIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { Chart } from '../Chart/Chart';
import { useTransactionsByMonth } from '@/utils/react_query_hooks/transaction';
import { LoadingBlock } from '../ui/LoadingBlock/LoadingBlock';
import { DepartmentWithContacts } from '@/utils/supabase_queries/department';

export default function Dashboard() {
  const { data: dateRange } = useDateRange({ queryKey: 'dateRangeDashboard' });
  const calcDiffPercentage = (prev: number, curr: number) => {
    // Check if the previous value is 0 or undefined
    if (!prev || prev === 0) {
      // If prev is 0 or undefined, a meaningful percentage change can't be calculated
      return '100';
    }

    // Calculate the percentage difference
    const difference = ((curr - prev) / prev) * 100;

    // Return the difference rounded to two decimal places
    return difference.toFixed(0);
  };
  const { data: transactionsByMonth, isLoading: isLoadingTransactionsByMonth } =
    useTransactionsByMonth(2023);

  const { data: departmentWithContacts, isLoading: isLoadingDepContacts } =
    useDepartmentsWithContacts();

  const { data: transactions, isLoading: isLoadingTransactionSum } =
    useTransactionSumByDate({
      dateFrom: dateRange?.from,
      dateTo: dateRange?.to
    });

  const { data: transactionsPrevYear, isLoading: isLoadingTransactionSumPrev } =
    useTransactionSumByDate({
      dateFrom: addYears(dateRange?.from, -1),
      dateTo: addYears(dateRange?.from, -1)
    });

  const getContactsNumForDepartments = (
    departments: DepartmentWithContacts[]
  ) => {
    let totalContacts = 0;

    departments.forEach((department) => {
      if (department.contact && Array.isArray(department.contact)) {
        totalContacts += department.contact.length;
      }
    });

    return totalContacts;
  };

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-company">
              Mælaborð
            </h2>
            <div className="flex items-center space-x-2">
              <CalendarDateRangePicker queryKey="dateRangeDashboard" />
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Yfirlit</TabsTrigger>
              <TabsTrigger value="reikningar">Reikningar</TabsTrigger>
              <TabsTrigger value="notifications">Tilkynningar</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Reikningsviðskipti
                    </CardTitle>
                    <CreditCardIcon className="text-gray-600 w-5 h-5"></CreditCardIcon>
                  </CardHeader>
                  <CardContent>
                    {isLoadingTransactionSum ? (
                      <Spinner />
                    ) : (
                      <>
                        <div className="text-2xl font-bold">
                          {transactions?.amount
                            ? formatCurrency(transactions.amount)
                            : '0 kr'}
                        </div>
                        {isLoadingTransactionSumPrev ? (
                          <Spinner />
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            <span className={cn('text-company-900')}>
                              {calcDiffPercentage(
                                transactionsPrevYear?.amount,
                                transactions?.amount
                              )}
                              %{' '}
                            </span>
                            frá síðasta ári
                          </p>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Fjöldi reikninga
                    </CardTitle>
                    <DocumentIcon className="w-5 h-5 text-gray-600"></DocumentIcon>
                  </CardHeader>
                  <CardContent>
                    {isLoadingTransactionSum ? (
                      <Spinner />
                    ) : (
                      <>
                        <div className="text-2xl font-bold">
                          {transactions?.count}
                        </div>
                        {isLoadingTransactionSumPrev ? (
                          <Spinner />
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            <span className={cn('text-company-900 ')}>
                              {calcDiffPercentage(
                                transactionsPrevYear?.count,
                                transactions?.count
                              )}
                              %{' '}
                            </span>
                            frá síðasta ári
                          </p>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Meðalupphæð
                    </CardTitle>
                    <ChartBarIcon className="w-5 h-5 text-gray-600"></ChartBarIcon>
                  </CardHeader>
                  <CardContent>
                    {isLoadingTransactionSum ? (
                      <Spinner />
                    ) : (
                      <>
                        <div className="text-2xl font-bold">
                          {transactions?.average
                            ? formatCurrency(Math.round(transactions?.average))
                            : '0 kr'}
                        </div>
                        {isLoadingTransactionSumPrev ? (
                          <Spinner />
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {' hæst: '}
                            {transactions?.max > 0 &&
                              formatCurrency(transactions?.max)}
                          </p>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Deildir
                    </CardTitle>
                    <UsersIcon className="w-5 h-5 text-gray-600"></UsersIcon>
                  </CardHeader>
                  <CardContent>
                    {isLoadingDepContacts ? (
                      <Spinner></Spinner>
                    ) : (
                      <>
                        <div className="text-2xl font-bold">
                          {departmentWithContacts?.length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          <span className="text-company-900">
                            {getContactsNumForDepartments(
                              departmentWithContacts
                            )}{' '}
                          </span>
                          úttektaraðilar skráðir
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Viðskipti á árinu</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    {isLoadingTransactionsByMonth ? (
                      <LoadingBlock></LoadingBlock>
                    ) : (
                      <Chart data={transactionsByMonth} />
                    )}
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Síðustu hreyfingar</CardTitle>
                    <CardDescription>
                      Reikningar, millifærslur eða greiðslur
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentTransactions />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="reikningar" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                  <CardTitle className="text-xl font-medium">
                    Reikningar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RecentTransactions limit={40}></RecentTransactions>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
