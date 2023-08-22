'use client';
import { Context } from '@/utils/context-store';
import { useState, useEffect, useContext } from 'react';
import Select from '@/components/ui/Select';
import supabase from '@/utils/supabase-browser';
import { getCompany } from '@/utils/supabase_queries/company';

export default function CompanySwitcher() {
  const { company, setCompany } = useContext(Context);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    async function fetchCompanies() {
      const fetchedCompanies = await getCompany(supabase);
      setCompanies(fetchedCompanies);
    }
    fetchCompanies();
  }, []);

  const updateCompany = (id: string) => {
    const selectedCompany = companies.find(
      (c) => c.external_identifier.toString() === id
    );
    setCompany(selectedCompany);
  };

  return (
    <>
      <div className="mr-2">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          <div>
            <Select
              options={companies.map((c) => ({
                id: c.external_identifier,
                label: c.name,
                key: c.external_identifier,
              }))}
              value={
                company
                  ? company.external_identifier
                  : companies.at(0)?.external_identifier
              }
              onChange={(e) => updateCompany(e.target.value)}
            />
          </div>
        </h3>
      </div>
    </>
  );
}
