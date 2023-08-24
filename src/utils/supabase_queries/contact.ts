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
