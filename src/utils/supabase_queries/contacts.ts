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

export const getDepartmentsWithContacts = async (
  supabase: AppSupabaseClient
): Promise<any> => {
  const { data: departments, error } = await supabase
    .from('department')
    .select('*, contact(*)');
  // console.log(departments)

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
