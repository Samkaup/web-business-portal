import { AppSupabaseClient, Table } from '@/types';

export const getProfile = async (
  supabase: AppSupabaseClient
): Promise<Table<'profiles'>> => {
  const { data: userData, error: getUserError } = await supabase.auth.getUser();

  if (getUserError) {
    console.log(getUserError);
    throw getUserError;
  }

  const { data: profileData, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userData.user?.id)
    .single();

  if (error) {
    console.log(error);
    throw error;
  }

  return profileData;
};
