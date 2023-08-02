'use client';
import { TableRow } from '@/types';
import { useState } from 'react';

type Props = {
  companies?: TableRow<'company'>[];
};

export default function CompanyHeader({ companies = [] }: Props) {
  const [_, setSelectedCompany] = useState<string>(
    companies.at(0)['id'].toString()
  );

  return (
    <>
      <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          <div>
            <select
              id="location"
              name="location"
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              {companies.map((c) => (
                <option value={c.id} key={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </h3>
        <div className="mt-3 flex sm:ml-4 sm:mt-0">
          <button
            type="button"
            className="inline-flex items-center btn-outline rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Stillingar
          </button>
          {/* <button
            type="button"
            className="ml-3 inline-flex items-center rounded-md bg-company px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-company-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-company-900"
          >
            Velja annað fyrirtæki
          </button> */}
        </div>
      </div>
    </>
  );
}
