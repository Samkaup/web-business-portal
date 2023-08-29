'use client';
import Dashboard from '@/components/Dashboard/Dashboard';
import Header from '@/components/Header/Header';
import { Context } from '@/utils/context-store';
import { useContext } from 'react';

export default async function HomePage() {
  const { company } = useContext(Context);
  return (
    <>
      <Header title={company?.name}></Header>
      <div className="pt-10">
        <Dashboard></Dashboard>
      </div>
    </>
  );
}
