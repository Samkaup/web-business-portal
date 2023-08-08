import { Table } from '@/types';
import { useQuery } from '@tanstack/react-query';
import supabaseClient from '@/utils/supabase-browser';
import { getProfile } from '@/utils/supabase_queries/profile';

export const useGetProfile = () => {
  return useQuery<Table<'profile'>>(['profile'], async () => {
    return getProfile(supabaseClient);
  });
};
