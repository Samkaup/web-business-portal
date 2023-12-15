'use client';
import { createContext, useEffect } from 'react';
import React from 'react';
import { useSessionStorage } from 'usehooks-ts';
import useSlideOver, { useSlideOverType } from '@/hooks/useSlideOver';
import { TableRow } from '@/types';
import { useCompanies } from './react_query_hooks/company';

type CompanyType = TableRow<'company'>;

export const Context = createContext<{
  company: CompanyType | null;
  setCompany: React.Dispatch<React.SetStateAction<CompanyType>>;
  slideOver: useSlideOverType;
}>({
  company: null,
  setCompany: () => {
    return true;
  },
  slideOver: {} as useSlideOverType
});

export const ContextProvider = ({ children }) => {
  const { data: companies, isError } = useCompanies();
  const [company, setCompany] = useSessionStorage<CompanyType | null>(
    'selected-company',
    null
  );
  useEffect(() => {
    if (!company && companies && companies.length > 0) {
      setCompany(companies[0]);
    }
  }, [company, companies]);

  const slideOver: useSlideOverType = useSlideOver();

  if (isError) {
    return <div>Error loading companies</div>; // error state representation
  }
  return (
    <Context.Provider value={{ company, setCompany, slideOver }}>
      {children}
    </Context.Provider>
  );
};
