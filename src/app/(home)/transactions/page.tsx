'use client';

import TransactionTable from './transactionTable';
import Header from '@/components/Header/Header';

export default async function HomePage() {
  return (
    <>
      <Header title="Hreyfingaryfirlit" />
      <TransactionTable />
    </>
  );
}
