import { QueryDataAndCount } from '../utilTypes';
import { useCompany } from '@/hooks/useCompany';
import { useQuery } from '@tanstack/react-query';
import supabaseClient from '@/utils/supabase-browser';
import { getInvoiceTable } from '../supabase_queries/invoices';
import { FilteredInvoices } from '@/types';

type Props = {
  searchValue?: string | string[];
  dateRange?: Date[];
  filters?: string[];
};

export const useInvoiceTable = ({ searchValue, dateRange, filters }: Props) => {
  const { company } = useCompany();

  return useQuery<QueryDataAndCount<FilteredInvoices>>(
    [
      'invoiceTable',
      {
        searchValue,
        dateRange,
        filters,
        company
      }
    ],
    async () => {
      if (!company) {
        return { rowCount: 0, data: [] };
      }

      // Extract transactions
      return await getInvoiceTable({
        supabaseClient,
        dateRange,
        searchValue,
        companyId: company.external_identifier
      });
    },
    { keepPreviousData: true }
  );
};
