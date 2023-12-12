'use client';

import { Context } from '@/utils/context-store';
import { ReactNode, useContext } from 'react';

type Props = {
  children?: ReactNode;
};

export default function Header({ children }: Props) {
  const { company } = useContext(Context);

  return (
    <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between mb-5">
      <h3 className="font-semibold leading-6 text-gray-900 text-3xl ml-6">
        {company?.name}
      </h3>
      <div className="mt-3 sm:ml-4 sm:mt-0">{children}</div>
    </div>
  );
}
