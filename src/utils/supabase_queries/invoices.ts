import { AppSupabaseClient, FilteredInvoices } from '@/types';
import { formatDate } from '../dateUtils';
import { QueryDataAndCount } from '../utilTypes';

export type Props = {
  supabaseClient: AppSupabaseClient;
  searchValue?: string | string[];
  dateRange?: Date[];
  departmentFilters?: string[];
  companyId?: string;
};

export const getInvoiceTable = async ({
  supabaseClient,
  searchValue,
  dateRange,
  companyId
}: Props): Promise<QueryDataAndCount<FilteredInvoices>> => {
  let query = supabaseClient.from('transaction').select(
    `id,
     date,
     invoice_number,
     amount_debit,
     description,
     store!inner (
       name
     ),
     department!inner (
       name,
       company_id
     )`,
    { count: 'exact' }
  );

  // Always sort by date
  query = query.order('date', { ascending: true });

  // Apply additional filters and search
  if (searchValue) {
    query = searchValue
      ? query.ilike('description', `%${searchValue}%`)
      : query;
  }

  // Set Date Range
  const start: Date | null = dateRange.at(0);
  const end: Date | null = dateRange.at(1);
  if (start) query = query.filter('date', 'gte', formatDate(start));
  if (end) query = query.filter('date', 'lte', formatDate(end));

  // Set company_id
  if (companyId) query = query.filter('department.company_id', 'eq', companyId);

  const { data, count, error } = await query;
  if (error) {
    console.error(error.message);
    throw error;
  }

  const updatedData = data.map((t) => ({
    id: t.id,
    date: t.date,
    department_name: t.department.name,
    store_name: t.store.name,
    invoice_number: t.invoice_number,
    description: t.description,
    amount: t.amount_debit
  }));

  return {
    data: updatedData,
    rowCount: count
  };
};
