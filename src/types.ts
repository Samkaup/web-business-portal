import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from './lib/database.types';

export type AppSupabaseClient = SupabaseClient<Database>;

export type TableName = keyof Database['public']['Tables'];
export type ViewName = keyof Database['public']['Views'];

export type RowName = TableName | ViewName;

export type TableRow<T extends TableName> =
  Database['public']['Tables'][T]['Row'];
export type ViewRow<T extends ViewName> = Database['public']['Views'][T]['Row'];

export type Row<T extends RowName> = T extends TableName
  ? TableRow<T>
  : T extends ViewName
  ? ViewRow<T>
  : never;

export type FilteredTransaction = {
  id: Row<'ledger_records'>['external_row_number'];
  date: Row<'ledger_records'>['date'];
  store_number: Row<'store'>['id'];
  department_name: Row<'department'>['name'];
  description: Row<'ledger_records'>['description'];
  amount_debit: Row<'ledger_records'>['amount_debit'];
};
