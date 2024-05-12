import InvoiceDownloadButton from '@/components/InvoiceDownloader';
import { LoadingBlock } from '@/components/ui/LoadingBlock/LoadingBlock';
import { formatCurrency } from '@/utils/currency/currency';
import { useRecentTransactions } from '@/utils/react_query_hooks/transaction';
import { format } from 'date-fns';
import { is } from 'date-fns/locale';

type Props = {
  limit?: number;
};
export default function ({ limit = 6 }: Props) {
  const { data: transactions, isLoading } = useRecentTransactions(limit);
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
                    {transaction.store?.name}
                  </p>
                  <p className="text-sm text-muted-foreground pr-2">
                    {transaction.department?.name}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  <div>
                    <p>{formatCurrency(transaction.amount_debit)}</p>
                    <p className="text-sm text-muted-foreground pr-2">
                      {format(new Date(transaction.date), 'dd. LLL y', {
                        locale: is
                      })}
                    </p>
                  </div>
                </div>
                <div className="items-start">
                  <InvoiceDownloadButton id={transaction.id} btnText="" />
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
