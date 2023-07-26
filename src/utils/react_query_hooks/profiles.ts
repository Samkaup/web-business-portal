import { Table } from '@/types';
import { useQuery } from '@tanstack/react-query';
import supabaseClient from '@/utils/supabase-browser';
import { getProfile } from '@/utils/supabase_queries/profiles';

export const useGetProfile = () => {
  return useQuery<Table<'profiles'>>(['profile'], async () => {
    return getProfile(supabaseClient);
  });
};
