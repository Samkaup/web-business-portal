import { createContext } from 'react';
import React from 'react';
import { useSessionStorage } from 'usehooks-ts';
import useSlideOver, { useSlideOverType } from '@/hooks/useSlideOver';
import { TableRow } from '@/types';
import { useGetCompany } from './react_query_hooks/company';

type CompanyType = TableRow<'company'>;

export const Context = createContext<{
  company: CompanyType | null;
  setCompany: React.Dispatch<React.SetStateAction<CompanyType>>;
  companies: CompanyType[];
  slideOver: useSlideOverType;
}>({
  company: null,
  setCompany: () => {
    return true;
  },
  companies: [], // Initialize as an empty array
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  slideOver: {} as useSlideOverType,
});

export const ContextProvider = ({ children }) => {
  const [company, setCompany] = useSessionStorage<CompanyType | null>(
    'selected-company',
    undefined
  );
  const { data: companies } = useGetCompany();
  const slideOver: useSlideOverType = useSlideOver();

  if (typeof window !== 'undefined') {
    return (
      <Context.Provider value={{ company, setCompany, companies, slideOver }}>
        {children}
      </Context.Provider>
    );
    // Client-side rendering code
  } else {
    return children;
  }
};
