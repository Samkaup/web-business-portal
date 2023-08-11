import classNames from '@/utils/style/classNames';
import { ChangeEvent } from 'react';

type Option = {
  id: any;
  label: string;
};

type Props = {
  options: Option[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  defaultValue?: Option['id'];
  className?: string;
};

export default function Select({
  options,
  onChange,
  defaultValue = null,
  className,
}: Props) {
  return (
    <select
      onChange={onChange}
      defaultValue={defaultValue}
      className={classNames(
        'block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-company-600 sm:text-sm sm:leading-6',
        className
      )}
    >
      {options.map((o: Option) => (
        <option key={o.id} value={o.id}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
