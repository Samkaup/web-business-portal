import { useQuery } from '@tanstack/react-query';
import supabaseClient from '@/utils/supabase-browser';
import { getProfile, UserProfile } from '@/utils/supabase_queries/profile';
import { PaginationProps } from '../utilTypes';
import { TableRow } from '@/types';

export const useGetProfile = () => {
  return useQuery<UserProfile>(['profile'], async () => {
    return getProfile(supabaseClient);
  });
};

export type TCompany = TableRow<'company'>;
export type TProfile = {
  id: string;
  full_name: string;
  email: string;
  company: TCompany[];
};

export type ProfilesResponse = {
  pagination: {
    lastPage: number;
    nextPage: number | null;
    total: number;
  };
  profiles: TProfile[];
};

export const useGetProfiles = (search: string, pagination: PaginationProps) => {
  return useQuery<ProfilesResponse>(
    ['profiles', { search, pagination }],
    async () => {
      const res = await fetch(
        '/api/admin/users?' +
          new URLSearchParams({
            pageSize: pagination.pageSize.toString(),
            page: pagination.page.toString(),
            search
          }),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error('Failed to fetch profiles');
      }
      return data;
    }
  );
};
