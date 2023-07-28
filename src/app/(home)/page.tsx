import { type AppSupabaseClient } from '@/types';
import { getCompany } from '@/utils/supabase_queries/company';
import createClient from '@/utils/supabase-server';
import CompanyHeader from '@/components/CompanyHeader/CompanyHeader';

async function fetchData(supabaseClient: AppSupabaseClient) {
  return await getCompany(supabaseClient);
}

export default async function HomePage() {
  const supabase = createClient();
  const companyData = await fetchData(supabase);

  return (
    <>
      <CompanyHeader companies={companyData} />
      <div className="pt-10"></div>
    </>
  );
}
