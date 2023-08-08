import { Table } from '@/types';
import React from 'react';
import { createContext } from 'react';
import { useSessionStorage } from 'usehooks-ts';

type CompanyType = Table<'company'>;

export const Context = createContext<{
  company: CompanyType | undefined;
  setCompany: React.Dispatch<React.SetStateAction<CompanyType>>;
}>(undefined);

export const ContextProvider = ({ children }) => {
  const [company, setCompany] = useSessionStorage<CompanyType | undefined>(
    'selected-company',
    undefined
  );
  if (typeof window !== 'undefined') {
    return (
      <Context.Provider value={{ company, setCompany }}>
        {children}
      </Context.Provider>
    );
    // Client-side rendering code
  } else {
    return children;
  }
};
