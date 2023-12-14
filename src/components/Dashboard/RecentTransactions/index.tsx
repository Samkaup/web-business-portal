import { LoadingBlock } from '@/components/ui/LoadingBlock/LoadingBlock';
import { formatCurrency } from '@/utils/currency/currency';
import { useRecentTransactions } from '@/utils/react_query_hooks/transaction';
import { format } from 'date-fns';
import { is } from 'date-fns/locale';

export default function () {
  const { data: transactions, isLoading } = useRecentTransactions(6);
  return (
    <div className="space-y-8">
      {isLoading ? (
        <LoadingBlock></LoadingBlock>
      ) : (
        <>
          {transactions.map((transaction) => {
            return (
              <div className="flex items-center" key={transaction.id}>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(transaction.date), 'dd. LLL y', {
                      locale: is
                    })}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  {formatCurrency(transaction.amount_debit)}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
