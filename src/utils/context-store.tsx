'use client';
import { createContext, useEffect, useState } from 'react';
import React from 'react';
import { useSessionStorage } from 'usehooks-ts';
import useSlideOver, { useSlideOverType } from '@/hooks/useSlideOver';
import { TableRow } from '@/types';

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
  const [isClient, setIsClient] = useState(false);
  const [company, setCompany] = useSessionStorage<CompanyType | null>(
    'selected-company',
    null
  );
  useEffect(() => {
    setIsClient(true);
  }, []);

  const slideOver: useSlideOverType = useSlideOver();
  if (isClient) {
    return (
      <Context.Provider value={{ company, setCompany, slideOver }}>
        {children}
      </Context.Provider>
    );
  } else {
    return <></>;
  }
};
