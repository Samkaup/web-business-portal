import { AppSupabaseClient, TableRow } from '@/types';

export const getContacts = async (
  supabase: AppSupabaseClient
): Promise<TableRow<'contact'>[]> => {
  const { data: contacts, error } = await supabase.from('contact').select('*');

  if (error) {
    console.log(error);
    throw error;
  }

  return contacts;
};

export const getContact = async (
  supabase: AppSupabaseClient,
  id: string
): Promise<TableRow<'contact'>> => {
  const { data: contact, error } = await supabase
    .from('contact')
    .select('*, department(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.log(error);
    throw error;
  }

  return contact;
};

export type DepartmentWithContacts = {
  closed: boolean | null;
  company_id: string | null;
  created_at: string | null;
  discount_scheme: string | null;
  external_identifier: string;
  name: string | null;
  updated_at: string | null;
  contact: Array<{
    cell_phone: string | null;
    closed: boolean | null;
    closed_at: string | null;
    created_at: string | null;
    department_id: string | null;
    email_address: string | null;
    external_identifier: string;
    full_name: string | null;
    main_contact: boolean | null;
    updated_at: string | null;
  }>;
};

export const getDepartmentsWithContacts = async (
  supabase: AppSupabaseClient
): Promise<DepartmentWithContacts[]> => {
  const { data: departments, error } = await supabase
    .from('department')
    .select('*, contact(*)');

  if (error) {
    console.log(error);
    throw error;
  }

  return departments;
};

export const getContactCount = async (
  supabase: AppSupabaseClient
): Promise<number> => {
  const { count, error } = await supabase
    .from('contact')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.log(error.message);
    throw error;
  }
  return count;
};
