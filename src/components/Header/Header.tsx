'use client';
import { ReactNode, Suspense } from 'react';
import { LoadingBlock } from '../ui/LoadingBlock/LoadingBlock';

type Props = {
  title?: string;
  children?: ReactNode;
};

export default function Header({ title, children }: Props) {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <div className="sm:flex sm:items-center sm:justify-between mb-5">
        <h2 className="text-3xl font-bold tracking-tight text-company">
          {title}
        </h2>
        <div className="mt-3 sm:ml-4 sm:mt-0">{children}</div>
      </div>
    </Suspense>
  );
}
