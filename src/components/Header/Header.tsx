import { ReactNode } from 'react';

type Props = {
  title?: string;
  children?: ReactNode;
};

export default function Header({ title, children }: Props) {
  return (
    <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between mb-5">
      <h3 className="font-semibold leading-6 text-gray-900 text-3xl ml-6">
        {title}
      </h3>
      <div className="mt-3 sm:ml-4 sm:mt-0">{children}</div>
    </div>
  );
}
