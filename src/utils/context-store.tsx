'use client';
import { createContext, useEffect, useState } from 'react';
import React from 'react';
import useSlideOver, { useSlideOverType } from '@/hooks/useSlideOver';

export const Context = createContext<{
  slideOver: useSlideOverType;
}>({
  slideOver: {} as useSlideOverType
});

export const ContextProvider = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const slideOver: useSlideOverType = useSlideOver();
  if (isClient) {
    return (
      <Context.Provider value={{ slideOver }}>{children}</Context.Provider>
    );
  } else {
    return <></>;
  }
};
