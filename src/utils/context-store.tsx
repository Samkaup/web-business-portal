import { TableRow } from '@/types';
import React, { useEffect, useState } from 'react';
import { createContext } from 'react';
import { useSessionStorage } from 'usehooks-ts';
import { getCompany } from './supabase_queries/company';
import supabase from '@/utils/supabase-browser';

type CompanyType = TableRow<'company'>;

export const Context = createContext<{
  company: CompanyType | null;
  setCompany: React.Dispatch<React.SetStateAction<CompanyType>>;
  companies: CompanyType[];
  setCompanies: React.Dispatch<React.SetStateAction<CompanyType[]>>;
}>(undefined);

export const ContextProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    async function fetchCompanies() {
      const fetchedCompanies = await getCompany(supabase);
      setCompanies(fetchedCompanies);
      if (!company && companies.length > 0) {
        setCompany(companies[0]);
      }
    }
    fetchCompanies();
  }, []);

  const [company, setCompany] = useSessionStorage<CompanyType | null>(
    'selected-company',
    undefined
  );
  if (typeof window !== 'undefined') {
    return (
      <Context.Provider
        value={{ company, setCompany, companies, setCompanies }}
      >
        {children}
      </Context.Provider>
    );
    // Client-side rendering code
  } else {
    return children;
  }
};
