'use client';

import Dashboard from '@/components/Dashboard/Dashboard';
import Header from '@/components/Header/Header';
import { useContext } from 'react';
import { Context } from '@/utils/context-store';

export default function HomePage() {
  const { company } = useContext(Context);

  return (
    <>
      <Header title={company.name} />
      <div className="pt-10">
        <Dashboard />
      </div>
    </>
  );
}
