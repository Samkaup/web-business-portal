import { AppSupabaseClient, TableRow } from '@/types';
import { User } from '@supabase/auth-helpers-nextjs';

export type UserProfile = {
  user: User;
  profile: TableRow<'profile'>;
};

export const getProfile = async (
  supabase: AppSupabaseClient
): Promise<UserProfile> => {
  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();

  if (getUserError) {
    console.log(getUserError);
    throw getUserError;
  }

  const { data: profileData, error } = await supabase
    .from('profile')
    .select('*')
    .eq('id', user?.id)
    .single();

  if (error) {
    console.log(error);
    throw error;
  }

  return {
    profile: profileData,
    user: user,
  };
};
