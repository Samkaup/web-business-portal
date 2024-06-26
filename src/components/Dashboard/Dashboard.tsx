'use client';
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
  InformationCircleIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/Shadcn/ui/tooltip';
import { Chart } from '../Chart/Chart';
import { useTransactionsByMonth } from '@/utils/react_query_hooks/transaction';
import { LoadingBlock } from '../ui/LoadingBlock/LoadingBlock';
import { DepartmentWithContacts } from '@/utils/supabase_queries/department';
import { DateRange } from 'react-day-picker';
import { formatDate } from '@/utils/dateUtils';
import Header from '../Header/Header';
import { useCompany } from '@/hooks/useCompany';

export default function Dashboard() {
  const { data: dateRange } = useDateRange({ queryKey: 'dateRangeDashboard' });
  const { company } = useCompany();
  const calcDiffPercentage = (prev: number, curr: number) => {
    // Check if the previous value is 0 or undefined
    if (prev === 0 && curr > 0) {
      // If prev is 0 or undefined, a meaningful percentage change can't be calculated
      return '100';
    }
    if (prev === 0 && curr <= 0) {
      // If prev is 0 or undefined, a meaningful percentage change can't be calculated
      return '0';
    }

    // Calculate the percentage difference
    const difference = ((curr - prev) / prev) * 100;

    // Return the difference rounded to two decimal places
    return difference.toFixed(0);
  };
  const { data: transactionsByMonth, isLoading: isLoadingTransactionsByMonth } =
    useTransactionsByMonth(new Date().getFullYear());

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

  const InfoDateRange = ({ dateRange }: { dateRange: DateRange }) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <InformationCircleIcon className="w-4 h-4 inline-flex ml-1"></InformationCircleIcon>
          </TooltipTrigger>
          <TooltipContent>
            {dateRange && (
              <p>
                {formatDate(dateRange.from)} til {formatDate(dateRange.to)}
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <>
      <div className="flex-col md:flex">
        <div className="flex items-center justify-between space-y-2 flex-wrap">
          {company?.name && <Header title={company.name} />}
          <div className="flex items-center space-x-2 ">
            <CalendarDateRangePicker queryKey="dateRangeDashboard" />
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Yfirlit</TabsTrigger>
            <TabsTrigger value="reikningar">Reikningar</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Reikningsviðskipti
                    <InfoDateRange dateRange={dateRange}></InfoDateRange>
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
                        <p className="text-sm text-muted-foreground items-center flex">
                          <span className={cn('text-company-900 mr-1')}>
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
                    <InfoDateRange dateRange={dateRange}></InfoDateRange>
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
                    <InfoDateRange dateRange={dateRange}></InfoDateRange>
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
                          {transactions?.max > 0 && (
                            <>
                              {'hæst: '}
                              {formatCurrency(transactions?.max)}
                            </>
                          )}
                        </p>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Deildir</CardTitle>
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
                          {getContactsNumForDepartments(departmentWithContacts)}{' '}
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
                  <CardTitle>
                    Viðskipti á árinu ({new Date().getFullYear()})
                  </CardTitle>
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
    </>
  );
}
