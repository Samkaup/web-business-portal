import { useQuery } from '@tanstack/react-query';
import supabaseClient from '@/utils/supabase-browser';
import { getProfile, UserProfile } from '@/utils/supabase_queries/profile';

export const useGetProfile = () => {
  return useQuery<UserProfile>(['profile'], async () => {
    return getProfile(supabaseClient);
  });
};
